import { services } from "./state.js";

/* ===============================
   URL NORMALIZATION
================================ */

function normalizeUrl(url) {

    if (!url) return "";

    url = url.trim();

    if (url.startsWith("http://") || url.startsWith("https://")) {
        return url;
    }

    return "https://" + url;
}

export function initSearch() {

    const searchInput = document.getElementById("search");

    /* LIVE FILTER */
    searchInput.addEventListener("input", e => {

        const q = e.target.value.toLowerCase();

        document.querySelectorAll(".card").forEach(card => {
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(q) ? "block" : "none";
        });
    });

    /* ENTER BEHAVIOR */
    searchInput.addEventListener("keydown", e => {

        if (e.key === "Enter") {

            const q = e.target.value.trim();
            if (!q) return;

            const match = services.find(s =>
                s.name.toLowerCase().includes(q.toLowerCase())
            );

            if (match) {
                window.open(normalizeUrl(match.url), "_blank");
            } else {
                window.open(
                    "https://duckduckgo.com/?q=" + encodeURIComponent(q),
                    "_blank"
                );
            }
        }
    });
}
