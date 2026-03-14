/* =========================
   CONFIG
========================= */

const DEFAULT_LOCATION = "Paderborn,de";
const WEATHER_API_KEY = "YOUR_OPENWEATHER_API_KEY";

/* =========================
   STATE
========================= */

let services = JSON.parse(localStorage.getItem("services")) || [];
let collapsedCategories = JSON.parse(localStorage.getItem("collapsedCategories")) || {};
let editId = null;

/* =========================
   CLOCK
========================= */

function updateClock() {
    const now = new Date();
    clock.textContent = now.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    date.textContent = now.toLocaleDateString(undefined, {
        weekday:'long', year:'numeric', month:'long', day:'numeric'
    });
}
setInterval(updateClock,1000);
updateClock();

/* =========================
   WEATHER
========================= */

async function loadWeather(location = DEFAULT_LOCATION){
    if(WEATHER_API_KEY === "YOUR_OPENWEATHER_API_KEY"){
        weather-location.textContent = location;
        weather-desc.textContent = "Add API key";
        return;
    }
}
loadWeather();

/* =========================
   UTILITIES
========================= */

function saveServices(){
    localStorage.setItem("services", JSON.stringify(services));
}

function saveCollapsed(){
    localStorage.setItem("collapsedCategories", JSON.stringify(collapsedCategories));
}

function getFavicon(url){
    try{
        const u = new URL(url);
        return `${u.origin}/favicon.ico`;
    }catch{
        return "https://www.google.com/s2/favicons?sz=64&domain_url=" + url;
    }
}

/* =========================
   RENDER
========================= */

function render(){
    const container = document.getElementById("categoriesContainer");
    container.innerHTML = "";

    const categories = [...new Set(services.map(s=>s.category || "General"))];

    categories.forEach(category=>{
        const catDiv = document.createElement("div");
        catDiv.className = "category";

        const header = document.createElement("div");
        header.className = "category-header";
        header.innerHTML = `${category} <span>${collapsedCategories[category] ? "+" : "−"}</span>`;

        header.onclick = ()=>{
            collapsedCategories[category] = !collapsedCategories[category];
            saveCollapsed();
            render();
        };

        const grid = document.createElement("div");
        grid.className = "category-grid";
        if(collapsedCategories[category]) grid.classList.add("collapsed");

        services
            .filter(s=> (s.category || "General") === category)
            .sort((a,b)=>a.order-b.order)
            .forEach(service=>{
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

                card.onclick = ()=> window.open(service.url,"_blank");

                /* Drag Events */
                card.addEventListener("dragstart", ()=>{
                    card.classList.add("dragging");
                });

                card.addEventListener("dragend", ()=>{
                    card.classList.remove("dragging");
                    updateOrder();
                });

                grid.addEventListener("dragover", e=>{
                    e.preventDefault();
                    const afterElement = getDragAfterElement(grid, e.clientY);
                    const dragging = document.querySelector(".dragging");
                    if(afterElement == null){
                        grid.appendChild(dragging);
                    } else {
                        grid.insertBefore(dragging, afterElement);
                    }
                });

                grid.appendChild(card);
            });

        catDiv.appendChild(header);
        catDiv.appendChild(grid);
        container.appendChild(catDiv);
    });
}

/* Determine drop position */
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

/* Update persistent order */
function updateOrder(){
    document.querySelectorAll(".category-grid").forEach(grid=>{
        const category = grid.previousSibling.textContent.trim().slice(0,-1);
        [...grid.children].forEach((card,index)=>{
            const id = Number(card.dataset.id);
            const service = services.find(s=>s.id===id);
            service.order = index;
            service.category = category;
        });
    });
    saveServices();
    render();
}

/* =========================
   ADD / EDIT
========================= */

addServiceBtn.onclick = ()=>{
    editId=null;
    serviceModal.classList.remove("hidden");
};

cancelService.onclick = ()=> serviceModal.classList.add("hidden");

saveService.onclick = ()=>{
    const newService = {
        id: editId || Date.now(),
        name: serviceName.value,
        url: serviceUrl.value,
        desc: serviceDesc.value,
        category: serviceCategory.value || "General",
        icon: serviceIcon.value,
        order: 999
    };

    if(editId){
        services = services.map(s=> s.id===editId ? newService : s);
    } else {
        services.push(newService);
    }

    saveServices();
    serviceModal.classList.add("hidden");
    render();
};

/* =========================
   SEARCH
========================= */

search.addEventListener("keydown", e=>{
    if(e.key==="Enter"){
        const q = e.target.value.toLowerCase();
        const match = services.find(s=>s.name.toLowerCase().includes(q));
        if(match){
            window.open(match.url,"_blank");
        } else {
            window.open("https://duckduckgo.com/?q="+q);
        }
    }
});

/* Initial render */
render();
