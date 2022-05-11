import json
import sqlite3
import os

DB_DIR = "EDO_CDB/"

SELECT_STATEMENT = """
    SELECT datas.id, datas.alias, texts.name
    FROM datas
    INNER JOIN texts ON datas.id = texts.id 
    WHERE instr(texts.name, '(GOAT)') OR instr(texts.name, '(Pre-Errata)')
    ORDER BY texts.name
"""


def find():
    databases = sorted(os.listdir(DB_DIR))
    databases = filter(lambda f: f.endswith(".cdb"), databases)

    hits = []
    encounteredIds = set()

    for db in databases:
        dbPath = DB_DIR + db
        with sqlite3.connect(dbPath) as con:
            cursor = con.cursor()
            cursor.execute(SELECT_STATEMENT)
            rows = cursor.fetchall()
            for row in rows:
                altId = row[0]
                mainId = row[1]
                name = row[2].strip()

                if altId in encounteredIds:
                    continue

                _type = "Unknown"
                if "(GOAT)" in name:
                    _type = "GOAT"
                elif "(Pre-Errata)" in name:
                    _type = "Pre-Errata"

                hits.append({
                    "altId": altId,
                    "mainId": mainId,
                    "type": _type,
                    "name": name,
                    "db": db
                })

                encounteredIds.add(altId)

    def f(hit): return hit["name"]
    hits.sort(key=f)
    return hits


if __name__ == "__main__":
    hits = find()
    print(json.dumps(hits, indent=4, ensure_ascii=False))
