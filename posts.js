import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import RSS from 'rss';
import {exec} from "child_process";

const __dirname = import.meta.dirname;

const POSTS_DIR = path.join(__dirname, 'posts');
const RSS_PATH = path.join(__dirname, 'generated_html', 'rss.xml');

const postsAPI = {};

let posts;
let feed;

postsAPI.generatePostsAndFeeds = function(generatedHtmlDir) {
	posts = [];
	feed = new RSS({
		title: 'Isbell\'s Updates',
		description: 'Feed for my occasional posts!',
		feed_url: 'https://ibll.dev/daily/rss.xml',
		site_url: 'https://ibll.dev/daily',
		language: 'en',
	});

	// Read all Markdown files in the posts directory
	if (fs.existsSync(POSTS_DIR)) {
		fs.mkdirSync(path.join(generatedHtmlDir, 'posts'));
		const files = fs.readdirSync(POSTS_DIR)
		files.forEach(file => {
			if (file.startsWith('.')) return;
			generatePostAndAddToFeeds(file, generatedHtmlDir)
		})
	}

	// Write the RSS feed to a file
	const rssXml = feed.xml({ indent: true });
	fs.writeFileSync(RSS_PATH, rssXml);

	// Write the posts to json
	posts.sort(function(a, b) {
		if (a.timestamp > b.timestamp) return -1;
		if (b.timestamp > a.timestamp) return 1;
		return 0;
	});
	fs.writeFileSync(path.join(__dirname, 'generated_html', 'posts.json'), JSON.stringify(posts));
}

function generatePostAndAddToFeeds(file, generatedHtmlDir) {
	if (path.extname(file) !== '.md') return;

	const file_path = path.join(POSTS_DIR, file);
	const dest_path = path.join(generatedHtmlDir, 'posts', file.replace('.md', ''));
	const dest_path_file = path.join(dest_path, './index.html');

	// Create HTML File
	fs.mkdirSync(dest_path, { recursive: true });
	const command = `npx pandoc --css=../../styles/style.css --css=../../styles/posts.css -V lang=en -V highlighting-css= --mathjax \ --smart --to=html5 ${file_path} -o ${dest_path_file}`;
	exec(command, (err, stdout, stderr) => {
		if (err) throw err;
		if (stderr) console.error(stderr);
	});

	// Get file info
	const content = fs.readFileSync(file_path, 'utf8');
	const { data, content: postContent } = matter(content);

	// Add each post to the dictionary
	data.url = `./posts/${file.replace('.md', '')}`;
	data.timestamp = Date.parse(data.date);
	posts.push(data);

	// Add each post to the RSS feed
	feed.item({
		title: data.title,
		description: postContent,
		url: `https://ibll.dev/daily/posts/${file.replace('.md', '')}`,
		date: data.date,
	});
}

export default postsAPI;