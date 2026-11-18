// Layar awal ULFALINE (sebelum login): layar penuh bergambar, judul besar dengan ubin simbol
// matematika melayang, tombol "mulai", kartu karakter, lalu lembar isian nama dari bawah.
// Semua gambar orisinal (SVG).

import { h, s, umpan } from '../ui.js';
import * as simpan from '../simpan.js';
import { gambarUlfa } from '../komponen/ilustrasi.js';
import { tokoh } from '../komponen/tokoh.js';

const UBIN = [
  { simbol: 'x', warna: '#7c4ddb', kelas: 'u1' },
  { simbol: '=', warna: '#2f8a4a', kelas: 'u2' },
  { simbol: '<', warna: '#e8578a', kelas: 'u3' },
  { simbol: '≥', warna: '#f0932b', kelas: 'u4' },
  { simbol: '÷', warna: '#2b7bd6', kelas: 'u5' },
];

function bersihkan(teks, maks) {
  return teks.replace(/[<>]/g, '').trim().slice(0, maks);
}

/** Latar layar penuh: langit, pohon besar, gunung, sungai, rumput. */
function latar() {
  const svg = s('svg', { viewBox: '0 0 400 860', preserveAspectRatio: 'xMidYMid slice', class: 'latar-awal', 'aria-hidden': 'true' });
  svg.append(
    s('defs', {},
      s('linearGradient', { id: 'la-langit', x1: 0, y1: 0, x2: 0, y2: 1 },
        s('stop', { offset: '0%', 'stop-color': '#bfe1f7' }), s('stop', { offset: '100%', 'stop-color': '#dff0fb' }))),
    s('rect', { width: 400, height: 860, fill: 'url(#la-langit)' }),
    // awan
    s('path', { d: 'M300 120 c0 -18 22 -26 34 -14 c8 -16 34 -12 36 6 c16 0 18 22 0 22 h-62 c-14 0 -16 -14 -8 -14 z', fill: '#fff', opacity: 0.9 }),
    s('path', { d: 'M40 260 c0 -12 16 -18 24 -9 c6 -11 24 -8 25 4 c11 0 12 15 0 15 h-43 c-10 0 -11 -10 -6 -10 z', fill: '#fff', opacity: 0.8 }),
    // gunung & hutan jauh
    s('path', { d: 'M-20 470 L70 360 L140 430 L220 330 L320 440 L420 380 L420 520 L-20 520 Z', fill: '#a9c9e8' }),
    s('path', { d: 'M-20 500 C40 450 80 470 120 455 C170 436 210 470 260 452 C310 434 360 460 420 446 L420 560 L-20 560 Z', fill: '#4f8f6a' }),
    ...[30, 90, 150, 210, 270, 330, 390].map((x, i) => s('path', { d: `M${x} ${470 - (i % 2) * 14} l-22 60 h44 z`, fill: '#3f7d5b' })),
    // sungai
    s('path', { d: 'M-20 548 C80 538 160 560 240 548 C300 540 360 552 420 546 L420 600 L-20 600 Z', fill: '#8fb7ea' }),
    s('path', { d: 'M40 566 h40 M190 574 h50 M310 562 h36', stroke: '#c7ddf7', 'stroke-width': 4, 'stroke-linecap': 'round' }),
    // padang rumput depan
    s('path', { d: 'M-20 590 C80 570 200 600 300 584 C350 576 390 584 420 580 L420 860 L-20 860 Z', fill: '#6cbf55' }),
    s('path', { d: 'M-20 700 C100 676 220 708 420 684 L420 860 L-20 860 Z', fill: '#5cad49' }),
    // pohon besar kiri (batang & tajuk)
    s('path', { d: 'M38 860 C46 700 50 520 60 300 C62 250 70 220 84 200 L104 206 C92 230 88 270 88 310 C86 520 84 700 92 860 Z', fill: '#9a5a36' }),
    s('path', { d: 'M86 330 C120 300 150 296 176 300', stroke: '#9a5a36', 'stroke-width': 14, 'stroke-linecap': 'round', fill: 'none' }),
    s('ellipse', { cx: 70, cy: 120, rx: 140, ry: 96, fill: '#2f6f4f' }),
    s('ellipse', { cx: 200, cy: 70, rx: 110, ry: 70, fill: '#3b8a5c' }),
    s('ellipse', { cx: 30, cy: 230, rx: 90, ry: 60, fill: '#3b8a5c' }),
    s('ellipse', { cx: 190, cy: 300, rx: 60, ry: 32, fill: '#4f9f62' }),
    // semak depan
    s('ellipse', { cx: 20, cy: 760, rx: 70, ry: 50, fill: '#2f6f4f' }),
    s('ellipse', { cx: 390, cy: 790, rx: 60, ry: 44, fill: '#3b8a5c' }),
    ...[[120, 640], [250, 650], [340, 630], [60, 690]].map(([x, y]) => s('path', { d: `M${x} ${y} q-6 -16 -2 -26 q4 10 4 26 q2 -16 8 -22 q-2 14 -4 22 z`, fill: '#4f9f3f' })),
  );
  return svg;
}

