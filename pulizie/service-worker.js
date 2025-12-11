// service-worker.js - PWA con aggiornamento automatico (network first)

const CACHE_NAME = "turni-pulizie-cache-v5";
const URLS_TO_CACHE = [
  "index.html",
  "dafare.html",
  "completati.html",
  "scadenze.html",
  "impostazioni.html",
  "statistiche.html",
  "style.css",
  "script.js",
  "firebase-config.js",
  "manifest.json",
  "logo.png",
  "logo-64x64.png",
  "logo-192x192.png",
  "logo-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(URLS_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      )
    )
  );
  return self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;

  event.respondWith(
    fetch(event.request)
      .then((response) => {
        const clone = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, clone);
        });
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
