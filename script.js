document.addEventListener('DOMContentLoaded', () => {
        const today = new Date();
        const month = today.getMonth() + 1; // getMonth() returns 0-11
        const day = today.getDate();

        loadDay(month, day);
});

function loadDay(m, d) {
    fetch('days.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('bg-date').textContent = `${m}/${d}`;

            if (data[m] && data[m][d]) {
                const eventData = data[m][d];
                document.getElementById('title').textContent = eventData.title;
                document.getElementById('description').textContent = eventData.description;
            }
        })
        .catch(error => console.error('Error fetching the JSON data:', error));
}