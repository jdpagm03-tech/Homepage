import { services, saveState } from "./state.js";

export function enableDragAndDrop(render) {

    function getDragAfterElement(container, y){
        const elements = [...container.querySelectorAll(".card:not(.dragging)")];

        return elements.reduce((closest, child)=>{
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height/2;

            if(offset < 0 && offset > closest.offset){
                return { offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    document.addEventListener("dragstart", e => {
        if(e.target.classList.contains("card")){
            e.target.classList.add("dragging");
        }
    });

    document.addEventListener("dragend", e => {
        if(e.target.classList.contains("card")){
            e.target.classList.remove("dragging");
            updateOrder();
        }
    });

    document.addEventListener("dragover", e => {
        const grid = e.target.closest(".category-grid");
        if(!grid) return;

        e.preventDefault();

        const dragging = document.querySelector(".dragging");
        if(!dragging) return;

        const afterElement = getDragAfterElement(grid, e.clientY);

        if(afterElement == null){
            grid.appendChild(dragging);
        } else {
            grid.insertBefore(dragging, afterElement);
        }
    });

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
}
