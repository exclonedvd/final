// service-worker.js
// "No-cache" Service Worker:
// - elimina tutte le cache
// - si auto-disinstalla
// Serve solo a ripulire eventuali vecchi SW/cache installati in passato.

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys();
      await Promise.all(keys.map((k) => caches.delete(k)));
    } catch (e) {
      // ignore
    }

    try {
      await self.registration.unregister();
    } catch (e) {
      // ignore
    }

    try {
      const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      clientsList.forEach((client) => client.navigate(client.url));
    } catch (e) {
      // ignore
    }
  })());
});

// Nessun fetch handler: non intercettare richieste = niente cache lato SW.
