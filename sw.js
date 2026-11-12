// Service worker ULFALINE: membuat aplikasi bisa dibuka offline.
// Setiap kali file aplikasi berubah, naikkan VERSI agar cache diperbarui.
// Daftar BERKAS dicek oleh backend/tests/test_frontend.py (semua file harus tercantum).

const VERSI = 'ulfaline-v1.0.1';
const BERKAS = [
  './',
  'index.html',
  'manifest.webmanifest',
  'css/app.css',
  'js/main.js',
  'js/ui.js',
  'js/simpan.js',
  'js/api.js',
  'js/pasang.js',
  'js/mesin.js',
  'js/konten/materi.js',
  'js/komponen/visual.js',
  'js/komponen/contoh.js',
  'js/komponen/pilihan.js',
  'js/komponen/pengerja.js',
  'js/halaman/belajar.js',
  'js/halaman/latihan.js',
  'js/halaman/literasi.js',
  'js/halaman/beranda.js',
  'js/halaman/akun.js',
  'data/literasi.json',
  'data/prasyarat.json',
  'data/bank-soal.json',
  'ikon/ikon.svg',
  'ikon/ikon-192.png',
  'ikon/ikon-512.png',
  'ikon/ikon-maskable-512.png',
  'ikon/apple-touch-icon.png',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(VERSI).then((c) => c.addAll(BERKAS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then((kunci) => Promise.all(kunci.filter((k) => k !== VERSI).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;
  // API selalu ke jaringan; jika gagal, aplikasi memakai bank soal di perangkat.
  if (url.pathname.includes('/api/')) return;

  // Network-first untuk file aplikasi (selalu versi terbaru saat online), cache saat offline.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) {
          const salinan = res.clone();
          caches.open(VERSI).then((c) => c.put(e.request, salinan));
        }
        return res;
      })
      .catch(() => caches.match(e.request, { ignoreSearch: true })
        .then((r) => r || (e.request.mode === 'navigate' ? caches.match('index.html') : Response.error()))),
  );
});
