/* ===============================
   CONFIG
================================ */

const DEFAULT_LOCATION = "Paderborn,de";
const WEATHER_API_KEY = ""; // <-- PUT YOUR KEY HERE (leave empty to disable)

/* ===============================
   DOM REFERENCES
================================ */

const clockEl = document.getElementById("clock");
const dateEl = document.getElementById("date");
const searchInput = document.getElementById("search");
const categoriesContainer = document.getElementById("categoriesContainer");

const modal = document.getElementById("serviceModal");
const addServiceBtn = document.getElementById("addServiceBtn");
const saveBtn = document.getElementById("saveService");
const deleteBtn = document.getElementById("deleteService");
const cancelBtn = document.getElementById("cancelService");

const nameInput = document.getElementById("serviceName");
const urlInput = document.getElementById("serviceUrl");
const descInput = document.getElementById("serviceDesc");
const categoryInput = document.getElementById("serviceCategory");
const iconInput = document.getElementById("serviceIcon");

/* ===============================
   STATE
================================ */

let services = JSON.parse(localStorage.getItem("services")) || [];
let collapsed = JSON.parse(localStorage.getItem("collapsedCategories")) || {};
let editId = null;

/* ===============================
   CLOCK
================================ */

function updateClock() {
    const now = new Date();
    clockEl.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    dateEl.textContent = now.toLocaleDateString(undefined, {
        weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
}
setInterval(updateClock,1000);
updateClock();

/* ===============================
   WEATHER
================================ */

async function loadWeather(location = DEFAULT_LOCATION){

    if(!WEATHER_API_KEY){
        document.getElementById("weather-location").textContent = location;
        document.getElementById("weather-desc").textContent = "Weather disabled";
        document.getElementById("weather-temp").textContent = "";
        return;
    }

    try {
        const res = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${WEATHER_API_KEY}`
        );

        if(!res.ok) throw new Error("API error");

        const data = await res.json();

        document.getElementById("weather-temp").textContent =
            Math.round(data.main.temp) + "°C";

        document.getElementById("weather-desc").textContent =
            data.weather[0].description;

        document.getElementById("weather-location").textContent =
            data.name;

    } catch {
        document.getElementById("weather-desc").textContent = "Weather unavailable";
    }
}
loadWeather();

/* ===============================
   UTILITIES
================================ */

function saveState(){
    localStorage.setItem("services", JSON.stringify(services));
    localStorage.setItem("collapsedCategories", JSON.stringify(collapsed));
}

function normalizeUrl(url){
    if(!url.startsWith("http://") && !url.startsWith("https://")){
        return "http://" + url;
    }
    return url;
}

function getFavicon(url){
    try{
        const normalized = normalizeUrl(url);
        const u = new URL(normalized);
        return `${u.origin}/favicon.ico`;
    }catch{
        return "https://www.google.com/s2/favicons?sz=64&domain_url=" + url;
    }
}

/* ===============================
   RENDER
================================ */

function render(){
    categoriesContainer.innerHTML = "";

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
            render();
        };

        const grid = document.createElement("div");
        grid.className = "category-grid";
        grid.dataset.category = category;
        if(collapsed[category]) grid.classList.add("collapsed");

        grid.addEventListener("dragover", e => {
            e.preventDefault();
            const dragging = document.querySelector(".dragging");
            const afterElement = getDragAfterElement(grid, e.clientY);
            if(!dragging) return;

            if(afterElement == null){
                grid.appendChild(dragging);
            } else {
                grid.insertBefore(dragging, afterElement);
            }
        });

        services
            .filter(s => (s.category || "General") === category)
            .sort((a,b)=>a.order-b.order)
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

                card.oncontextmenu = (e) => {
                    e.preventDefault();
                    openEdit(service);
                };

                card.addEventListener("dragstart", () => {
                    card.classList.add("dragging");
                });

                card.addEventListener("dragend", () => {
                    card.classList.remove("dragging");
                    updateOrder();
                });

                grid.appendChild(card);
            });

        wrapper.appendChild(header);
        wrapper.appendChild(grid);
        categoriesContainer.appendChild(wrapper);
    });
}

/* ===============================
   DRAG ORDER
================================ */

function getDragAfterElement(container, y){
    const elements = [...container.querySelectorAll(".card:not(.dragging)")];
    return elements.reduce((closest, child)=>{
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height/2;
        if(offset < 0 && offset > closest.offset){
            return {offset: offset, element: child};
        } else {
            return closest;
        }
    }, {offset: Number.NEGATIVE_INFINITY}).element;
}

function updateOrder(){
    document.querySelectorAll(".category-grid").forEach(grid=>{
        const category = grid.dataset.category;

        [...grid.children].forEach((card,index)=>{
            const id = Number(card.dataset.id);
            const service = services.find(s=>s.id===id);
            service.order = index;
            service.category = category;
        });
    });

    saveState();
    render();
}

/* ===============================
   MODAL
================================ */

addServiceBtn.onclick = () => {
    editId = null;
    nameInput.value = "";
    urlInput.value = "";
    descInput.value = "";
    categoryInput.value = "";
    iconInput.value = "";
    deleteBtn.classList.add("hidden");
    modal.classList.remove("hidden");
};

cancelBtn.onclick = () => modal.classList.add("hidden");

saveBtn.onclick = () => {

    const normalized = normalizeUrl(urlInput.value);

    const newService = {
        id: editId || Date.now(),
        name: nameInput.value,
        url: normalized,
        desc: descInput.value,
        category: categoryInput.value || "General",
        icon: iconInput.value,
        order: 999
    };

    if(editId){
        services = services.map(s => s.id===editId ? newService : s);
    } else {
        services.push(newService);
    }

    saveState();
    modal.classList.add("hidden");
    render();
};

deleteBtn.onclick = () => {
    services = services.filter(s=>s.id!==editId);
    saveState();
    modal.classList.add("hidden");
    render();
};

function openEdit(service){
    editId = service.id;
    nameInput.value = service.name;
    urlInput.value = service.url;
    descInput.value = service.desc;
    categoryInput.value = service.category;
    iconInput.value = service.icon || "";
    deleteBtn.classList.remove("hidden");
    modal.classList.remove("hidden");
}

/* ===============================
   SEARCH (FIXED)
================================ */

searchInput.addEventListener("input", e=>{
    const q = e.target.value.toLowerCase();

    document.querySelectorAll(".card").forEach(card=>{
        const text = card.innerText.toLowerCase();
        card.style.display = text.includes(q) ? "block" : "none";
    });
});

searchInput.addEventListener("keydown", e=>{
    if(e.key==="Enter"){
        const q = e.target.value.trim();
        if(!q) return;

        const match = services.find(s =>
            s.name.toLowerCase().includes(q.toLowerCase())
        );

        if(match){
            window.open(normalizeUrl(match.url), "_blank");
        } else {
            window.open("https://duckduckgo.com/?q="+encodeURIComponent(q));
        }
    }
});

/* INITIAL */
render();
