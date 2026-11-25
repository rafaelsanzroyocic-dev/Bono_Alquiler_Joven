// Service worker: guarda la app en el móvil para que funcione sin conexión.
// Estrategia "primero la red": si hay internet, siempre carga la última versión
// (así, al cambiar una regla, el cambio llega solo); si no hay, usa la copia guardada.
const CACHE = "bono-alquiler-v1";
const ARCHIVOS = ["./", "index.html", "reglas.js", "motor.js", "manifest.json", "icon-192.png", "icon-512.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  e.respondWith(
    fetch(e.request)
      .then(resp => {
        const copia = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, copia));
        return resp;
      })
      .catch(() => caches.match(e.request))
  );
});
