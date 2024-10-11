import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import RSS from 'rss';

const __dirname = import.meta.dirname;

const postsDir = path.join(__dirname, 'posts');
const rssFilePath = path.join(__dirname, 'generated_html', 'rss.xml');

const postsAPI = {};

postsAPI.generateRSS = function() {
	// Create a new RSS feed
	const feed = new RSS({
		title: 'Isbell\'s Updates',
		description: 'Feed for my occasional posts!',
		feed_url: 'https://ibll.dev/daily/rss.xml',
		site_url: 'https://ibll.dev/daily',
		language: 'en',
	});

	// Read all Markdown files in the posts directory
	fs.readdir(postsDir, (err, files) => {
		if (err) throw err;

		files.forEach(file => {
			if (path.extname(file) === '.md') {
				const filePath = path.join(postsDir, file);
				const content = fs.readFileSync(filePath, 'utf8');
				const { data, content: postContent } = matter(content);

				// Add each post to the RSS feed
				feed.item({
					title: data.title,
					description: postContent,
					url: `https://ibll.dev/posts/${file.replace('.md', '')}`,
					date: data.date,
				});
			}
		});

		// Write the RSS feed to a file
		const rssXml = feed.xml({ indent: true });
		fs.writeFileSync(rssFilePath, rssXml);
	});
}

export default postsAPI;