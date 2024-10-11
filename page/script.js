document.addEventListener('DOMContentLoaded', async () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1; // getMonth() returns 0-11
	const day = today.getDate();

	loadDay(year, month, day);
	await loadPosts();
	scrollListener();
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

async function loadPosts() {
	await fetch('./posts.json')
		.then(response => response.json())
		.then(posts_data => {
			if (posts_data.length === 0) return;

			createScrollIndicator();

			const below_fold = document.createElement('section');
			below_fold.id = 'below-fold';
			below_fold.classList.add('below-fold');
			document.body.appendChild(below_fold);

			const posts_container = document.createElement('main');
			posts_container.id = 'posts-container';
			below_fold.appendChild(posts_container);

			const heading = document.createElement('h1');
			heading.textContent = 'Posts';
			posts_container.appendChild(heading);

			posts_data.slice(0, 5).forEach(post_data => {
				const post_element = document.createElement('a');
				post_element.href = post_data.url;
				post_element.classList.add('post');

				const title_element = document.createElement('h1');
				title_element.textContent = post_data.title;
				post_element.appendChild(title_element);

				const content_element = document.createElement('p');
				content_element.textContent = post_data.content;

				const date = new Date(post_data.date);
				const date_element = document.createElement('div');
				date_element.classList.add('post-date')
				date_element.textContent = `${date.getMonth() + 1}/${date.getDate() + 1}`;
				post_element.appendChild(date_element);

				posts_container.appendChild(post_element);
			});
		})
		.catch(error => {
			console.error('Error fetching the posts:', error);
		});
}

function createScrollIndicator() {
	let indicator = document.createElement('button');
	indicator.id = 'scroll-indicator';
	indicator.innerHTML = '<span>Posts</span>';
	document.body.appendChild(indicator);

	indicator.onclick = () => {
		document.getElementById('below-fold').scrollIntoView({ behavior: 'smooth'});
	}
}

function scrollListener() {
	const indicator = document.getElementById('scroll-indicator');
	const below_fold = document.getElementById('below-fold');

	window.addEventListener('scroll', () => {
		if (indicator) {
			if (window.scrollY > 0) {
				indicator.style.opacity = '0';
				indicator.style.pointerEvents = 'none';
			} else {
				indicator.style.opacity = '1';
				indicator.style.pointerEvents = 'auto';
			}
		}

		if (below_fold) {
			const viewport_offset = below_fold.getBoundingClientRect();
			const viewport_height = window.innerHeight;
			if (viewport_offset.top <= viewport_height / 3 * 2) {
				document.body.classList.add('inverted');
			} else {
				document.body.classList.remove('inverted');
			}
		}
	});
}