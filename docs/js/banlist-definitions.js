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
    static MirrorForce = new Card("Mirror Force", Type.Trap)
    static Raigeki = new Card("Raigeki", Type.Spell)
    static SnatchSteal = new Card("Snatch Steal", Type.Spell)
    static TorrentialTribute = new Card("Torrential Tribute", Type.Trap)
    static BarrelDragon = new Card("Barrel Dragon", Type.EffectMonster)
    static CallOfTheHaunted = new Card("Call of the Haunted", Type.Trap)
    static UltimateOffering = new Card("Ultimate Offering", Type.Trap)
    static MorphingJar2 = new Card("Morphing Jar #2", Type.EffectMonster)
    static GiantTrunade = new Card("Giant Trunade", Type.Spell)
    static CyberJar = new Card("Cyber Jar", Type.EffectMonster)
    static DustTornado = new Card("Dust Tornado", Type.Trap)
    static SpearCretin = new Card("Spear Cretin", Type.EffectMonster)
    static RingOfDestruction = new Card("Ring of Destruction", Type.Trap)
    static HarpiesFeatherDuster = new Card("Harpie's Feather Duster", Type.Spell)
    static AntiSpellFragrance = new Card("Anti-Spell Fragrance", Type.Trap)
    static DarkDustSpirit = new Card("Dark Dust Spirit", Type.EffectMonster)
    static MagicCylinder = new Card("Magic Cylinder", Type.Trap)
    static HinoKaguTsuchi= new Card("Hino-Kagu-Tsuchi", Type.EffectMonster)
    static YamataDragon = new Card("Yamata Dragon", Type.EffectMonster)
    static MagicalScientist = new Card("Magical Scientist", Type.EffectMonster)
    static YataGarasu = new Card("Yata-Garasu", Type.EffectMonster)
    static GuardianSphinx = new Card("Guardian Sphinx", Type.EffectMonster)
    static PainfulChoice = new Card("Painful Choice", Type.Spell)
    static DarkMagicianOfChaos = new Card("Dark Magician of Chaos", Type.EffectMonster)
    static BlackLusterSoldierEnvoyOfTheBeginning = new Card("Black Luster Soldier - Envoy of the Beginning", Type.EffectMonster)
    static ChaosEmperorDragonEnvoyOfTheEnd = new Card("Chaos Emperor Dragon - Envoy of the End", Type.EffectMonster)
    static GracefulCharity = new Card("Graceful Charity", Type.Spell)
    static SwordsOfRevealingLight = new Card("Swords of Revealing Light", Type.Spell)
    static SinisterSerpent = new Card("Sinister Serpent", Type.EffectMonster)
    static LevelLimitAreaB = new Card("Level Limit - Area B", Type.Spell)
    static ChaosSorcerer = new Card("Chaos Sorcerer", Type.EffectMonster)
    static BlowbackDragon = new Card("Blowback Dragon", Type.EffectMonster)
    static WitchOfTheBlackForest = new Card("Witch of the Black Forest", Type.EffectMonster)
    static SkillDrain = new Card("Skill Drain", Type.Trap)
    static CardOfSafeReturn = new Card("Card of Safe Return", Type.Spell)
    static PotOfGreed = new Card("Pot of Greed", Type.Spell)
    static ColdWave = new Card("Cold Wave", Type.Spell)
    static HeavyStorm = new Card("Heavy Storm", Type.Spell)
    static TheCreator = new Card("The Creator", Type.EffectMonster)
    static Metamorphosis = new Card("Metamorphosis", Type.Spell)
    static Jinzo = new Card("Jinzo", Type.EffectMonster)
    static ChangeOfHeart = new Card("Change of Heart", Type.Spell)
    static CyberStein = new Card("Cyber-Stein", Type.EffectMonster)
    static AncientGearGolem = new Card("Ancient Gear Golem", Type.EffectMonster)
    static MonsterReborn = new Card("Monster Reborn", Type.Spell)
    static SolemnJudgement = new Card("Solemn Judgement", Type.Trap)
    static LimiterRemoval = new Card("Limiter Removal", Type.Spell)
    static DeckDevastationVirus = new Card("Deck Devastation Virus", Type.Trap)

}

