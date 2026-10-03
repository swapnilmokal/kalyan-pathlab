const CACHE = "kalyan-pathlab-v12";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./i18n.js",
  "./tests-data.js",
  "./manifest.json",
  "./icons/logo.png",
  "./icons/qr.png",
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE).then((cache) => Promise.all(ASSETS.map((u) => cache.add(u).catch(() => {}))))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

/* Network-first: नेहमी आधी ताजी फाईल आणतो (म्हणजे जुनं index.html + नवं app.js असं
   मिक्स होऊन अ‍ॅप तुटत नाही). इंटरनेट नसेल तरच सेव्ह केलेली कॉपी दाखवतो. */
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return; // Apps Script, Google Fonts वगैरे थेट नेटवर्कवरून
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() => caches.match(req).then((hit) => hit || caches.match("./index.html")))
  );
});
