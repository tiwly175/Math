// sw.js — แคชไฟล์หลักของแอปไว้ใช้งานออฟไลน์หลังโหลดครั้งแรก
const CACHE_NAME = 'police-prep-cache-v3';
const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './data.js',
  './exam-data.js',
  './exam-generators.js',
  './store-data.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => { /* ไม่ต้อง fail การติดตั้งถ้าบางไฟล์แคชไม่ได้ (เช่น ยังไม่มี data.js) */ })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_NAME).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// กลยุทธ์: network-first — เช็คไฟล์ใหม่จากเน็ตก่อนเสมอถ้ามีสัญญาณ (จะได้ไม่ค้างข้อมูลเก่า
// เวลาอัปเดตไฟล์บน GitHub) แล้วเก็บสำเนาไว้แทนของเดิม; ถ้าไม่มีเน็ต (ออฟไลน์) ค่อยตกไปใช้
// สำเนาที่เก็บไว้ในเครื่องแทน — ไม่ต้องเปลี่ยนเลข CACHE_NAME ทุกครั้งที่แก้เนื้อหาอีกต่อไป
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    fetch(event.request)
      .then((res) => {
        if (res && res.status === 200 && res.type === 'basic') {
          const resClone = res.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});
