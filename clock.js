export function initClock() {
    const clockEl = document.getElementById("clock");
    const dateEl = document.getElementById("date");

    function updateClock() {
        const now = new Date();
        clockEl.textContent = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });

        dateEl.textContent = now.toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    setInterval(updateClock, 1000);
    updateClock();
}
