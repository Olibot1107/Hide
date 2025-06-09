self.addEventListener('install', event => {
  console.log('Service worker installed');
  alert("Installed")
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  console.log('Service worker activated');
  alert("Service worker activated")
});

self.addEventListener('fetch', event => {
  event.respondWith(fetch(event.request));
});
