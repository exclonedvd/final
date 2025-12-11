const CACHE_NAME = "app-casa-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./app.js",
  "./manifest.webmanifest",
  "./logo.png",

  "./pulizie/",
  "./pulizie/index.html",
  "./pulizie/pulizie.png",

  "./turni/",
  "./turni/index.html",
  "./turni/turni.png",

  "./spesa/",
  "./spesa/index.html",
  "./spesa/spesa.png",

  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Strategia semplice: cache-first, poi rete
self.addEventListener("fetch", (event) => {
  const req = event.request;

  if (req.method !== "GET") return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;

      return fetch(req)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(req, copy));
          return res;
        })
        .catch(() => caches.match("./index.html"));
    })
  );
});
