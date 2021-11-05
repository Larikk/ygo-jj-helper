import requests
import json

r = requests.get("https://db.ygoprodeck.com/api/v7/cardsets.php")

if r.status_code != 200:
    print("Request failed")
    exit(1)

cardsets = r.json()

entries = []

for c in cardsets:
    if "tcg_date" in c:
        entries.append({
            "date": c["tcg_date"],
            "name": c["set_name"]
        })

entries = sorted(entries, key=lambda e: e["date"])

with open("docs/js/cardsets-data.js", "w") as f:
    s = "const cardsets = "
    s += json.dumps(entries, indent=4)
    s += "\n"
    f.write(s)
