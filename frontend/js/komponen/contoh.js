// Contoh soal bertahap (worked example, FR-07): satu langkah per ketukan, bisa mundur.

import { h, mat, umpan, kosongkan } from '../ui.js';
import { selesaikan } from '../mesin.js';

export function baris(langkah) {
  return h('li', { class: 'muncul' },
    h('span', { class: `chip-op${langkah.balik ? ' balik' : ''}` }, langkah.label),
    h('span', { class: 'baris-mat' }, mat(langkah.hasil, '')),
    h('span', { class: 'penjelasan' }, langkah.balik ? '⚠️ ' : '', langkah.penjelasan));
}

export function buatContoh(soal, { catatan = null } = {}) {
  const hasil = selesaikan(soal);
  let tampil = 0;
  const daftar = h('ol', { class: 'langkah-daftar', 'aria-live': 'polite' });
  const akhir = h('div');
  const maju = h('button', { class: 'tombol', type: 'button', onclick: () => ke(tampil + 1) });
  const mundur = h('button', { class: 'tombol netral', type: 'button', onclick: () => ke(tampil - 1) }, '◀ Mundur');

  function ke(n) {
    tampil = Math.max(0, Math.min(n, hasil.langkah.length));
    kosongkan(daftar, h('li', {}, h('span', { class: 'baris-mat' }, mat(soal, ''))),
      hasil.langkah.slice(0, tampil).map(baris));
    const habis = tampil === hasil.langkah.length;
    kosongkan(akhir, habis
      ? [umpan('benar', 'Jawaban: ', mat(hasil.jawaban)), catatan ? umpan('info', 'Catatan: ', catatan) : null]
      : null);
    maju.textContent = habis ? 'Selesai ✓' : `Tampilkan langkah ${tampil + 1} ▶`;
    maju.disabled = habis;
    mundur.disabled = tampil === 0;
  }
  ke(0);
  return h('div', {}, daftar, akhir, h('div', { class: 'alat' }, mundur, maju));
}
