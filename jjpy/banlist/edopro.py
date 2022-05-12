import glob
import os
import sys
from jjpy.carddb.carddb import CardDB
from . import common

DEPLOYMENT_DIR = "edo-lflist-deployment/"

ACTIVE_LISTS = {
    "jj-2008-p1",
}


def parseYear(name):
    parts = name.split("-")
    year = parts[1]
    return year


def prettifyName(name):
    return name.replace("-", " ").upper()


def createCardPool(cardDb, lfList, startdate="2000-01-01", enddate="3000-12-31"):

    def filterFunc(c): return startdate <= c["date"] <= enddate
    cards = cardDb.filter(filterFunc)

    unlimitedIds = set()
    for card in cards:
        id = card["id"]
        unlimitedIds.add(id)

    bannedCards = []
    limitedCards = []
    semilimitedCards = []
    unlimitedCards = []

    statusToCollectionMapping = {
        common.BANNED: bannedCards,
        common.LIMITED: limitedCards,
        common.SEMILIMITED: semilimitedCards,
    }

    for status, collection in statusToCollectionMapping.items():
        for card in lfList[status]:
            id = card["id"]
            unlimitedIds.remove(id)
            collection.append(card)

    for id in unlimitedIds:
        card, _ = cardDb.getCardById(id)
        unlimitedCards.append(card)

    pool = {
        common.BANNED: bannedCards,
        common.LIMITED: limitedCards,
        common.SEMILIMITED: semilimitedCards,
        common.UNLIMITED: unlimitedCards,
    }

    def sortKey(card): return card["name"].lower()
    for _, collection in pool.items():
        collection.sort(key=sortKey)

    return pool


def formatCard(n, id, name):
    return f"{id} {n}".ljust(20) + f"-- {name}\n"


def createConfFileContent(prettyName, cardPool):
    order = [
        common.BANNED, common.LIMITED, common.SEMILIMITED, common.UNLIMITED
    ]

    s = f"#[{prettyName}]\n!{prettyName}\n$whitelist\n"
    s += formatCard(1, 1, "Junior Journey Format")

    for i in range(len(order)):
        sectionTitle = order[i]
        n = i
        s += f"# {sectionTitle.upper()}\n"
        for card in cardPool[sectionTitle]:
            s += formatCard(n, card["id"], card["name"])
            for altVersion in card["unofficial_versions"]:
                s += formatCard(n, altVersion["alt_id"], altVersion["name"])

    return s


def writeConfFile(name, content):
    path = DEPLOYMENT_DIR

    if name.startswith("jj-") and name not in ACTIVE_LISTS:
        path = path + "archive/"

    os.makedirs(path, exist_ok=True)

    path = path + name + ".conf"
    with open(path, "w") as f:
        f.write(content)


def createConfFile(cardPool, fileName, prettyName):
    fileContent = createConfFileContent(prettyName, cardPool)
    writeConfFile(fileName, fileContent)


def cleanDeploymentDir():
    files = glob.glob(DEPLOYMENT_DIR + "/**/*.conf", recursive=True)
    for file in files:
        os.remove(file)


def getJuniorRoyaleChanges():
    files = glob.glob(common.CHANGE_DIR + "jr-*.ini")
    if len(files) > 1:
        print("Multiple Junior Royale files found")
        sys.exit()

    if len(files) == 0:
        return None

    return files[0]


def main():
    cleanDeploymentDir()
    cardDb = CardDB()
    lfLists = common.buildBanlists(cardDb)

    for lfList in lfLists:
        name = lfList["name"]
        prettyName = prettifyName(name)
        year = parseYear(name)
        enddate = year + "-12-31"
        cardPool = createCardPool(cardDb, lfList, enddate=enddate)
        createConfFile(cardPool, name, prettyName)

        # Create P0 format for next year
        if name.endswith("-p2"):
            year = int(year) + 1
            name = f"jj-{year}-p0"
            enddate = str(year) + "-12-31"
            prettyName = prettifyName(name)
            cardPool = createCardPool(cardDb, lfList, enddate=enddate)
            createConfFile(cardPool, name, prettyName)

    jrFile = getJuniorRoyaleChanges()
    if jrFile is not None:
        jrFile = common.parseChangeFile(cardDb, jrFile)

        baseLfList = lfLists[-1]
        year = parseYear(baseLfList["name"])
        enddate = year + "-12-31"
        name = jrFile["name"]
        prettyName = prettifyName(name)

        jrLfList = common.applyChanges(baseLfList, jrFile)
        cardPool = createCardPool(cardDb, jrLfList, enddate=enddate)
        createConfFile(cardPool, name, prettyName)


if __name__ == "__main__":
    main()
