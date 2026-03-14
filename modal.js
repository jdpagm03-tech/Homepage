import { services, setServices, saveState } from "./state.js";
import { renderServices } from "./services.js";

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

export function initModal() {

    const modal = document.getElementById("serviceModal");
    const addBtn = document.getElementById("addServiceBtn");
    const saveBtn = document.getElementById("saveService");
    const cancelBtn = document.getElementById("cancelService");
    const deleteBtn = document.getElementById("deleteService");

    const nameInput = document.getElementById("serviceName");
    const urlInput = document.getElementById("serviceUrl");
    const descInput = document.getElementById("serviceDesc");
    const categoryInput = document.getElementById("serviceCategory");
    const iconInput = document.getElementById("serviceIcon");

    let editId = null;

    /* ADD */
    addBtn.addEventListener("click", () => {

        editId = null;

        nameInput.value = "";
        urlInput.value = "";
        descInput.value = "";
        categoryInput.value = "";
        iconInput.value = "";

        deleteBtn.classList.add("hidden");
        modal.classList.remove("hidden");
    });

    /* CANCEL */
    cancelBtn.addEventListener("click", () => {
        modal.classList.add("hidden");
    });

    /* SAVE */
    saveBtn.addEventListener("click", () => {

        const newService = {
            id: editId || Date.now(),
            name: nameInput.value,
            url: normalizeUrl(urlInput.value),
            desc: descInput.value,
            category: categoryInput.value || "General",
            icon: iconInput.value,
            order: 999
        };

        if (editId) {
            const updated = services.map(s =>
                s.id === editId ? newService : s
            );
            setServices(updated);
        } else {
            services.push(newService);
            saveState();
        }

        modal.classList.add("hidden");
        renderServices();
    });

    /* DELETE */
    deleteBtn.addEventListener("click", () => {
        const filtered = services.filter(s => s.id !== editId);
        setServices(filtered);
        modal.classList.add("hidden");
        renderServices();
    });

    /* EDIT VIA RIGHT CLICK */
    document.addEventListener("contextmenu", e => {

        const card = e.target.closest(".card");
        if (!card) return;

        e.preventDefault();

        const id = Number(card.dataset.id);
        const service = services.find(s => s.id === id);
        if (!service) return;

        editId = id;

        nameInput.value = service.name;
        urlInput.value = service.url;
        descInput.value = service.desc;
        categoryInput.value = service.category;
        iconInput.value = service.icon || "";

        deleteBtn.classList.remove("hidden");
        modal.classList.remove("hidden");
    });
}
