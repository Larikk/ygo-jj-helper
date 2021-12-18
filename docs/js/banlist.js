
function makeIndexConstantAccess(array) {
    const map = new Map()

    for (let i = 0; i < array.length; i++) {
        map.set(array[i], i)
    }

    return map
}

// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array
}

class Status {
    constructor(name, amount) {
        this.name = name
        this.amount = amount
    }

    static Banned = new Status("Banned", 0)
    static Limited = new Status("Limited", 1)
    static Semilimited = new Status("Semi-Limited", 2)
    static Unlimited = new Status("Unlimited", 3)
}

class Type {
    constructor(css) {
        this.css = css
    }

    static NormalMonster = new Type("normal-bg")
    static EffectMonster = new Type("effect-bg")
    static RitualMonster = new Type("ritual-bg")
    static FusionMonster = new Type("fusion-bg")
    static SynchroMonster = new Type("synchro-bg")
    static XYZMonster = new Type("xyz-bg")
    static PendulumNormalMonster = new Type("pendulum-normal-bg")
    static PendulumEffectMonster = new Type("pendulum-effect-bg")
    static LinkMonster = new Type("link-bg")
    static Spell = new Type("spell-bg")
    static Trap = new Type("trap-bg")

    static _order = [
        this.NormalMonster,
        this.EffectMonster,
        this.RitualMonster,
        this.FusionMonster,
        this.SynchroMonster,
        this.YXZMonster,
        this.PendulumNormalMonster,
        this.PendulumEffectMonster,
        this.LinkMonster,
        this.Spell,
        this.Trap,
    ]

    static Order = makeIndexConstantAccess(this._order)
}

class Card {
    constructor(name, type) {
        this.name = name
        this.type = type
    }

    // Just for testing colors and stuff
    static DebugCards = [
        new Card("7", Type.NormalMonster),
        new Card("7", Type.EffectMonster),
        new Card("7", Type.RitualMonster),
        new Card("7", Type.FusionMonster),
        new Card("7", Type.SynchroMonster),
        new Card("7", Type.XYZMonster),
        new Card("7", Type.PendulumNormalMonster),
        new Card("7", Type.PendulumEffectMonster),
        new Card("7", Type.LinkMonster),
        new Card("7", Type.Spell),
        new Card("7", Type.Trap),
    ]

    static DarkHole = new Card("Dark Hole", Type.Spell)
    static ImperialOrder = new Card("Imperial Order", Type.Trap)
}

function createDebugList() {
    return {
        id: "Debug",
        name: "Debug Part A",
        banned: Card.DebugCards.slice(),
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.DarkHole, from: Status.Unlimited, to: Status.Banned }
        ],
    }
}

function create2002A() {
    return {
        id: "2002A",
        name: "2002 Part 1",
        banned: [
            Card.DarkHole,
            Card.ImperialOrder,
            Card.DarkHole,
            Card.DarkHole,

        ],
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.DarkHole, from: Status.Unlimited, to: Status.Banned }
        ],
    }
}

const lists = [
    createDebugList(),
    create2002A(),
]

function cardsToTable(cards, status) {
    status = status.name

    const table = document.createElement("table")
    table.classList.add("table", "table-borderless", "table-hover", "banlist-table")

    const thead = document.createElement("thead")
    const tbody = document.createElement("tbody")

    const headerRow = document.createElement("tr")
    headerRow.classList.add("banlist-table-header")

    // Card Type has non breaking space in the name
    for (const headerName of ["Card\u{00A0}Type", "Card Name", "Status"]) {
        const th = document.createElement("th")
        th.textContent = headerName
        headerRow.appendChild(th)
    }

    headerRow.children[0].classList.add("text-center")
    headerRow.children[1].classList.add("card-name-column")
    headerRow.children[2].classList.add("text-center")

    thead.appendChild(headerRow)
    table.appendChild(thead)

    for (const card of cards) {
        const tr = document.createElement("tr")

        const typeTd = document.createElement("td")
        typeTd.classList.add(card.type.css)

        const nameTd = document.createElement("td")
        const link = document.createElement("a")
        link.classList.add("link-dark")
        link.href = "https://db.ygoprodeck.com/card/?search=" + card.name
        link.textContent = card.name
        nameTd.appendChild(link)

        const statusTd = document.createElement("td")
        statusTd.classList.add("text-center")
        statusTd.textContent = status

        tr.append(typeTd, nameTd, statusTd)
        tbody.appendChild(tr)
    }

    table.appendChild(tbody)
    return table
}

function load() {
    const divs = document.getElementsByClassName("text");
    Array.from(divs).forEach(element => {
        element.innerHTML = element.innerHTML.trim()
    });


    console.log(lists)
    const table = cardsToTable(lists[0].banned, Status.Banned)
    document.getElementsByClassName("root-container")[0].appendChild(table)
}

window.addEventListener("load", () => load());
