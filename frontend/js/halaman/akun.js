// Halaman Masuk (pertama kali) dan Akun & Pengaturan.

import { h, umpan } from '../ui.js';
import * as simpan from '../simpan.js';
import { blokPasang } from '../pasang.js';

function bersihkan(teks, maks) {
  return teks.replace(/[<>]/g, '').trim().slice(0, maks);
}

export function halamanMulai() {
  return [
    h('h1', {}, `Selamat datang, ${simpan.ambil().profil?.nama || ''}!`),
    h('section', { class: 'kartu' },
      h('h2', {}, '🔁 Pemanasan dulu?'),
      h('p', {}, 'Kuis singkat (8 soal, sekitar 3 menit) untuk mengecek bilangan negatif dan bentuk aljabar. Hasilnya membantu menentukan bagian yang perlu diulang.'),
      h('div', { class: 'tumpuk' },
        h('a', { class: 'tombol penuh', href: '#/prasyarat' }, 'Mulai Pemanasan'),
        h('a', { class: 'tombol netral penuh', href: '#/' }, 'Nanti saja'))),
  ];
}

function segmen(label, kunci, pilihan) {
  const nilai = simpan.ambil().pengaturan[kunci];
  const tombol = pilihan.map(([v, teks]) => h('button', {
    type: 'button', 'aria-pressed': String(v === nilai),
    onclick: () => {
      simpan.setPengaturan({ [kunci]: v });
      tombol.forEach((b, i) => b.setAttribute('aria-pressed', String(pilihan[i][0] === v)));
    },
  }, teks));
  return h('div', { class: 'saklar' }, h('span', {}, label), h('div', { class: 'segmen', role: 'group', 'aria-label': label }, tombol));
}

export function halamanAkun() {
  const d = simpan.ambil();
  const nama = h('input', { class: 'teks', id: 'ubah-nama', value: d.profil?.nama || '', maxlength: 20 });
  const kelas = h('input', { class: 'teks', id: 'ubah-kelas', value: d.profil?.kelas || '', maxlength: 12 });
  const info = h('div', { 'aria-live': 'polite' });
  return [
    h('h1', {}, '⚙️ Akun & Pengaturan'),
    h('section', { class: 'kartu' }, h('h2', {}, 'Profil'),
      h('label', { class: 'isian-teks', for: 'ubah-nama' }, 'Nama panggilan'), nama,
      h('label', { class: 'isian-teks', for: 'ubah-kelas' }, 'Kelas'), kelas,
      h('button', {
        class: 'tombol kedua penuh', type: 'button', style: 'margin-top:12px',
        onclick: () => {
          const n = bersihkan(nama.value, 20);
          if (!n) return;
          simpan.setProfil({ nama: n, kelas: bersihkan(kelas.value, 12) });
          info.replaceChildren(umpan('benar', '✓ ', 'Profil disimpan.'));
        },
      }, 'Simpan profil'), info),
    h('section', { class: 'kartu' }, h('h2', {}, 'Tampilan'),
      segmen('Ukuran teks', 'teks', [['normal', 'Normal'], ['besar', 'Besar']]),
      segmen('Gerakan animasi', 'gerak', [['normal', 'Normal'], ['kurang', 'Kurangi']]),
      segmen('Tema', 'tema', [['otomatis', 'Auto'], ['terang', 'Terang'], ['gelap', 'Gelap']])),
    h('section', { class: 'kartu' }, h('h2', {}, 'Suara'),
      segmen('Efek suara', 'suara', [['nyala', 'Nyala'], ['mati', 'Mati']]),
      segmen('Musik petualangan', 'musik', [['nyala', 'Nyala'], ['mati', 'Mati']]),
      h('p', { class: 'redup kecil' }, 'Musik hanya diputar di peta petualangan, tidak saat mengerjakan teka-teki.')),
    h('section', { class: 'kartu' }, h('h2', {}, '📲 Pasang aplikasi'), blokPasang()),
    h('section', { class: 'kartu' }, h('h2', {}, 'Tentang data'),
      h('p', {}, 'Nama, nilai, dan progresmu hanya disimpan di perangkat ini (penyimpanan browser). Tidak ada email, nomor HP, iklan, atau pelacak.'),
      h('p', { class: 'redup kecil' }, 'Jika data browser dihapus, progres juga ikut terhapus.'),
      h('button', {
        class: 'tombol netral penuh', type: 'button',
        onclick: () => {
          if (confirm('Hapus semua progres dan nama di perangkat ini? Tindakan ini tidak bisa dibatalkan.')) {
            simpan.hapusSemua();
            location.hash = '#/masuk';
          }
        },
      }, 'Hapus semua data saya')),
    h('p', { class: 'redup kecil', style: 'text-align:center' }, 'ULFALINE v1.0 · Zulfatul Azkiya · Pendidikan Matematika'),
  ];
}
