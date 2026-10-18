/* MARDAM AeroMargin Pro — cache hors ligne. Version baa9dc4bac */
var CACHE = "aeromargin-baa9dc4bac";
var FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png", "./icon-512-maskable.png"];
self.addEventListener("install", function(e){
  e.waitUntil(caches.open(CACHE).then(function(c){ return c.addAll(FILES); }).then(function(){ return self.skipWaiting(); }));
});
self.addEventListener("activate", function(e){
  e.waitUntil(caches.keys().then(function(ks){
    return Promise.all(ks.filter(function(k){ return k !== CACHE && k.indexOf("aeromargin-") === 0; }).map(function(k){ return caches.delete(k); }));
  }).then(function(){ return self.clients.claim(); }));
});
/* hors ligne d'abord : réponse immédiate depuis le cache, mise à jour en arrière-plan */
self.addEventListener("fetch", function(e){
  if (e.request.method !== "GET") return;
  var url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  e.respondWith(caches.match(e.request, {ignoreSearch:true}).then(function(hit){
    var net = fetch(e.request).then(function(r){
      if (r && r.ok){ var cp = r.clone(); caches.open(CACHE).then(function(c){ c.put(e.request, cp); }); }
      return r;
    }).catch(function(){ return hit || caches.match("./index.html"); });
    return hit || net;
  }));
});
