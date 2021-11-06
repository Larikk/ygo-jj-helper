let selectedYear = null
let legalCards = null // used for ydk validation

// Validation result
let v = {
    NEUTRAL : 0,
    SUCCESS : 1,
    FAILURE : 2,
}

function alertFetchError(msg, response) {
    msg = msg + " " + response.body();
    alert(msg);
}

function setYDKValidateButtonEnabled(enabled) {
    document.getElementById("validate-ydk-button").disabled = !enabled;
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
    setYDKValidateButtonEnabled(true);
}

async function validateYdk() {
    displayValidationResult(["Working on it..."], v.NEUTRAL);
    setYDKValidateButtonEnabled(false);

    const ydk = document.getElementById("ydk-input").value;

    let ids = ydk.split("\n")
        .map(l => l.trim())
        .filter(l => l.match("^[0-9]+$"))
        .map(n => +n);

    ids = [... new Set(ids)];

    if (ids.length == 0) {
        displayValidationResult(["No card ids were found."], v.FAILURE);
        return;
    }

    if (!legalCards) {
        await fetchLegalCards();
    }

    const illegalIds = ids.filter(id => !legalCards.has(id));

    if (illegalIds.length == 0) {
        displayValidationResult(["No illegal cards found."], v.SUCCESS);
        button.disabled = false;
        return;
    }

    const url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?id=" + illegalIds.join(",")

    const response = await fetch(url);

    let lines = ["These cards are not legal for the selected year:"]

    if (response.ok) {
        lines.push("Could not determine the names so here are the ids at least:");
        lines = [...lines, ...illegalIds];
    } else {
        let cards = (await response.json()).data;
        cards = cards.map(c => c.name);
        lines = [...lines, ...cards];
    }
    
    displayValidationResult(lines, v.FAILURE);
}

function formatDate(date) {
    return new Date(date).toLocaleDateString("en-US");
}

function getCurrentYear() {
    return new Date().getFullYear();;
}

function setSectionVisibility(isVisible) {
    const sections = document.getElementsByClassName("requires-initialization");
    Array.from(sections).forEach(s => s.hidden = !isVisible)
}

function buildGalleryLink(startYear, endYear) {
    const url = new URL("https://db.ygoprodeck.com/search/");

    const params = new URLSearchParams();

    params.append("format", "tcg");
    params.append("view", "Gallery");
    params.append("dateregion", "tcg_date");
    params.append("startdate", startYear + "-01-01");
    params.append("enddate", endYear + "-12-31");

    url.search = params.toString();
    return url.toString();
}

function updateGalleryLinks(endYear) {
    document.getElementById("complete-gallery-link").href = buildGalleryLink(2000, endYear);
    document.getElementById("singleyear-gallery-link").href = buildGalleryLink(endYear, endYear);
}

async function fetchLegalCards() {
    const year = selectedYear;

    const params = new URLSearchParams();
    params.append("format", "tcg");

    // If year == currentYear we are just gonna request all  cards by not setting dates
    if (year != getCurrentYear()) {
        const startDate = "2000-01-01";
        const endDate = year + "-12-31";

        params.append("startdate", formatDate(startDate));
        params.append("enddate", formatDate(endDate));
    }

    const url = new URL("https://db.ygoprodeck.com/api/v7/cardinfo.php");
    url.search = params.toString();
    const response = await fetch(url);

    if (!response.ok) {
        alertFetchError("Could not fetch legal cards, show this to the dev.", response);
        throw response.json();
    }
    
    const _legalCards = new Set();
    const json = await response.json();
    const cards = json.data;
    for (const card of cards) {
        for (const cardVersion of card.card_images) {
            _legalCards.add(cardVersion.id);
        }
    }

    legalCards = _legalCards;
}

function initButtonPressed() {
    selectedYear = document.getElementById("year-selection").value;
    legalCards = null;
    updateGalleryLinks(selectedYear);
    setSectionVisibility(true);
}

function initYearSelection() {
    const currentYear = getCurrentYear();
    const yearSelect = document.getElementById("year-selection");

    // 2002 is already in the select element
    for (let i = 2002; i <= currentYear; i++) {
        const option = document.createElement("OPTION");
        option.value = i;
        option.textContent = i;
        yearSelect.appendChild(option);
    }

    yearSelect.children[0].selected = true;
}

window.addEventListener("load", () => initYearSelection());
