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
        notes: [
            "This is just for testing purposes",
            "You should not be able to see this",
        ]
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
        notes: [],
    }
}

const banlists = [
    createDebugList(),
    create2002A(),
]
