function load() {
    const divs = document.getElementsByClassName("text");
    Array.from(divs).forEach(element => {
        element.innerHTML = element.innerHTML.trim()
    });
}

window.addEventListener("load", () => load());
