const C='aura-v23';const FILES=['./','./index.html','./manifest.webmanifest','./icon-180.png','./icon-192.png','./icon-512.png'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(C).then(c=>c.addAll(FILES)));self.skipWaiting()});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x.startsWith('aura-')&&x!==C).map(x=>caches.delete(x)))).then(()=>self.clients.claim()))});
// pages: newest from GitHub when online (updates arrive by themselves), saved copy when offline
self.addEventListener('fetch',e=>{const r=e.request,u=new URL(r.url);if(r.method!=='GET'||u.origin!==location.origin)return;
 const page=r.mode==='navigate'||u.pathname.endsWith('/')||u.pathname.endsWith('.html');
 if(page){e.respondWith(caches.open(C).then(c=>fetch(r,{cache:'no-store'}).then(res=>{if(res.ok)c.put('./index.html',res.clone());return res}).catch(()=>c.match('./index.html').then(x=>x||c.match('./')))));return}
 e.respondWith(caches.open(C).then(c=>c.match(r,{ignoreSearch:true}).then(x=>{const net=fetch(r).then(res=>{if(res.ok)c.put(r,res.clone());return res}).catch(()=>x);return x||net})))});
