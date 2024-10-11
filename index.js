import fs from 'fs';
import path from 'path';
import posts from './posts.js';

const __dirname = import.meta.dirname;

// Create the generated_html directory
const generatedHtmlDir = path.join(__dirname, 'generated_html');
if (fs.existsSync(generatedHtmlDir))
	fs.rmSync(generatedHtmlDir, { recursive: true });
fs.mkdirSync(generatedHtmlDir);

// Copy files and directories of /page into generated_html
const pageDir = path.join(__dirname, 'page');
copyRecursiveSync(pageDir, generatedHtmlDir);

// Dynamically create html files for posts, and rss and data feeds with them
await posts.generatePostsAndFeeds(generatedHtmlDir);

function copyRecursiveSync(src, dest) {
	const exists = fs.existsSync(src);
	const stats = exists && fs.statSync(src);
	const isDirectory = exists && stats.isDirectory();
	if (isDirectory) {
		if (!fs.existsSync(dest)) {
			fs.mkdirSync(dest);
		}
		fs.readdirSync(src).forEach((childItemName) => {
			copyRecursiveSync(path.join(src, childItemName), path.join(dest, childItemName));
		});
	} else {
		fs.copyFileSync(src, dest);
	}
}