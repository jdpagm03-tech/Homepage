export let services = JSON.parse(localStorage.getItem("services")) || [];
export let bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
export let notes = localStorage.getItem("notes") || "";
export let collapsed = JSON.parse(localStorage.getItem("collapsedCategories")) || {};

export function saveState() {
    localStorage.setItem("services", JSON.stringify(services));
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    localStorage.setItem("notes", notes);
    localStorage.setItem("collapsedCategories", JSON.stringify(collapsed));
}

export function setServices(newServices) {
    services = newServices;
    saveState();
}

export function setBookmarks(newBookmarks) {
    bookmarks = newBookmarks;
    saveState();
}

export function setNotes(newNotes) {
    notes = newNotes;
    saveState();
}
