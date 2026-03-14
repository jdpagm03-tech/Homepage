import { services } from "./state.js";

export function initSearch() {

    const searchInput = document.getElementById("search");

    searchInput.addEventListener("input", e=>{
        const q = e.target.value.toLowerCase();

        document.querySelectorAll(".card").forEach(card=>{
            const text = card.innerText.toLowerCase();
            card.style.display = text.includes(q) ? "block" : "none";
        });
    });

    searchInput.addEventListener("keydown", e=>{
        if(e.key === "Enter"){
            const q = e.target.value.trim();

            const match = services.find(s =>
                s.name.toLowerCase().includes(q.toLowerCase())
            );

            if(match){
                window.open(match.url, "_blank");
            } else {
                window.open("https://duckduckgo.com/?q=" + encodeURIComponent(q));
            }
        }
    });
}
