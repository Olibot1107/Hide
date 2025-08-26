// JavaScript code extracted from Install.html

function Help() {
  const popup = document.getElementById("popup");
  popup.classList.add("show");
  setTimeout(() => popup.classList.remove("show"), 6000);
}

// Auto show popup after 3s
window.addEventListener('load', () => {
  setTimeout(Help, 3000);
});

// Register Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('https://olibot1107.github.io/Hide/service-worker.js')
    .then(reg => console.log('Service Worker registered:', reg))
    .catch(err => console.error('Service Worker registration failed:', err));
}