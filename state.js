export let services = JSON.parse(localStorage.getItem("services")) || [];
export let collapsed = JSON.parse(localStorage.getItem("collapsedCategories")) || {};

export function saveState() {
    localStorage.setItem("services", JSON.stringify(services));
    localStorage.setItem("collapsedCategories", JSON.stringify(collapsed));
}

export function setServices(newServices) {
    services = newServices;
    saveState();
}
