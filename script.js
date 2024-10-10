document.addEventListener('DOMContentLoaded', () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1; // getMonth() returns 0-11
	const day = today.getDate();

	loadDay(year, month, day);
});

function loadDay(y, m, d) {
	fetch('days.json')
		.then(response => response.json())
		.then(data => {
			document.getElementById('bg-date').textContent = `${m}/${d}`;

			if (data[y]?.[m]?.[d] !== undefined) {
				const eventData = data[y][m][d];
				document.getElementById('title').innerHTML = eventData.title;

				const descriptionWithLinks = eventData.description.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
				document.getElementById('description').innerHTML = descriptionWithLinks;


				const links = document.querySelectorAll('#description a');
				links.forEach(link => {
					link.setAttribute('target', '_blank');
				});

			} else {
				document.getElementById('title').innerHTML = 'Erm...';
				document.getElementById('description').innerHTML = 'I forgot to plan something for today. Sorry 😥';
			}
		})
		.catch(error => {
			console.error('Error fetching the JSON data:', error)
			document.getElementById('title').innerHTML = 'Error';
			document.getElementById('description').innerHTML = 'Whoops... something went wrong!';
		});
}