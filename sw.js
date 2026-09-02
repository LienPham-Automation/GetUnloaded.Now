/* Prototype service worker: caches the app shell so it opens offline after the first load.
   Bump CACHE whenever index.html changes so returning users get the new version. */
var CACHE = "unloaded-v2";
var ASSETS = ["./", "./index.html", "./manifest.webmanifest", "./icon-192.png", "./icon-512.png", "./apple-touch-icon.png"];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE)
      .then(function (c) { return c.addAll(ASSETS); })
      .then(function () { return self.skipWaiting(); })
      .catch(function () {})
  );
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.filter(function (k) { return k !== CACHE; })
                             .map(function (k) { return caches.delete(k); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // let the font CDN through untouched

  var isDoc = req.mode === "navigate" || /\.html?$/.test(url.pathname) || url.pathname === "/";
  if (isDoc) {
    /* Network-first for the page, so a hosted install picks up updates. */
    e.respondWith(
      fetch(req).then(function (resp) {
        var copy = resp.clone();
        caches.open(CACHE).then(function (c) { try { c.put(req, copy); } catch (err) {} });
        return resp;
      }).catch(function () {
        return caches.match(req).then(function (r) { return r || caches.match("./index.html"); });
      })
    );
  } else {
    /* Cache-first for static assets. */
    e.respondWith(
      caches.match(req).then(function (cached) {
        return cached || fetch(req).then(function (resp) {
          var copy = resp.clone();
          caches.open(CACHE).then(function (c) { try { c.put(req, copy); } catch (err) {} });
          return resp;
        });
      })
    );
  }
});