function createDebugList() {
    let banned = Card.DebugCards.slice()
    return {
        id: "Debug",
        name: "Debug Part A",
        debug: true,
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
        banned: [],
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.DarkHole, from: Status.Unlimited, to: Status.Banned },
            { card: Card.ImperialOrder, from: Status.Unlimited, to: Status.Banned },
            { card: Card.MirrorForce, from: Status.Unlimited, to: Status.Banned },
            { card: Card.Raigeki, from: Status.Unlimited, to: Status.Banned },
            { card: Card.SnatchSteal, from: Status.Unlimited, to: Status.Banned },
            { card: Card.TorrentialTribute, from: Status.Unlimited, to: Status.Banned },
            { card: Card.BarrelDragon, from: Status.Unlimited, to: Status.Limited },
            { card: Card.CallOfTheHaunted, from: Status.Unlimited, to: Status.Limited },
        ],
        notes: [],
    }
}

function create2002B() {
    return {
        id: "2002B",
        name: "2002 Part 2",
        banned: [],
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.UltimateOffering, from: Status.Unlimited, to: Status.Banned },
            { card: Card.MorphingJar2, from: Status.Unlimited, to: Status.Banned },
            { card: Card.GiantTrunade, from: Status.Unlimited, to: Status.Banned },
            { card: Card.CyberJar, from: Status.Unlimited, to: Status.Limited },
            { card: Card.DustTornado, from: Status.Unlimited, to: Status.Limited },
            { card: Card.SpearCretin, from: Status.Unlimited, to: Status.Limited },
        ],
        notes: [],
    }
}

function create2003A() {
    return {
        id: "2003A",
        name: "2003 Part 1",
        banned: [],
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.RingOfDestruction, from: Status.Unlimited, to: Status.Banned },
            { card: Card.HarpiesFeatherDuster, from: Status.Unlimited, to: Status.Banned },
            { card: Card.AntiSpellFragrance, from: Status.Unlimited, to: Status.Banned },
            { card: Card.DarkDustSpirit, from: Status.Unlimited, to: Status.Banned },
            { card: Card.MagicCylinder, from: Status.Unlimited, to: Status.Banned },
            { card: Card.CyberJar, from: Status.Limited, to: Status.Banned },
            { card: Card.HinoKaguTsuchi, from: Status.Unlimited, to: Status.Limited },
            { card: Card.YamataDragon, from: Status.Unlimited, to: Status.Limited },
        ],
        notes: [],
    }
}

function create2003B() {
    return {
        id: "2003B",
        name: "2003 Part 2",
        banned: [],
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.MagicalScientist, from: Status.Unlimited, to: Status.Banned },
            { card: Card.YataGarasu, from: Status.Unlimited, to: Status.Banned },
            { card: Card.GuardianSphinx, from: Status.Unlimited, to: Status.Banned },
            { card: Card.HinoKaguTsuchi, from: Status.Limited, to: Status.Banned },
            { card: Card.YamataDragon, from: Status.Limited, to: Status.Banned },
            { card: Card.TorrentialTribute, from: Status.Banned, to: Status.Limited },
        ],
        notes: [],
    }
}

