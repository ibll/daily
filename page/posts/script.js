import {generateButtonFromPost, getPostsData} from '../posts.js';

document.addEventListener('DOMContentLoaded', async () => {
	const posts_container = document.getElementById('posts-container');
	const posts_data = await getPostsData('../posts.json');
	posts_data.forEach(post => generateButtonFromPost(post, posts_container, '../'));
});