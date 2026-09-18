const fs = require('fs');
const path = require('path');

const localPath = path.resolve(__dirname, '../data/posts.json');
const remotePath = path.resolve(__dirname, '../scratch/remote_posts.json');

let localPosts = [];
let remotePosts = [];

if (fs.existsSync(localPath)) {
  try {
    localPosts = JSON.parse(fs.readFileSync(localPath, 'utf8'));
  } catch (e) {
    console.warn('Warning: Could not parse local posts.json:', e.message);
  }
}

if (fs.existsSync(remotePath)) {
  try {
    remotePosts = JSON.parse(fs.readFileSync(remotePath, 'utf8'));
  } catch (e) {
    console.warn('Warning: Could not parse remote posts.json:', e.message);
  }
}

const map = new Map();

function getTimestamp(post) {
  const ts = post.updatedAt || post.publishedAt;
  return ts ? new Date(ts).getTime() : 0;
}

for (const post of remotePosts) {
  if (post && (post.id || post.slug)) {
    const key = post.id || post.slug;
    map.set(key, post);
  }
}

for (const post of localPosts) {
  if (post && (post.id || post.slug)) {
    const key = post.id || post.slug;
    if (map.has(key)) {
      const existing = map.get(key);
      if (getTimestamp(post) >= getTimestamp(existing)) {
        map.set(key, { ...existing, ...post });
      }
    } else {
      map.set(key, post);
    }
  }
}

const merged = Array.from(map.values());
merged.sort((a, b) => new Date(b.publishedAt || 0).getTime() - new Date(a.publishedAt || 0).getTime());

console.log(`Merged posts: Local (${localPosts.length}) + Remote (${remotePosts.length}) => Total (${merged.length})`);

fs.writeFileSync(localPath, JSON.stringify(merged, null, 2), 'utf8');

const backupPath = path.resolve(__dirname, '../data/posts.backup.json');
fs.writeFileSync(backupPath, JSON.stringify(merged, null, 2), 'utf8');

const dateStr = new Date().toISOString().slice(0, 10);
const backupDir = path.resolve(__dirname, '../data/backups');
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir, { recursive: true });
fs.writeFileSync(path.join(backupDir, `posts-${dateStr}.json`), JSON.stringify(merged, null, 2), 'utf8');

console.log('Successfully saved non-destructive merged posts to local database & backups.');
