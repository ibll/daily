let posts_data;
export async function getPostsData(source) {
	if (posts_data) return posts_data;

	await fetch(source)
		.then(response => response.json())
		.then(response => { posts_data = response })
		.catch(err => console.error('Error fetching posts:', err));

	return posts_data;
}

export function generateDivFromPost(post, parent, base_URL) {
	const post_element = document.createElement('a');
	post_element.href = base_URL + post.url;
	post_element.classList.add('post');

	const container = document.createElement('div');
	post_element.appendChild(container);

	const title_element = document.createElement('h1');
	title_element.textContent = post.title;
	container.appendChild(title_element);

	const date = new Date(post.date);
	console.log(post.date)
	console.log(date)
	const date_element = document.createElement('div');
	date_element.classList.add('post-date')
	date_element.textContent = `${date.getMonth() + 1}/${date.getDate()}`;
	container.appendChild(date_element);

	parent.appendChild(post_element);
}