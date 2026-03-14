import { initClock } from "./clock.js";
import { initWeather } from "./weather.js";
import { renderServices } from "./services.js";
import { enableDragAndDrop } from "./dragdrop.js";
import { initSearch } from "./search.js";
import { initModal } from "./modal.js";

initClock();
initWeather();
renderServices();
enableDragAndDrop(renderServices);
initSearch();
initModal();
