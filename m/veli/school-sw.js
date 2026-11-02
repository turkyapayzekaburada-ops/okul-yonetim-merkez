'use strict';
// Yalnız ayrı /veli/ dağıtım dizininde kullanılır; eski mobil SW kapsamıyla birleştirilmez.
// Öğrenci, oturum, davet, API yanıtı veya yapılandırma ASLA CacheStorage'a yazılmaz.
const CACHE='oyv-shell-a676d02fa2a29f3c061f';
const ASSETS=['./offline.html','./app.css','./veli.js','./school-pwa.js','./school.webmanifest','./icons/icon-192.png','./icons/icon-512.png','./icons/favicon-32.png','./icons/apple-touch-icon.png'];
const allowed=new Set(ASSETS.map(p=>new URL(p,self.location.href).href));
self.addEventListener('install',event=>event.waitUntil((async()=>{const c=await caches.open(CACHE);await c.addAll(ASSETS);await self.skipWaiting();})()));
self.addEventListener('activate',event=>event.waitUntil((async()=>{for(const key of await caches.keys())if(key.startsWith('oyv-shell-')&&key!==CACHE)await caches.delete(key);await self.clients.claim();})()));
self.addEventListener('fetch',event=>{const r=event.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==self.location.origin)return;
 if(r.mode==='navigate'){event.respondWith(fetch(r,{cache:'no-store'}).catch(async()=> (await caches.match(new URL('./offline.html',self.location.href).href))||new Response('Bağlantı yok. Öğrenci bilgileri çevrimdışı gösterilmez.',{status:503,headers:{'Content-Type':'text/plain; charset=utf-8'}})));return;}
 // Tam URL eşleşmesi: query içeren davet/ayar adresleri ve bilinmeyen dosyalar kapsam dışıdır.
 if(!allowed.has(u.href))return;
 event.respondWith((async()=>{const c=await caches.open(CACHE),saved=await c.match(r);if(saved)return saved;const fresh=await fetch(r);if(fresh.ok&&fresh.type==='basic')await c.put(r,fresh.clone());return fresh;})());
});
