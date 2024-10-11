document.addEventListener('DOMContentLoaded', () => {
	const today = new Date();
	const month = today.getMonth() + 1; // getMonth() returns 0-11
	const day = today.getDate();

	loadDay(month, day);
	createScrollIndicator();
	handleScroll();
});

function loadDay(m, d) {
	fetch('days.json')
		.then(response => response.json())
		.then(data => {
			document.getElementById('bg-date').textContent = `${m}/${d}`;

			if (data[m] && data[m][d]) {
				const eventData = data[m][d];
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
	let indicator = document.createElement('div');
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