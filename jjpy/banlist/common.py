import json
import os
import configparser
import sys

from jjpy.carddb.carddb import CardDB

CHANGE_DIR = "data/banlist/changes/"

BANNED = "banned"
LIMITED = "limited"
SEMILIMITED = "semilimited"
UNLIMITED = "unlimited"


sectionTitlesWithCardNames = [
    BANNED,
    LIMITED,
    SEMILIMITED,
    UNLIMITED,
]


def parseChangeFile(path):
    parser = configparser.ConfigParser(
        allow_no_value=True,
        comment_prefixes=None,
    )

    parser.read(path)

    parsedFile = dict()
    for section in parser.sections():
        cardsInSection = []
        for cardname in parser[section]:
            cardsInSection.append(cardname)
        parsedFile[section] = cardsInSection

    name = path.split("/")[-1].split(".")[0]
    parsedFile["name"] = name

    return parsedFile


def parseAllChangeFiles():
    files = os.listdir(CHANGE_DIR)
    files = filter(lambda f: f.startswith("jj-"), files)
    files = sorted(files)

    parsedFiles = []
    for file in files:
        parsedFile = parseChangeFile(CHANGE_DIR + file)
        parsedFiles.append(parsedFile)

    return parsedFiles


def replaceCardNamesWithCardObjects(cardDb, parsedFiles):
    errorEncountered = False

    for parsedFile in parsedFiles:
        for sectionTitle in sectionTitlesWithCardNames:
            section = parsedFile[sectionTitle]
            for i in range(len(section)):
                cardName = section[i]
                card, ok = cardDb.getCardByName(cardName)
                if not ok:
                    errorEncountered = True
                section[i] = card

    if errorEncountered:
        print("Could not parse some card names. Exiting.")
        sys.exit()


def assertNoDuplicateCardsExist(parsedFile):
    encountered = []
    ok = True

    for sectionTitle in sectionTitlesWithCardNames:
        section = parsedFile[sectionTitle]
        for card in section:
            if card in encountered:
                print("Duplicate card found in one change file:", card["name"])
                ok = False
            else:
                encountered.append(card)

    if not ok:
        sys.exit()


def assertCorrectness(changeFiles):
    for changeFile in changeFiles:
        assertNoDuplicateCardsExist(changeFile)


def applyChanges(baseList, changeFile):
    lf = [BANNED, LIMITED, SEMILIMITED]

    newList = None

    if baseList is None:
        newList = {
            BANNED: [],
            LIMITED: [],
            SEMILIMITED: [],
            "changes": [],
        }
    else:
        newList = {}
        for status in lf:
            newList[status] = list(baseList[status])
        newList["changes"] = []

    for sectionTitle in sectionTitlesWithCardNames:
        for card in changeFile[sectionTitle]:
            _from = UNLIMITED
            to = sectionTitle

            for status in lf:
                if card in newList[status]:
                    newList[status].remove(card)
                    _from = status
                    break

            if to != UNLIMITED:
                newList[to].append(card)

            newList["changes"].append({
                "from": _from,
                "to": to,
                "card": card,
            })

    return newList


def buildBanlists(cardDb):
    changeFiles = parseAllChangeFiles()
    replaceCardNamesWithCardObjects(cardDb, changeFiles)
    assertCorrectness(changeFiles)

    prevList = None
    lfLists = []
    for changeFile in changeFiles:
        lfList = applyChanges(prevList, changeFile)
        lfList["name"] = changeFile["name"]
        lfLists.append(lfList)
        prevList = lfList

    return lfLists


if __name__ == "__main__":
    cardDb = CardDB()
    lfLists = buildBanlists(cardDb)
    print(json.dumps(lfLists, indent=4, ensure_ascii=False))
