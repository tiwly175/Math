// sw.js — แคชไฟล์หลักของแอปไว้ใช้งานออฟไลน์หลังโหลดครั้งแรก
//
// สำคัญ: ทุกครั้งที่แก้ไข/อัปเดตไฟล์ในแอป (app.js, data.js, ไอคอน ฯลฯ) ต้อง
// เปลี่ยนเลขท้าย CACHE_NAME (เช่น v1 -> v2) ทุกครั้ง ไม่งั้นผู้ใช้ที่ติดตั้งแอปไปแล้ว
// จะไม่มีวันได้รับไฟล์ใหม่เลย เพราะกลยุทธ์ cache-first จะเสิร์ฟไฟล์เก่าที่แคชไว้ซ้ำตลอดไป
// (นี่คือสาเหตุหลักที่ไอคอนใหม่ไม่อัปเดตให้ผู้ใช้เดิม)
const CACHE_VERSION = 'v2';
const CACHE_NAME = `police-prep-cache-${CACHE_VERSION}`;

const APP_SHELL = [
  './',
  './index.html',
  './app.js',
  './data.js',
  './exam-data.js',
  './exam-generators.js',
  './manifest.json',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './icon-512-maskable.png'
];

// ไฟล์แกนของแอปที่อัปเดตบ่อย: ใช้ network-first เพื่อให้ผู้ใช้ได้โค้ด/ข้อมูลล่าสุดทันทีที่ออนไลน์
const NETWORK_FIRST = new Set([
  './', './index.html', './app.js', './data.js', './exam-data.js', './exam-generators.js', './manifest.json'
]);

function isNetworkFirst(pathname) {
  const file = '.' + pathname.substring(pathname.lastIndexOf('/'));
  return NETWORK_FIRST.has(file) || pathname.endsWith('/') || pathname.endsWith('/index.html');
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL))
      .catch(() => { /* ไม่ต้อง fail การติดตั้งถ้าบางไฟล์แคชไม่ได้ */ })
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

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return; // ปล่อยของนอกโดเมน (เช่น Google Fonts) ผ่านตามปกติ

  if (isNetworkFirst(url.pathname)) {
    // network-first: พยายามโหลดของใหม่ก่อนเสมอเมื่อออนไลน์ ตกไปแคชเฉพาะตอนออฟไลน์/เน็ตล่ม
    event.respondWith(
      fetch(event.request)
        .then((res) => {
          if (res && res.status === 200) {
            const resClone = res.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, resClone));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ไฟล์สแตติก (ไอคอน ฯลฯ): cache-first เพื่อความเร็ว/ออฟไลน์
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
