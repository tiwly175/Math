// sw.js — แคชไฟล์หลักของแอปไว้ใช้งานออฟไลน์หลังโหลดครั้งแรก
const CACHE_NAME = 'police-prep-cache-v2';
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

// กลยุทธ์: cache-first สำหรับไฟล์ในแอป, ตกไป network ถ้าไม่เจอในแคช (เช่น Google Fonts ครั้งแรก)
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          if (res && res.status === 200 && res.type === 'basic') {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => cached);
    })
  );
});
