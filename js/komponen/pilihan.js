// Soal pilihan ganda dengan umpan balik langsung. Urutan pilihan diacak.

import { h, mat, umpan, acak, kosongkan } from '../ui.js';
import { garisBilangan } from './visual.js';

/** Pilihan berupa rumus memakai huruf matematika; kalimat biasa tetap teks biasa. */
export function tampilan(teks) {
  const rumus = (/[<>≤≥=]/.test(teks) && teks.length < 32) || /^[-−\d\s+x()/,.×÷]+$/.test(teks);
  return rumus ? mat(teks) : teks;
}

/**
 * onBenar(benarPertama) dipanggil sekali saat siswa memilih jawaban yang benar.
 * Pilihan salah memberi umpan balik dan siswa boleh mencoba lagi.
 */
export function buatPilihan({ tanya, pilihan, benar, penjelasan = '', umpanSalah = [], garis = null, onBenar = () => {} }) {
  let salahDulu = false;
  let selesai = false;
  const hasil = h('div', { 'aria-live': 'polite' });
  const urutan = acak(pilihan.map((teks, i) => ({ teks, i })));
  const tombol = urutan.map(({ teks, i }) => {
    const b = h('button', { type: 'button', 'aria-pressed': 'false', onclick: () => jawab(b, i) }, tampilan(teks));
    return b;
  });

  function jawab(b, i) {
    if (selesai) return;
    if (i === benar) {
      selesai = true;
      b.classList.add('benar');
      b.setAttribute('aria-pressed', 'true');
      tombol.forEach((t) => { t.disabled = true; });
      kosongkan(hasil, umpan('benar', '✓ Tepat! ', penjelasan));
      onBenar(!salahDulu);
    } else {
      salahDulu = true;
      b.classList.add('salah');
      b.disabled = true;
      kosongkan(hasil, umpan('salah', 'Belum tepat. ', umpanSalah[i] || 'Coba pilih jawaban lain.'));
    }
  }

  return h('div', {},
    h('p', {}, h('strong', {}, tanya)),
    garis ? garisBilangan(garis) : null,
    h('div', { class: 'pilihan' }, tombol),
    hasil);
}
