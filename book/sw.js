/* Kalyan Pathlab — Service Worker (v16)
   - Network-first: नेहमी आधी ताजी फाईल (HTTP cache बायपास करून); इंटरनेट नसेल तरच सेव्ह केलेली कॉपी
   - फक्त 200 OK उत्तरं cache मध्ये ठेवतो (404/एरर कधीच cache होत नाही)
   - activate वर जुने सर्व cache डिलीट + clients.claim() */
const CACHE = "kalyan-pathlab-v16";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./i18n.js",
  "./tests-data.js",
  "./logo-fallback.js",
  "./manifest.json",
  "./icons/logo.png",
  "./icons/qr.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-512-maskable.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.all(
        ASSETS.map((u) =>
          fetch(u, { cache: "reload" })
            .then((res) => (res && res.status === 200 ? cache.put(u, res) : null))
            .catch(() => {})
        )
      )
    )
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Apps Script, Google Fonts थेट नेटवर्कवरून
  e.respondWith(
    fetch(req, { cache: "no-cache" })
      .then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req, { ignoreSearch: true }).then((hit) => hit || (req.mode === "navigate" ? caches.match("./index.html") : Response.error()))
      )
  );
});
