import json
import math
import time
import requests
import os
from . import unofficialcards


def apiRequest(url):
    response = requests.get(url)

    if not response.ok:
        print("Request failed:" + url)

    content = response.json()

    return content


def getCards():
    url = "https://db.ygoprodeck.com/api/v7/cardinfo.php?misc=yes"
    data = apiRequest(url)
    cards = data["data"]
    return cards


def getCardsetsMap():
    url = "https://db.ygoprodeck.com/api/v7/cardsets.php"
    cardsets = apiRequest(url)

    # Key: lowercased name
    # Value: object with original name and date
    cardsetMap = dict()

    for cardset in cardsets:
        name = cardset["set_name"]
        key = name.lower()

        if "tcg_date" not in cardset:
            print("Skipping release because it has no date", name)
            continue

        cardsetMap[key] = cardset["tcg_date"]

    return cardsetMap


def getUnofficialCardsMap():
    hits = unofficialcards.find()

    map = dict()

    for hit in hits:
        mainId = hit["main_id"]

        if mainId not in map:
            map[mainId] = []

        map[mainId].append(hit)

    return map


def getFirstRelease(card, cardsetsMap):
    cardsets = card["card_sets"]

    earliestRelease = {
        "name": "Placeholder",
        "date": "9999-01-01",
    }

    for cardset in cardsets:
        name = cardset["set_name"]
        key = name.lower()

        if key not in cardsetsMap:
            print("Unknown release", name)
            continue

        release = cardsetsMap[key]

        if release < earliestRelease["date"]:
            earliestRelease = {
                "name": name,
                "date": release
            }

    return earliestRelease


def findMainId(card):
    # Alt artworks have in general the same id as the main artwork
    # There are two exceptions though: Dark Magician and Polymerization

    # YGOPRODECK assigns alt artworks their own ids
    # They start with the main id and increment upwards by one
    # To get the main id we just need to find the lowest id in 'card_images'

    # This works fine for all regular cards and Polymerization
    # The DM alt artwork has a lower id than the main artwork
    # Therefore we need to handle that separately
    if card['name'] == "Dark Magician":
        return 46986414

    def f(e): return e['id']
    ids = map(f, card['card_images'])
    mainId = min(ids)
    return mainId


types = [
    "Spell",
    "Trap",
    "Ritual",
    "Fusion",
    "Synchro",
    "XYZ",
    "Link",
    "Normal",
    "Effect",
]


def getCardTypes(card):
    _type = card["type"]
    result = []
    for t in types:
        if t in _type:
            result.append(t)
            break

    if "Pendulum" in _type:
        result.append("Pendulum")

    return result


def getAlternativeNames(card):
    names = []
    if "misc_info" in card:
        for entry in card["misc_info"]:
            if "beta_name" in entry:
                names.append(entry["beta_name"])
    return names


def buildDatabase():
    cards = getCards()
    cardSetsMap = getCardsetsMap()
    unofficialCardsMap = getUnofficialCardsMap()

    dbCards = []

    for card in cards:
        if "card_sets" not in card:
            continue

        firstRelease = getFirstRelease(card, cardSetsMap)
        mainId = findMainId(card)
        unofficialVersions = []
        if mainId in unofficialCardsMap:
            unofficialVersions = unofficialCardsMap[mainId]
        types = getCardTypes(card)
        altNames = getAlternativeNames(card)

        dbCards.append({
            "id": mainId,
            "name": card["name"],
            "date": firstRelease["date"],
            "unofficial_versions": unofficialVersions,
            "types": types,
            "alt_names": altNames,
        })

    db = {
        "creation_time": math.floor(time.time()),
        "cards": dbCards,
    }

    os.makedirs("data/carddb/", exist_ok=True)
    with open("data/carddb/db.json", "w") as f:
        json.dump(db, f, indent=4, ensure_ascii=False)


if __name__ == "__main__":
    buildDatabase()
