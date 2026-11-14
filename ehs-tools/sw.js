/* EHS Field Tools service worker: works offline after the first visit. */
const CACHE='ehs-tools-v6';
const PRECACHE=["6s-audit.html", "bbs-card.html", "compressed-gas.html", "deck-builder.html", "diagram-generator.html", "emergency-equipment.html", "equipment-change.html", "ergonomics.html", "fall-protection.html", "fire-drill.html", "forklift-eval.html", "hazard-report.html", "hazwaste-inspection.html", "heat-illness.html", "index.html", "inspection-assistant.html", "kpi-builder.html", "jsa-builder.html", "loto-builder.html", "near-miss.html", "rca.html", "safety-lms.html", "sds-finder.html", "workplace-inspection.html", "certificates/", "certificates/index.html", "privacy.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png", "icons/logo.png", "./"];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>Promise.all(PRECACHE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()))});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()))});
self.addEventListener('fetch',e=>{
  const r=e.request; if(r.method!=='GET') return;
  const u=new URL(r.url); if(u.origin!==location.origin) return;
  /* pages: network first so updates show, cache when offline */
  if(r.mode==='navigate'||r.destination==='document'){
    e.respondWith(fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res}).catch(()=>caches.match(r,{ignoreSearch:true}).then(m=>m||caches.match('./'))));
    return;}
  e.respondWith(caches.match(r).then(m=>m||fetch(r).then(res=>{const c=res.clone();caches.open(CACHE).then(x=>x.put(r,c));return res})));
});
