// Titik masuk ULFALINE: router berbasis hash, navigasi, dan service worker.

import { h, kosongkan, jalankanPembersih } from './ui.js';
import * as simpan from './simpan.js';
import { halamanPeta, halamanTopik, halamanPrasyarat } from './halaman/belajar.js';
import { halamanPilihLatihan, halamanSesi } from './halaman/latihan.js';
import { halamanDaftarLiterasi, halamanMisi } from './halaman/literasi.js';
import { halamanBeranda, halamanProgres } from './halaman/beranda.js';
import { halamanMasuk, halamanMulai, halamanAkun } from './halaman/akun.js';
import { halamanPeta as halamanPetaPetualangan, halamanPos, halamanHarta } from './halaman/petualangan.js';
import { halamanUlfa } from './halaman/ulfa.js';
import { tokoh } from './komponen/tokoh.js';

const RUTE = [
  [/^\/$/, () => halamanBeranda(), 'beranda', 'Beranda'],
  [/^\/belajar$/, () => halamanPeta(), 'belajar', 'Peta Materi'],
  [/^\/belajar\/([a-z]+)(?:\/(\d+))?$/, (m) => halamanTopik(m[1], m[2] === undefined ? null : Number(m[2])), 'belajar', 'Materi'],
  [/^\/prasyarat$/, () => halamanPrasyarat(), 'belajar', 'Kuis Pemanasan'],
  [/^\/latihan$/, () => halamanPilihLatihan(), 'latihan', 'Latihan'],
  [/^\/latihan\/([a-z]+)\/([a-z]+)$/, (m) => halamanSesi(m[1], m[2]), 'latihan', 'Sesi Latihan'],
  [/^\/petualangan$/, () => halamanPetaPetualangan(), 'petualangan', 'Ekspedisi Pulau Aljabar'],
  [/^\/petualangan\/harta$/, () => halamanHarta(), 'petualangan', 'Pulau Harta'],
  [/^\/petualangan\/([a-z]+)$/, (m) => halamanPos(m[1]), 'petualangan', 'Pos Petualangan'],
  [/^\/literasi$/, () => halamanDaftarLiterasi(), 'petualangan', 'Misi Literasi'],
  [/^\/literasi\/([a-z-]+)$/, (m) => halamanMisi(m[1]), 'petualangan', 'Misi Literasi'],
  [/^\/ulfa$/, () => halamanUlfa(), 'ulfa', 'Ruang Ulfa'],
  [/^\/progres$/, () => halamanProgres(), 'beranda', 'Progres'],
  [/^\/akun$/, () => halamanAkun(), null, 'Akun'],
  [/^\/masuk$/, () => halamanMasuk(), null, 'Selamat datang'],
  [/^\/mulai$/, () => halamanMulai(), null, 'Mulai'],
];

const app = document.getElementById('app');

function jalur() {
  const mentah = location.hash.replace(/^#/, '') || '/';
  return mentah.split('?')[0] || '/';
}

function render() {
  jalankanPembersih();
  let p = jalur();
  if (!simpan.ambil().profil && p !== '/masuk') {
    location.replace('#/masuk');
    return;
  }
  let cocok = null;
  for (const [pola, buat, menu, judul] of RUTE) {
    const m = pola.exec(p);
    if (m) { cocok = { isi: buat(m), menu, judul }; break; }
  }
  if (!cocok) {
    cocok = { isi: [h('h1', {}, 'Halaman tidak ditemukan'), h('a', { href: '#/' }, 'Kembali ke Beranda')], menu: null, judul: 'Tidak ditemukan' };
  }
  kosongkan(app, cocok.isi);
  document.title = `${cocok.judul} · ULFALINE`;
  document.querySelectorAll('.nav a').forEach((a) => {
    if (a.dataset.menu === cocok.menu) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
  document.querySelector('.nav').hidden = p === '/masuk';
  const judul = app.querySelector('h1');
  if (judul) { judul.setAttribute('tabindex', '-1'); judul.focus({ preventScroll: true }); }
  window.scrollTo({ top: 0 });
}

window.addEventListener('error', (e) => tampilGalat(e.error || e.message));
window.addEventListener('unhandledrejection', (e) => tampilGalat(e.reason));

function tampilGalat(galat) {
  console.error(galat);
  if (document.querySelector('.galat-aplikasi')) return;
  app.prepend(h('div', { class: 'galat-aplikasi', role: 'alert', 'data-galat': String(galat?.message || galat) },
    'Maaf, terjadi kesalahan. ', h('a', { href: '#/' }, 'Kembali ke Beranda'), ' atau muat ulang halaman.'));
}

simpan.terapkanPengaturan();
document.querySelector('.nav .avatar')?.append(tokoh('ulfa', 'senyum', 58, { lompat: false }));
window.addEventListener('hashchange', render);
render();

if ('serviceWorker' in navigator && location.protocol !== 'file:') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch((e) => console.warn('Service worker gagal:', e));
  });
}
