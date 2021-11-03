function load() {
    const table = document.createElement("TABLE");
    table.classList.add("table")

    const header = document.createElement("TR");
    const columns = ["Date", "Name"];
    for (const column of columns) {
        const th = document.createElement("TH");
        th.textContent = column;
        header.appendChild(th);
    }

    table.appendChild(header);

    const keys = ["date", "name"]
     // cardsets is in cardsets-data.js
     for (const cardset of cardsets) {
        const tr = document.createElement("TR");
        for (const key of keys) {
            const td = document.createElement("TD");
            td.textContent = cardset[key];
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }

    const container = document.getElementById("cardsets");
    container.innerHTML = "";
    container.appendChild(table);
}

window.addEventListener("load", () => load());
