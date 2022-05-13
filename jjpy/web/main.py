import glob
import json
import os
import shutil
from jinja2 import Environment, FileSystemLoader
from bs4 import BeautifulSoup as bs
from . import simplepages as simplePages

WEBSITE_SRC_DIR = "website/"
STATIC_FILES_DIR = WEBSITE_SRC_DIR + "static/"
TEMPLATE_DIR = WEBSITE_SRC_DIR + "templates/"
PAGE_DIR = TEMPLATE_DIR + "pages/"
OUTPUT_DIR = "out/"


env = Environment(
    loader=FileSystemLoader(searchpath="."),
)

skeletonTemplate = env.get_template(TEMPLATE_DIR + "skeleton.html")


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


def renderCardsetPage():
    cardsets = []
    with open("data/carddb/cardsets.json", "r") as f:
        cardsets = json.load(f)

    templatePath = PAGE_DIR + "cardsets.html"
    cardsetsContentTemplate = env.get_template(templatePath)
    content = cardsetsContentTemplate.render(cardsets=cardsets)

    title = "Release"
    s = skeletonTemplate.render(title=title, content=content)
    outputPath = OUTPUT_DIR + "cardsets.html"
    writeHtmlFile(outputPath, s)


def main():
    # copyStaticFiles()
    renderCardsetPage()
    return
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    for page in simplePages.pages:
        renderSimplePage(page)


if __name__ == "__main__":
    main()
