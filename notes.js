import { notes, setNotes } from "./state.js";

export function initNotes(){

    const area = document.getElementById("notesArea");

    area.value = notes;

    area.addEventListener("input", e => {
        setNotes(e.target.value);
    });
}
