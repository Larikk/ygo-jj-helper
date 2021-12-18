
function makeIndexConstantAccess(array) {
    const map = new Map()

    for (let i = 0; i < array.length; i++) {
        map.set(array[i], i)
    }

    return map
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

    static EffectMonster = new Type("effect-bg")
    static Spell = new Type("spell-bg")
    static Trap = new Type("trap-bg")

    static _order = [
        this.EffectMonster,
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

    static DarkHole = new Card("Dark Hole", Type.Spell)
    static ImperialOrder = new Card("Imperial Order", Type.Trap)
}

function create2002A() {
    return {
        id: "2002A",
        name: "2002 Part 1",
        banned: [
            Card.DarkHole,
            Card.ImperialOrder,
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
    create2002A(),
]

function cardsToTable(cards, status) {
    status = status.name

    const table = document.createElement("table")
    table.classList.add("table", "table-hover", "table-striped", "table-bordered")

    const thead = document.createElement("thead")
    const tbody = document.createElement("tbody")

    const headerRow = document.createElement("tr")

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
        typeTd.classList.add("d-flex", "justify-content-center")

        const typeSpan = document.createElement("span")
        typeSpan.classList.add("type-box", card.type.css)
        typeSpan.textContent = "\u{200B}" // zero width non-breaking space
        typeTd.append(typeSpan)

        const nameTd = document.createElement("td")
        nameTd.textContent = card.name

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
