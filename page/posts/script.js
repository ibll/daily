import {generateDivFromPost, getPostsData} from '../posts.js';

document.addEventListener('DOMContentLoaded', async () => {
	const posts_container = document.getElementById('posts-container');
	const posts_data = await getPostsData('../posts.json');
	posts_data.forEach(post => generateDivFromPost(post, posts_container, '../'));
});