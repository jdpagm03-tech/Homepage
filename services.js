import { services, collapsed, saveState } from "./state.js";

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

function getFavicon(url){
    try {
        const u = new URL(normalizeUrl(url));
        return `${u.origin}/favicon.ico`;
    } catch {
        return "https://via.placeholder.com/32";
    }
}

/* ===============================
   RENDER SERVICES
================================ */

export function renderServices() {

    const container = document.getElementById("categoriesContainer");
    container.innerHTML = "";

    const categories = [...new Set(services.map(s => s.category || "General"))];

    categories.forEach(category => {

        const wrapper = document.createElement("div");
        wrapper.className = "category";

        const header = document.createElement("div");
        header.className = "category-header";
        header.textContent = category;

        const toggle = document.createElement("span");
        toggle.textContent = collapsed[category] ? "+" : "−";
        header.appendChild(toggle);

        header.onclick = () => {
            collapsed[category] = !collapsed[category];
            saveState();
            renderServices();
        };

        const grid = document.createElement("div");
        grid.className = "category-grid";
        grid.dataset.category = category;

        if (collapsed[category]) {
            grid.classList.add("collapsed");
        }

        services
            .filter(s => (s.category || "General") === category)
            .sort((a, b) => a.order - b.order)
            .forEach(service => {

                const card = document.createElement("div");
                card.className = "card";
                card.draggable = true;
                card.dataset.id = service.id;

                card.innerHTML = `
                    <img src="${service.icon || getFavicon(service.url)}"
                         onerror="this.src='https://via.placeholder.com/32'">
                    <h3>${service.name}</h3>
                    <p>${service.desc}</p>
                `;

                card.onclick = () => {
                    window.open(normalizeUrl(service.url), "_blank");
                };

                grid.appendChild(card);
            });

        wrapper.appendChild(header);
        wrapper.appendChild(grid);
        container.appendChild(wrapper);
    });
}
