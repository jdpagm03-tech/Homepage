import { bookmarks, setBookmarks } from "./state.js";

function normalizeUrl(url){
    if(url.startsWith("http://") || url.startsWith("https://")){
        return url;
    }
    return "https://" + url;
}

function getFavicon(url){
    try{
        const u = new URL(normalizeUrl(url));
        return `${u.origin}/favicon.ico`;
    } catch {
        return "https://via.placeholder.com/16";
    }
}

export function initBookmarks(){

    const container = document.getElementById("bookmarksContainer");
    const addBtn = document.getElementById("addBookmarkBtn");

    function render(){
        container.innerHTML = "";

        bookmarks.forEach(b => {
            const el = document.createElement("div");
            el.className = "bookmark";

            el.innerHTML = `
                <img src="${b.icon || getFavicon(b.url)}">
                <span>${b.name}</span>
            `;

            el.onclick = () => window.open(normalizeUrl(b.url), "_blank");

            el.oncontextmenu = (e) => {
                e.preventDefault();
                const updated = bookmarks.filter(x => x.id !== b.id);
                setBookmarks(updated);
                render();
            };

            container.appendChild(el);
        });
    }

    addBtn.addEventListener("click", () => {
        const name = prompt("Bookmark name:");
        const url = prompt("Bookmark URL:");
        if(!name || !url) return;

        bookmarks.push({
            id: Date.now(),
            name,
            url
        });

        setBookmarks(bookmarks);
        render();
    });

    render();
}import { bookmarks, setBookmarks } from "./state.js";

function normalizeUrl(url){
    if(url.startsWith("http://") || url.startsWith("https://")){
        return url;
    }
    return "https://" + url;
}

function getFavicon(url){
    try{
        const u = new URL(normalizeUrl(url));
        return `${u.origin}/favicon.ico`;
    } catch {
        return "https://via.placeholder.com/16";
    }
}

export function initBookmarks(){

    const container = document.getElementById("bookmarksContainer");
    const addBtn = document.getElementById("addBookmarkBtn");

    function render(){
        container.innerHTML = "";

        bookmarks.forEach(b => {
            const el = document.createElement("div");
            el.className = "bookmark";

            el.innerHTML = `
                <img src="${b.icon || getFavicon(b.url)}">
                <span>${b.name}</span>
            `;

            el.onclick = () => window.open(normalizeUrl(b.url), "_blank");

            el.oncontextmenu = (e) => {
                e.preventDefault();
                const updated = bookmarks.filter(x => x.id !== b.id);
                setBookmarks(updated);
                render();
            };

            container.appendChild(el);
        });
    }

    addBtn.addEventListener("click", () => {
        const name = prompt("Bookmark name:");
        const url = prompt("Bookmark URL:");
        if(!name || !url) return;

        bookmarks.push({
            id: Date.now(),
            name,
            url
        });

        setBookmarks(bookmarks);
        render();
    });

    render();
}
