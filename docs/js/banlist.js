// https://stackoverflow.com/a/12646864
function shuffleArray(array) {
    array = array.slice()

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

    static Order = [
        this.NormalMonster,
        this.EffectMonster,
        this.RitualMonster,
        this.FusionMonster,
        this.SynchroMonster,
        this.XYZMonster,
        this.PendulumNormalMonster,
        this.PendulumEffectMonster,
        this.LinkMonster,
        this.Spell,
        this.Trap,
    ]
}

class Card {
    constructor(name, type) {
        this.name = name
        this.type = type
        this.typeIndex = Type.Order.indexOf(type)
    }

    // Just for testing colors and stuff
    static DebugCards = [
        new Card("1", Type.NormalMonster),
        new Card("7", Type.NormalMonster),
        new Card("A", Type.NormalMonster),
        new Card("7", Type.EffectMonster),
        new Card("B", Type.EffectMonster),
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
    let banned = Card.DebugCards.slice()
    banned.push(...Card.DebugCards)
    banned = shuffleArray(banned)
    return {
        id: "Debug",
        name: "Debug Part A",
        banned: banned,
        limited: [],
        semilimited: [
            Card.DarkHole
        ],
        changes: [
            { card: Card.DarkHole, from: Status.Unlimited, to: Status.Limited },
            { card: Card.DarkHole, from: Status.Unlimited, to: Status.Semilimited },
            { card: Card.DarkHole, from: Status.Unlimited, to: Status.Banned },
            { card: Card.DarkHole, from: Status.Semilimited, to: Status.Unlimited },
            { card: Card.DarkHole, from: Status.Banned, to: Status.Unlimited },
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

const cardComparator = (a, b) => {
    const typeDelta = a.typeIndex - b.typeIndex

    if (typeDelta !== 0) {
        return typeDelta
    }

    return a.name.localeCompare(b.name)
}

const changeComparator = (a, b) => {
    const fromDelta = a.from.amount - b.from.amount
    if (fromDelta !== 0) {
        return fromDelta
    }

    const toDelta = a.to.amount - b.to.amount
    if (toDelta !== 0 ) {
        return toDelta
    }

    return a.card.name.localeCompare(b.card.name)
}

function cardsToTable(cards, status) {
    status = status.name
    cards.sort(cardComparator)

    const table = document.createElement("table")
    table.classList.add("table", "table-borderless", "table-hover", "banlist-table")

    const thead = document.createElement("thead")
    const tbody = document.createElement("tbody")

    const headerRow = document.createElement("tr")
    headerRow.classList.add("banlist-table-header")

    // Card Type has non breaking space in the name
    for (const headerName of ["Card Type", "Card Name", "Current Status"]) {
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

function buildChangeList(changes) {
    changes.sort(changeComparator)
    console.log(changes)
    const changeList = document.createElement("ul")

    for (const change of changes) {
        const li = document.createElement("li")
        li.textContent = `${change.card.name}: ${change.from.name} \u{2794} ${change.to.name}`
        changeList.appendChild(li)
    }

    return changeList
}

function buildBanlist(banlist) {
    const headerTag = "h3"
    const domElements = []

    const sections = [
        {cards: banlist.banned, status: Status.Banned},
        {cards: banlist.limited, status: Status.Limited},
        {cards: banlist.semilimited, status: Status.Semilimited},
    ]

    for (const section of sections) {
        if (section.cards.length > 0) {
            const header = document.createElement(headerTag)
            header.textContent = section.status.name

            const table = cardsToTable(section.cards, section.status)
            
            const div = document.createElement("div")
            div.append(header, table)
            domElements.push(div)
        }
    }

    if (banlist.changes.length > 0) {
        const header = document.createElement(headerTag)
        header.textContent = "Changes"

        const changeList = buildChangeList(banlist.changes)

        const div = document.createElement("div")
        div.append(header, changeList)
        domElements.push(div)
    }
    
    const container = document.getElementById("banlist-container")
    container.replaceChildren(...domElements)
}

function load() {
    buildBanlist(lists[0])
}

window.addEventListener("load", () => load());
