// Disabilita caching PWA: rimuove eventuali Service Worker e CacheStorage
// così l'app si aggiorna sempre senza dover cancellare cache/dati del browser.
if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      const regs = await navigator.serviceWorker.getRegistrations();
      await Promise.all(regs.map((r) => r.unregister()));
    } catch (e) {
      console.warn("SW cleanup error:", e);
    }

    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
    } catch (e) {
      console.warn("Cache cleanup error:", e);
    }
  });
}
