let posts_data;
export async function getPostsData(source) {
	if (posts_data) return posts_data;

	await fetch(source)
		.then(response => response.json())
		.then(response => { posts_data = response })
		.catch(err => console.error('Error fetching posts:', err));

	return posts_data;
}

export function generateButtonFromPost(post, parent, base_URL) {
	const title = post.title || 'Untitled';
	let background_text;
	if (post.date) {
		const date = new Date(post.date);
		background_text = date.getMonth() + 1 + '/' + date.getDate();
	}
	const url = base_URL + post.url
	addFunButton(parent, title, url, background_text)
}

export function addFunButton(parent, title, url, background_text, id) {
	const post_element = document.createElement('a');
	if (url) post_element.href = url;
	if (id) post_element.id = id;
	post_element.classList.add('post');

	const container = document.createElement('div');
	post_element.appendChild(container);

	if (title) {
		const title_element = document.createElement('h1');
		title_element.textContent = title;
		container.appendChild(title_element);
	}

	if (background_text) {
		const bg_text = document.createElement('div');
		bg_text.classList.add('background-text');
		bg_text.textContent = background_text;
		container.appendChild(bg_text);
	}

	parent.appendChild(post_element);
}