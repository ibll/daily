document.addEventListener('DOMContentLoaded', () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1; // getMonth() returns 0-11
	const day = today.getDate();

	loadDay(year, month, day);
	createScrollIndicator();
	handleScroll();
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

function createScrollIndicator() {
	if (document.getElementById('below-fold') === null) return;

	let indicator = document.createElement('button');
	indicator.id = 'scroll-indicator';
	indicator.innerHTML = '<span>Blog</span>';
	document.body.appendChild(indicator);

	indicator.onclick = () => {
		document.getElementById('below-fold').scrollIntoView({ behavior: 'smooth'});
	}
}

function handleScroll() {
	const indicator = document.getElementById('scroll-indicator');
	window.addEventListener('scroll', () => {
		if (window.scrollY > 0) {
			indicator.style.opacity = '0';
			indicator.style.pointerEvents = 'none';
		} else {
			indicator.style.opacity = '1';
			indicator.style.pointerEvents = 'auto';
		}
	});
}