function create2004A() {
    return {
        id: "2004A",
        name: "2004 Part 1",
        banned: [],
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.PainfulChoice, from: Status.Unlimited, to: Status.Banned },
            { card: Card.DarkMagicianOfChaos, from: Status.Unlimited, to: Status.Banned },
            { card: Card.BlackLusterSoldierEnvoyOfTheBeginning, from: Status.Unlimited, to: Status.Banned },
            { card: Card.ChaosEmperorDragonEnvoyOfTheEnd, from: Status.Unlimited, to: Status.Banned },
            { card: Card.GracefulCharity, from: Status.Unlimited, to: Status.Banned },
            { card: Card.SwordsOfRevealingLight, from: Status.Unlimited, to: Status.Banned },
            { card: Card.SinisterSerpent, from: Status.Unlimited, to: Status.Limited },
            { card: Card.DarkHole, from: Status.Banned, to: Status.Limited },
            { card: Card.LevelLimitAreaB, from: Status.Unlimited, to: Status.Limited },
            { card: Card.BarrelDragon, from: Status.Limited, to: Status.Unlimited },
            { card: Card.ChaosSorcerer, from: Status.Unlimited, to: Status.Semilimited },
        ],
        notes: [],
    }
}

function create2004B() {
    return {
        id: "2004B",
        name: "2004 Part 2",
        banned: [],
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.BarrelDragon, from: Status.Unlimited, to: Status.Limited },
            { card: Card.BlowbackDragon, from: Status.Unlimited, to: Status.Limited },
            { card: Card.WitchOfTheBlackForest, from: Status.Unlimited, to: Status.Limited },
            { card: Card.SkillDrain, from: Status.Unlimited, to: Status.Banned },
            { card: Card.CardOfSafeReturn, from: Status.Unlimited, to: Status.Banned },
            { card: Card.PotOfGreed, from: Status.Unlimited, to: Status.Banned },
            { card: Card.ColdWave, from: Status.Unlimited, to: Status.Limited },
            { card: Card.HeavyStorm, from: Status.Unlimited, to: Status.Limited },
            { card: Card.GiantTrunade, from: Status.Banned, to: Status.Limited },
            { card: Card.TheCreator, from: Status.Unlimited, to: Status.Banned },
            { card: Card.Metamorphosis, from: Status.Unlimited, to: Status.Banned },
            { card: Card.Jinzo, from: Status.Unlimited, to: Status.Limited },
            { card: Card.MirrorForce, from: Status.Banned, to: Status.Limited },
        ],
        notes: [],
    }
}

function create2005A() {
    return {
        id: "2005A",
        name: "2005 Part 1",
        banned: [],
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.ChangeOfHeart, from: Status.Unlimited, to: Status.Banned },
            { card: Card.CyberStein, from: Status.Unlimited, to: Status.Banned },
            { card: Card.AncientGearGolem, from: Status.Unlimited, to: Status.Banned },
            { card: Card.BarrelDragon, from: Status.Limited, to: Status.Banned },
            { card: Card.BlowbackDragon, from: Status.Limited, to: Status.Banned },
            { card: Card.MirrorForce, from: Status.Limited, to: Status.Unlimited },
            { card: Card.TorrentialTribute, from: Status.Limited, to: Status.Unlimited },
            { card: Card.MonsterReborn, from: Status.Unlimited, to: Status.Limited },
            { card: Card.SolemnJudgement, from: Status.Unlimited, to: Status.Banned },
        ],
        notes: [],
    }
}

function create2005B() {
    return {
        id: "2005B",
        name: "2005 Part 2",
        banned: [],
        limited: [],
        semilimited: [],
        changes: [
            { card: Card.LimiterRemoval, from: Status.Unlimited, to: Status.Banned },
            { card: Card.DeckDevastationVirus, from: Status.Unlimited, to: Status.Banned },
            { card: Card.DustTornado, from: Status.Limited, to: Status.Semilimited },
        ],
        notes: [],
    }
}

// Primary banlists
// The concrete banned/limited cards are calculated by traversing
// trough all changes
const MAIN_BANLISTS = [
    create2002A(),
    create2002B(),
    create2003A(),
    create2003B(),
    create2004A(),
    create2004B(),
    create2005A(),
    create2005B(),
]

// Additional banlists
// Banned/limited cards must be hardcoded
const EXTRA_BANLISTS = [
    //createDebugList(),
]

const ALL_BANLISTS = [...MAIN_BANLISTS, ...EXTRA_BANLISTS]
