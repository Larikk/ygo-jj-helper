import glob
import json
import os
import shutil
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup as bs
from . import simplepages as simplePages
import jjpy.banlist.web as web

WEBSITE_SRC_DIR = "website/"
STATIC_FILES_DIR = WEBSITE_SRC_DIR + "static/"
TEMPLATE_DIR = WEBSITE_SRC_DIR + "templates/"
PAGE_DIR = TEMPLATE_DIR + "pages/"
OUTPUT_DIR = "out/"


jinjaNoEscaping = Environment(
    loader=FileSystemLoader(searchpath="."),
)

jinjaWithEscaping = Environment(
    loader=FileSystemLoader(searchpath="."),
    autoescape=True
)

skeletonTemplate = jinjaNoEscaping.get_template(TEMPLATE_DIR + "skeleton.html")


def copyStaticFiles():
    paths = glob.glob(STATIC_FILES_DIR + "**", recursive=True)
    paths.sort()

    for path in paths:
        targetPath = OUTPUT_DIR + path.removeprefix(STATIC_FILES_DIR)
        if os.path.isdir(path):
            os.makedirs(targetPath, exist_ok=True)
            continue

        shutil.copyfile(path, targetPath)


def writeHtmlFile(path, content):
    content = bs(content, "html.parser").prettify()
    with open(path, "w") as f:
        f.write(content)


def renderSimplePage(page):
    title = page["title"]
    path = PAGE_DIR + page["path"]
    content = ""
    with open(path, "r") as f:
        content = f.read()

    s = skeletonTemplate.render(title=title, content=content)
    outputPath = OUTPUT_DIR + page["path"]
    writeHtmlFile(outputPath, s)


def renderBanlistPage(title, banlist, dropDownOptions, outputPath):
    templatePath = PAGE_DIR + "banlist.html"
    banlistTemplate = jinjaWithEscaping.get_template(templatePath)

    content = banlistTemplate.render(
        title=title,
        dropDownEntries=dropDownOptions,
        banlist=banlist,
    )

    s = skeletonTemplate.render(title=title, content=content)
    writeHtmlFile(outputPath, s)


def renderBanlistPages():
    banlistDir = OUTPUT_DIR + "banlists/"
    os.makedirs(banlistDir, exist_ok=True)
    banlists = web.buildBanlists()
    options = list(map(lambda b: {"id": b["id"], "name": b["name"]}, banlists))

    for banlist in banlists:
        title = "Banlist after Episode " + banlist["name"]
        outputPath = banlistDir + banlist["id"] + ".html"
        renderBanlistPage(title, banlist, options, outputPath)

    title = "Current Banlist"
    currentBanlist = banlists[-1]
    outputPath = OUTPUT_DIR + "banlist.html"
    renderBanlistPage(title, currentBanlist, options, outputPath)


def renderCardsetPage():
    cardsets = []
    with open("data/carddb/cardsets.json", "r") as f:
        cardsets = json.load(f)

    templatePath = PAGE_DIR + "cardsets.html"
    cardsetsContentTemplate = jinjaWithEscaping.get_template(templatePath)
    content = cardsetsContentTemplate.render(cardsets=cardsets)

    title = "Release"
    s = skeletonTemplate.render(title=title, content=content)
    outputPath = OUTPUT_DIR + "cardsets.html"
    writeHtmlFile(outputPath, s)


def main():
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for page in simplePages.pages:
        renderSimplePage(page)

    copyStaticFiles()
    renderCardsetPage()
    renderBanlistPages()


if __name__ == "__main__":
    main()
