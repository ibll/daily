import fs from 'fs';
import path from 'path';
import posts from './posts.js';
import { exec } from 'child_process';

const __dirname = import.meta.dirname;

// Create the generated_html directory
const generatedHtmlDir = path.join(__dirname, 'generated_html');
if (fs.existsSync(generatedHtmlDir)) {
	fs.rmSync(generatedHtmlDir, { recursive: true });
}
fs.mkdirSync(generatedHtmlDir);

// Copy files and directories of /page into generated_html
const pageDir = path.join(__dirname, 'page');
copyRecursiveSync(pageDir, generatedHtmlDir);

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

// Convert Markdown files in /posts to HTML
const postsDir = path.join(__dirname, 'posts');
fs.readdir(postsDir, (err, files) => {
	if (err) throw err;

	fs.mkdirSync(path.join(generatedHtmlDir, 'posts'));

	files.forEach(file => {
		const srcPath = path.join(postsDir, file);
		const destPath = path.join(generatedHtmlDir, 'posts', file.replace('.md', ''));
		const destPathFile = path.join(destPath, './index.html');

		fs.mkdirSync(destPath, { recursive: true });

		exec(`npx pandoc ${srcPath} -o ${destPathFile}`, (err, stdout, stderr) => {
			if (err) throw err;
			if (stderr) console.error(stderr);
		});
	});
});

posts.generateRSS();