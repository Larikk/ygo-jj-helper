function onBanlistSelect() {
    const banlistSelect = document.getElementById("banlist-selection")
    const id = banlistSelect.value
    window.location = "/ygo-jj-helper/banlists/" + id + ".html"
}