export function halamanMasuk() {
  const nama = h('input', { class: 'teks', id: 'nama', autocomplete: 'nickname', maxlength: 20, required: true });
  const kelas = h('input', { class: 'teks', id: 'kelas', autocomplete: 'off', maxlength: 12, placeholder: 'contoh: IX-A' });
  const pesan = h('div', { 'aria-live': 'polite' });

  const lembar = h('div', { class: 'lembar-latar', hidden: true, onclick: (e) => { if (e.target === lembar) tutup(); } },
    h('form', {
      class: 'lembar', 'aria-label': 'Isi nama untuk mulai',
      onsubmit: (e) => {
        e.preventDefault();
        const n = bersihkan(nama.value, 20);
        if (!n) { pesan.replaceChildren(umpan('salah', '', 'Tulis nama panggilanmu dulu ya.')); nama.focus(); return; }
        simpan.setProfil({ nama: n, kelas: bersihkan(kelas.value, 12) });
        location.hash = '#/mulai';
      },
    },
    h('div', { class: 'pegangan', 'aria-hidden': 'true' }),
    h('div', { class: 'baris', style: 'justify-content:center;gap:4px' }, tokoh('ulfa', 'hore', 64), tokoh('lino', 'senyum', 54)),
    h('h2', { style: 'text-align:center' }, 'Siapa nama panggilanmu?'),
    h('label', { class: 'isian-teks', for: 'nama' }, 'Nama panggilan'), nama,
    h('label', { class: 'isian-teks', for: 'kelas' }, 'Kelas (boleh dikosongkan)'), kelas,
    pesan,
    h('button', { class: 'tombol penuh', type: 'submit', style: 'margin-top:16px' }, 'Mulai Belajar'),
    h('p', { class: 'redup kecil', style: 'margin:12px 0 0;text-align:center' }, 'Nama hanya disimpan di perangkat ini. Tidak perlu email atau nomor HP.')));

  function buka() {
    lembar.hidden = false;
    requestAnimationFrame(() => lembar.classList.add('terbuka'));
    setTimeout(() => nama.focus(), 250);
  }
  function tutup() {
    lembar.classList.remove('terbuka');
    setTimeout(() => { lembar.hidden = true; }, 250);
  }

  const kartu = (isi, label, sub, aksi, menunggu = false) => h('div', { class: 'kartu-awal' },
    h('div', { class: 'avatar-awal' }, isi),
    h('strong', {}, label), h('span', {}, sub),
    h('button', { type: 'button', class: `pil ${menunggu ? 'tunggu' : ''}`, onclick: aksi }, menunggu ? 'gabung' : 'main'));

  const ulfaBesar = s('svg', { viewBox: '0 0 100 172', class: 'ulfa-awal', 'aria-hidden': 'true' }, gambarUlfa('hore'));

  return [h('div', { class: 'layar-awal' },
    latar(),
    h('div', { class: 'isi-awal' },
      h('div', { class: 'judul-awal' },
        UBIN.map((u) => h('span', { class: `ubin ${u.kelas}`, style: `color:${u.warna}`, 'aria-hidden': 'true' }, u.simbol)),
        h('h1', { class: 'plakat' }, h('span', {}, 'ulfa'), h('span', {}, 'line')),
        h('p', { class: 'slogan' }, 'Petualangan Aljabar SMP')),
      h('div', { class: 'baris-mulai' },
        h('button', { class: 'tombol-main', type: 'button', onclick: buka, 'aria-label': 'Mulai' }, h('span', { 'aria-hidden': 'true' }, '▶'), 'mulai'),
        h('div', { class: 'profil-awal' }, ulfaBesar, h('span', { class: 'pil kecil' }, 'Ulfa'))),
      h('div', { class: 'deret-kartu' },
        kartu(tokoh('ulfa', 'senyum', 62, { lompat: false }), 'Ulfa', 'penjelajah', buka),
        kartu(tokoh('lino', 'senyum', 62, { lompat: false }), 'Lino', 'sahabat', buka),
        kartu(h('span', { class: 'tanya-awal' }, '?'), 'Kamu', 'siswa baru', buka, true)),
      h('button', { class: 'lingkar-pelangi', type: 'button', onclick: buka, 'aria-label': 'Mulai bersama Ulfa' },
        h('span', {}, tokoh('ulfa', 'senyum', 56, { lompat: false })))),
    lembar)];
}
