let selectedYear = null
let legalCards = null // used for ydk validation

// Some constants for validation
const NEUTRAL = 0;
const SUCCESS = 1;
const FAILURE = 2;

async function alertFetchError(msg, url, response) {
    msg = [msg, url, (await response.text())].join("\n\n");
    alert(msg);
}

function setYDKValidateButtonEnabled(enabled) {
    document.getElementById("validate-ydk-button").disabled = !enabled;
}


function getCurrentYear() {
    return new Date().getFullYear();;
}

function displayValidationResult(msg, status) {
    const output = document.getElementById("validation-result");
    output.classList.remove("text-success", "text-danger");

    if (status == SUCCESS) {
        output.classList.add("text-success");
    } else if (status == FAILURE) {
        output.classList.add("text-danger");
    }

    output.innerHTML = msg;
    setYDKValidateButtonEnabled(true);
}

async function fetchLegalCards() {
    const year = selectedYear;

    const params = new URLSearchParams();
    params.append("format", "tcg");

    // If year == currentYear we are just gonna request all  cards by not setting dates
    if (year != getCurrentYear()) {
        const startDate = "2000-01-01";
        const endDate = year + "-12-31";

        params.append("startdate", startDate);
        params.append("enddate", endDate);
    }

    const url = new URL("https://db.ygoprodeck.com/api/v7/cardinfo.php");
    url.search = params.toString();
    const response = await fetch(url);

    if (!response.ok) {
        await alertFetchError("Could not fetch legal cards, send this to the dev.", url, response);
        throw "Could not fetch legal cards";
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

async function validateYdk() {
    displayValidationResult("Working on it...", NEUTRAL);
    setYDKValidateButtonEnabled(false);

    const ydk = document.getElementById("ydk-input").value;

    let ids = ydk.split("\n")
        .map(l => l.trim())
        .filter(l => l.match("^[0-9]+$"))
        .map(n => +n);

    ids = [... new Set(ids)];

    if (ids.length == 0) {
        displayValidationResult("No card ids were found.", FAILURE);
        return;
    }

    if (!legalCards) {
        await fetchLegalCards();
    }

    const illegalIds = ids.filter(id => !legalCards.has(id));

    if (illegalIds.length == 0) {
        displayValidationResult("No illegal cards found.", SUCCESS);
        return;
    }

    const url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?id=" + illegalIds.join(",")

    const response = await fetch(url);

    let msg = "These cards are not legal for the selected year:\n";

    if (!response.ok) {
        msg += "Could not determine the names so here are the ids at least:\n";
        msg += illegalIds.join("\n");
    } else {
        let cards = (await response.json()).data;
        cards = cards.map(c => c.name);
        msg += cards.join("\n");
    }

    displayValidationResult(msg, FAILURE);
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

function setMockLoading(isLoading) {
    const shouldBeHidden = document.getElementsByClassName("hide-during-loading");
    Array.from(shouldBeHidden).forEach(s => s.hidden = isLoading);

    const shouldBeShown = document.getElementsByClassName("show-during-loading");
    Array.from(shouldBeShown).forEach(s => s.hidden = !isLoading);
}

function changeYear() {
    setMockLoading(true);

    selectedYear = document.getElementById("year-selection").value;
    legalCards = null;
    displayValidationResult("", NEUTRAL);
    updateGalleryLinks(selectedYear);

    setTimeout(() => setMockLoading(false), 250);
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
}

window.addEventListener("load", () => initYearSelection());
