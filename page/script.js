import {generateButtonFromPost, getPostsData, addFunButton } from './posts.js';

const POSTS_SHOWN = 3;

document.addEventListener('DOMContentLoaded', async () => {
	const today = new Date();
	const year = today.getFullYear();
	const month = today.getMonth() + 1; // getMonth() returns 0-11
	const day = today.getDate();

	loadDay(year, month, day);
	await generateBelowFoldContent();
	scrollListener();
});

function loadDay(y, m, d) {
	fetch('days.json')
		.then(response => response.json())
		.then(data => {
			document.getElementById('bg-date').textContent = `${m}/${d}`;

			if (data[y]?.[m]?.[d] !== undefined) {
				const eventData = data[y][m][d];
				setDayContent(eventData.title, eventData.description)
			} else {
				setDayContent('Erm...', 'I forgot to plan something for today. Sorry 😥');
			}
		})
		.catch(error => {
			console.error('Error fetching the JSON data:', error)
			setDayContent('Error', 'Whoops... something went wrong!');
		});
}
window.loadDay = loadDay;

function setDayContent(title, description) {
	const day_info = document.getElementById('day-info');
	day_info.innerHTML = '';

	if (title) {
		const title_element = document.createElement('h1');
		title_element.id = 'title';
		title_element.innerHTML = title.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
		day_info.appendChild(title_element)
	}

	if (description) {
		const description_element = document.createElement('p');
		description_element.id = 'description';
		description_element.innerHTML = description.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>');
		day_info.appendChild(description_element);

		const links = document.querySelectorAll('#description a');
		links.forEach(link => {
			link.setAttribute('target', '_blank');
		});
	}
}

async function generateBelowFoldContent() {
	const posts_data = await getPostsData('./posts.json');

	if (posts_data.length === 0) return;

	createScrollIndicator();

	const below_fold = document.createElement('section');
	below_fold.id = 'below-fold';
	below_fold.classList.add('below-fold');
	document.body.appendChild(below_fold);

	const header = document.createElement('h1');
	header.classList.add('squiggly-header', 'left', 'link')
	below_fold.appendChild(header);

	const heading_link = document.createElement('a');
	heading_link.href = './posts';
	heading_link.textContent = 'Posts';
	header.appendChild(heading_link);

	const posts_container = document.createElement('div');
	posts_container.id = 'posts-container';
	below_fold.appendChild(posts_container)

	console.log(posts_data);
	posts_data.slice(0, POSTS_SHOWN).forEach(post => generateButtonFromPost(post, posts_container, './'));

	if (posts_data.length > POSTS_SHOWN) {
		addFunButton(posts_container, 'View All', 'posts', null, 'see-all');
	}
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
			if (viewport_offset.top < viewport_height - 10) {
				document.body.classList.add('inverted');
			} else {
				document.body.classList.remove('inverted');
			}
		}
	});
}