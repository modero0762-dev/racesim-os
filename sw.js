const CACHE_NAME = "racesim-cache-v1";
const urlsToCache = [
  "https://modero0762-dev.github.io/racesim-os/",
  "https://modero0762-dev.github.io/racesim-os/index.html",
  "https://modero0762-dev.github.io/racesim-os/app.js",
  "https://modero0762-dev.github.io/racesim-os/style.css"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});
