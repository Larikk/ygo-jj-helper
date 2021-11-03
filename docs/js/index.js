let cards = []
let cardsLowerCased = [] // used for more efficient searching
let cardIdMapping = {} // used for ydk validation

// Validation result
let v = {
    NEUTRAL : 0,
    SUCCESS : 1,
    FAILURE : 2,
}

function displayValidationResult(lines, status) {
    const output = document.getElementById("validation-result");
    output.classList.remove("text-success", "text-danger");

    if (status == v.SUCCESS) {
        output.classList.add("text-success");
    } else if (status == v.FAILURE) {
        output.classList.add("text-danger");
    }   

    output.innerHTML = lines.join("<br>")
}

function displayIllegalCards(cards) {
    const msg = "These cards are not legal in this time range:";

    cards = cards.map(c => c.name);

    const lines = [msg, ...cards]

    displayValidationResult(lines, v.FAILURE);
}

function validateYdk() {
    displayValidationResult(["Working on it..."], v.NEUTRAL)
    const ydk = document.getElementById("ydk-input").value;

    let ids = ydk.split("\n")
        .map(l => l.trim())
        .filter(l => l.match("^[0-9]+$"))
        .map(n => +n);

    
    ids = [... new Set(ids)]

    const illegalIds = ids.filter(n => !cardIdMapping[n]);

    if (illegalIds.length == 0) {
        displayValidationResult(["No illegal cards found."], v.SUCCESS)
        return;
    }

    fetch("https://db.ygoprodeck.com/api/v7/cardinfo.php?id=" + illegalIds.join(","))
        .then(r => r.json())
        .then(data => displayIllegalCards(data.data))
}

function displayCards(cards) {
    const cardsDisplay = document.getElementById("cards");
    cardsDisplay.value = cards.join("\n");
}


function searchCards() {
    const searchTerm = document.getElementById("input-card-search").value.toLowerCase();

    if (!searchTerm) {
        displayCards(cards);
        return
    }

    const filteredCards = [];

    for (let i = 0; i < cardsLowerCased.length; i++) {
        const card = cardsLowerCased[i];
        if (card.includes(searchTerm)) {
            filteredCards.push(cards[i]);
        }
    }

    displayCards(filteredCards);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US");
}

function setSectionVisibility(isVisible) {
    const sections = document.getElementsByClassName("requires-initialization");
    Array.from(sections).forEach(s => s.hidden = !isVisible)
}

function setCards(d) {
    cards = []
    cardsLowerCased = []
    cardIdMapping = {}

    for (let i = 0; i < d.length; i++) {
        const card = d[i]
        const name = card.name;
        cards[i] = name;
        cardsLowerCased[i] = name.toLowerCase();
        cardIdMapping[card.id] = name;
    }

    displayCards(cards);
    cardsListItems = document.getElementById("cards").children;
    document.getElementById("init-button").disabled = false;

    setSectionVisibility(true);
}

function fetchCards() {
    document.getElementById("init-button").disabled = true;
    setSectionVisibility(false);
    document.getElementById("input-card-search").value = "";
    let startDate = document.getElementById("date-from").value;
    let endDate = document.getElementById("date-to").value;

    const params = new URLSearchParams();

    // Only add the date params if one of the dates is set
    if (startDate || endDate) {
        startDate = startDate || "1990-01-01";
        endDate = endDate || "2100-12-31";

        if (startDate > endDate) {
            alert("Start date must be after the end date");
            document.getElementById("init-button").disabled = false;
            return;
        }

        params.append("startdate", formatDate(startDate));
        params.append("enddate", formatDate(endDate));
    }

    const url = new URL("https://db.ygoprodeck.com/api/v7/cardinfo.php");
    url.search = params.toString();
    fetch(url)
        .then(r => r.json())
        .then(body => setCards(body.data));
}
