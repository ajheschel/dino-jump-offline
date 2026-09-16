import { readdir, readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = process.cwd();
const dist = path.join(root, 'dist');

async function walk(dir) {
  const out = [];
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...await walk(full));
    else out.push(full);
  }
  return out;
}

const files = (await walk(dist))
  .filter((file) => path.basename(file) !== 'sw.js')
  .sort();

const hash = createHash('sha256');
const assets = ['./'];

for (const file of files) {
  const rel = path.relative(dist, file).split(path.sep).join('/');
  assets.push(`./${rel}`);
  hash.update(rel);
  hash.update(await readFile(file));
}

const version = hash.digest('hex').slice(0, 12);
const sw = `const CACHE_PREFIX = 'dino-jump:' + encodeURIComponent(self.registration.scope) + ':';
const CACHE_NAME = CACHE_PREFIX + ${JSON.stringify(version)};
const ASSETS = ${JSON.stringify([...new Set(assets)], null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
        .map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  if (!request.url.startsWith(self.registration.scope)) return;

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (request.mode === 'navigate') {
      try {
        const response = await fetch(request);
        if (response.ok) await cache.put(request, response.clone());
        return response;
      } catch (error) {
        const fallback = (await cache.match(request)) ||
          (await cache.match(new URL('./', self.registration.scope).href)) ||
          (await cache.match(new URL('index.html', self.registration.scope).href));
        if (fallback) return fallback;
        throw error;
      }
    }

    const cached = await cache.match(request);
    if (cached) return cached;
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  })());
});
`;

await writeFile(path.join(dist, 'sw.js'), sw);
console.log(`Generated offline service worker (${version}) with ${assets.length} cached URLs.`);
