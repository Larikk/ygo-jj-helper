import requests

response = requests.get(
    "https://db.ygoprodeck.com/api/v7/cardinfo.php?fname=danger")
data = response.json()
cards = data["data"]

for card in cards:
    if "Monster" in card["type"]:
        print(card["name"])

# Super Anti-Kaiju War Machine Mecha-Thunder-King
