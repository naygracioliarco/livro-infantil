import fs from 'fs';
import path from 'path';

const rootDir = process.cwd();
const htmlDir = path.join(rootDir, 'html');
const resourcesDir = path.join(htmlDir, 'resources');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function moveIfExists(from, to) {
  if (fs.existsSync(from)) {
    ensureDir(path.dirname(to));
    fs.renameSync(from, to);
  }
}

function replaceInFile(filePath, replacements) {
  if (!fs.existsSync(filePath)) return;
  const original = fs.readFileSync(filePath, 'utf8');
  let updated = original;
  for (const [from, to] of replacements) {
    updated = updated.split(from).join(to);
  }
  if (updated !== original) {
    fs.writeFileSync(filePath, updated, 'utf8');
  }
}

function replaceInDir(dir, extensions, replacements) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInDir(fullPath, extensions, replacements);
    } else {
      const ext = path.extname(entry.name).toLowerCase();
      if (extensions.includes(ext)) {
        replaceInFile(fullPath, replacements);
      }
    }
  }
}

ensureDir(resourcesDir);

// Move images and fonts folders under resources if they exist at html root
moveIfExists(path.join(htmlDir, 'images'), path.join(resourcesDir, 'images'));
moveIfExists(path.join(htmlDir, 'fonts'), path.join(resourcesDir, 'fonts'));

// First, update paths inside built files to point to /resources/images and /resources/fonts
const replacementsStep1 = [
  ['/images/', '/resources/images/'],
  ['/fonts/', '/resources/fonts/'],
];

replaceInFile(path.join(htmlDir, 'index.html'), replacementsStep1);
replaceInDir(resourcesDir, ['.js', '.css', '.html'], replacementsStep1);

// Then, remove leading slashes so paths are relative to html/index.html
// This avoids issues when the hosting environment does not serve "/" as this folder.
const replacementsStep2 = [
  ['"/resources/', '"resources/'],
  ["'/resources/", "'resources/"],
  ['(/resources/', '(resources/'],
  ['url(/resources/', 'url(resources/'],
  ['url("/resources/', 'url("resources/'],
  ["url('/resources/", "url('resources/"],
];

replaceInFile(path.join(htmlDir, 'index.html'), replacementsStep2);
replaceInDir(resourcesDir, ['.js', '.css', '.html'], replacementsStep2);

