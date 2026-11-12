// Pengerja soal langkah demi langkah (FR-08, FR-09).
// Setiap langkah: (1) pilih operasi, (2) tulis hasilnya. Umpan balik langsung per langkah.

import { h, mat, umpan, kosongkan, bukaDialog, umumkan } from '../ui.js';
import {
  uraiKalimat, formatBentuk, formatHimpunan, himpunan, terapkan, opDariTeks, membalik,
  pilihanOperasi, periksaOperasi, periksaLangkah, petunjuk, labelDariTeks, jelaskanOperasi,
  SIMBOL, LABEL_KESALAHAN,
} from '../mesin.js';
import { buatContoh } from './contoh.js';
import { cerminTanda } from './visual.js';

const TOMBOL_PAPAN = ['7', '8', '9', 'x', '⌫', '4', '5', '6', '+', '−', '1', '2', '3', '(', ')', '0', ',', '/', '←', '→'];
const REL_PTLSV = ['<', '>', '<=', '>='];

function rapikan(teks) {
  try {
    const k = uraiKalimat(teks);
    return k.sederhana ? formatBentuk(k.bentuk) : teks.replace(/-/g, '−').replace(/\s+/g, ' ').trim();
  } catch {
    return teks;
  }
}

function bukaCermin() {
  bukaDialog('Kenapa tandanya dibalik?', cerminTanda());
}

/**
 * @param {object} o
 * @param {string} o.soal               soal awal, mis. "−2x + 3 > 7"
 * @param {boolean} [o.petunjukOtomatis] tampilkan petunjuk tingkat 1 tanpa diminta (level Dasar)
 * @param {string|null} [o.contohSerupa] soal lain untuk tombol "Contoh serupa"
 * @param {(hasil: object) => void} o.onSelesai
 */
export function buatPengerja({ soal, petunjukOtomatis = false, contohSerupa = null, onSelesai }) {
  const relSoal = uraiKalimat(soal).bentuk.rel;
  const pertidaksamaan = relSoal !== '=';
  let sekarang = soal;
  let fase = 'op';
  let opDipilih = null;
  let tingkatPetunjuk = 0;
  let dibantu = false;
  let salahLangkah = 0;
  let percobaan = 0;
  const kesalahan = {};
  const riwayat = [];
  let salahSaatIni = [];

  const daftar = h('ol', { class: 'langkah-daftar' });
  const kerja = h('div');
  const pesan = h('div', { 'aria-live': 'polite' });
  const tombolPetunjuk = h('button', { class: 'tombol kedua', type: 'button', onclick: tampilPetunjuk }, '💡 Petunjuk');
  const tombolContoh = contohSerupa
    ? h('button', { class: 'tombol kedua', type: 'button', onclick: () => bukaDialog('Contoh serupa', buatContoh(contohSerupa)) }, '📖 Contoh serupa')
    : null;
  const alat = h('div', { class: 'alat' }, tombolPetunjuk, tombolContoh);

  function catat(kode) {
    kesalahan[kode] = (kesalahan[kode] || 0) + 1;
  }

  function renderRiwayat() {
    kosongkan(daftar,
      riwayat.map((r) => h('li', {},
        h('span', { class: `chip-op${r.balik ? ' balik' : ''}` }, r.label),
        h('span', { class: 'baris-mat' }, mat(r.tampil, '')))));
  }

  function render() {
    renderRiwayat();
    if (fase === 'op') renderOp();
    else if (fase === 'isi') renderIsi();
    else renderSelesai();
  }

  // ---------------------------------------------------------- fase pilih operasi
  function renderOp() {
    const tombol = pilihanOperasi(sekarang).map((op) => {
      const b = h('button', { type: 'button', onclick: () => pilihOp(b, op) }, labelDariTeks(op));
      return b;
    });
    kosongkan(kerja,
      h('p', { class: 'redup' }, riwayat.length ? 'Langkah berikutnya: pilih operasi' : 'Langkah pertama: pilih operasi'),
      h('div', { class: 'op-pilihan', role: 'group', 'aria-label': 'Pilihan operasi' }, tombol));
    if (petunjukOtomatis && tingkatPetunjuk === 0) {
      kosongkan(pesan, umpan('info', '💡 ', petunjuk(sekarang, 1)));
    }
  }

  function pilihOp(tombol, op) {
    const r = periksaOperasi(sekarang, op);
    if (!r.ok) {
      tombol.disabled = true;
      catat('E_OPERASI_KURANG_TEPAT');
      kosongkan(pesan, umpan('salah', 'Kurang tepat. ', r.pesan));
      umumkan(r.pesan);
      return;
    }
    opDipilih = op;
    fase = 'isi';
    tingkatPetunjuk = 0;
    percobaan = 0;
    salahSaatIni = [];
    const k = uraiKalimat(sekarang);
    const o = opDariTeks(op);
    if (membalik(o, k.bentuk.rel)) {
      // Pengingat kontekstual (FR-09, IL03): muncul tepat saat dibutuhkan.
      kosongkan(pesan, umpan('awas', '⚠️ Awas! ', 'Kamu akan mengali/membagi dengan bilangan NEGATIF. Jangan lupa membalik tanda. ',
        h('button', { class: 'tombol kedua', type: 'button', onclick: bukaCermin }, 'Lihat kenapa')));
    } else {
      kosongkan(pesan, umpan('benar', '✓ ', r.pesan));
    }
    render();
  }

  // ---------------------------------------------------------- fase tulis hasil
  function renderIsi() {
    const k = uraiKalimat(sekarang);
    let rel = k.bentuk.rel === '=' ? '=' : k.bentuk.rel;
    const kiri = h('input', { type: 'text', inputmode: 'none', autocomplete: 'off', 'aria-label': 'Ruas kiri', spellcheck: 'false' });
    const kanan = h('input', { type: 'text', inputmode: 'none', autocomplete: 'off', 'aria-label': 'Ruas kanan', spellcheck: 'false' });
    let aktif = kiri;
    const fokus = (el) => { aktif = el; kiri.classList.toggle('fokus', el === kiri); kanan.classList.toggle('fokus', el === kanan); };
    kiri.addEventListener('focus', () => fokus(kiri));
    kanan.addEventListener('focus', () => fokus(kanan));
    fokus(kiri);
    const kirim = (e) => { if (e.key === 'Enter') periksa(); };
    kiri.addEventListener('keydown', kirim);
    kanan.addEventListener('keydown', kirim);

    const tampilRel = h('span', { class: 'relasi-tetap', 'aria-label': 'tanda' }, SIMBOL[rel]);
    let pemilihRel = null;
    if (pertidaksamaan) {
      const tombolRel = REL_PTLSV.map((r) => h('button', {
        type: 'button', 'aria-pressed': String(r === rel), 'aria-label': `tanda ${SIMBOL[r]}`,
        onclick: () => {
          rel = r;
          tampilRel.textContent = SIMBOL[r];
          tombolRel.forEach((b, i) => b.setAttribute('aria-pressed', String(REL_PTLSV[i] === r)));
        },
      }, SIMBOL[r]));
      pemilihRel = h('div', {}, h('p', { class: 'redup kecil', style: 'text-align:center;margin:0' }, 'Tanda:'),
        h('div', { class: 'relasi-pilih', role: 'group', 'aria-label': 'Pilih tanda' }, tombolRel));
    }

    const papan = h('div', { class: 'papan', role: 'group', 'aria-label': 'Papan ketik matematika' },
      TOMBOL_PAPAN.map((t) => h('button', {
        type: 'button', class: t === 'x' ? 'x' : null, 'aria-label': { '⌫': 'hapus', '←': 'ke ruas kiri', '→': 'ke ruas kanan' }[t] || t,
        onclick: () => ketik(t),
      }, t)));

    function ketik(t) {
      if (t === '←') { kiri.focus({ preventScroll: true }); fokus(kiri); return; }
      if (t === '→') { kanan.focus({ preventScroll: true }); fokus(kanan); return; }
      const el = aktif;
      const awal = el.selectionStart ?? el.value.length;
      const akhir = el.selectionEnd ?? el.value.length;
      if (t === '⌫') {
        const dari = awal === akhir ? Math.max(0, awal - 1) : awal;
        el.value = el.value.slice(0, dari) + el.value.slice(akhir);
        el.setSelectionRange(dari, dari);
      } else {
        el.value = el.value.slice(0, awal) + t + el.value.slice(akhir);
        el.setSelectionRange(awal + t.length, awal + t.length);
      }
    }

    function periksa() {
      const a = kiri.value.trim();
      const b = kanan.value.trim();
      if (!a || !b) {
        kosongkan(pesan, umpan('info', '', 'Isi ruas kiri dan ruas kanan dulu.'));
        return;
      }
      const jawaban = `${a} ${SIMBOL[rel]} ${b}`;
      const r = periksaLangkah(sekarang, opDipilih, jawaban);
      if (r.ok) {
        const o = opDariTeks(opDipilih);
        riwayat.push({
          sebelum: sekarang, operasi: opDipilih, label: labelDariTeks(opDipilih), jawaban,
          tampil: rapikan(jawaban), balik: membalik(o, uraiKalimat(sekarang).bentuk.rel), salah: salahSaatIni,
        });
        sekarang = rapikan(jawaban);
        opDipilih = null;
        tingkatPetunjuk = 0;
        kosongkan(pesan, umpan('benar', '✓ ', r.pesan));
        umumkan(r.pesan);
        fase = r.selesai ? 'selesai' : 'op';
        render();
        if (fase === 'selesai') selesai();
        return;
      }
      if (r.kode !== 'E_FORMAT') {
        salahLangkah += 1;
        catat(r.kode);
        salahSaatIni.push({ jawaban, kode: r.kode });
      }
      percobaan += 1;
      kosongkan(pesan, umpan('salah', 'Belum tepat. ', r.pesan,
        r.kode === 'E_TANDA_TIDAK_DIBALIK'
          ? h('div', {}, h('button', { class: 'tombol kedua', type: 'button', onclick: bukaCermin }, 'Lihat kenapa tandanya dibalik'))
          : null,
        percobaan >= 2 ? h('p', { class: 'kecil', style: 'margin:8px 0 0' }, 'Butuh bantuan? Tekan 💡 Petunjuk.') : null));
      umumkan(r.pesan);
    }

    kosongkan(kerja,
      h('p', { style: 'text-align:center;margin:0' }, h('span', { class: 'chip-op' }, labelDariTeks(opDipilih))),
      h('p', { class: 'redup', style: 'text-align:center' }, 'Tulis hasilnya:'),
      h('div', { class: 'isian' }, kiri, tampilRel, kanan),
      pemilihRel,
      papan,
      h('button', { class: 'tombol penuh', type: 'button', onclick: periksa }, 'Periksa'),
    );
  }

  // ---------------------------------------------------------- petunjuk
  function tampilPetunjuk() {
    if (fase === 'selesai') return;
    tingkatPetunjuk = Math.min(3, tingkatPetunjuk + 1);
    let teks;
    if (fase === 'op') {
      teks = petunjuk(sekarang, tingkatPetunjuk);
    } else {
      const k = uraiKalimat(sekarang);
      const o = opDariTeks(opDipilih);
      teks = [
        `Lakukan "${labelDariTeks(opDipilih)}" pada ruas kiri DAN ruas kanan.`,
        jelaskanOperasi(o, k.bentuk.rel),
        `Hasil langkah ini: ${formatBentuk(terapkan(k.bentuk, o))}`,
      ][tingkatPetunjuk - 1];
    }
    if (tingkatPetunjuk === 3) dibantu = true;
    kosongkan(pesan, umpan('info', `💡 Petunjuk ${tingkatPetunjuk}/3: `, teks));
    umumkan(teks);
  }

  // ---------------------------------------------------------- selesai
  function renderSelesai() {
    const jawaban = formatHimpunan(himpunan(uraiKalimat(sekarang).bentuk));
    kosongkan(kerja, umpan('benar', '🎉 Selesai! ', 'Jawabanmu: ', mat(jawaban)));
    tombolPetunjuk.disabled = true;
  }

  function selesai() {
    const jawaban = formatHimpunan(himpunan(uraiKalimat(sekarang).bentuk));
    onSelesai?.({
      soal, langkah: riwayat, kesalahan, salahLangkah, dibantu, jawaban,
      benar: salahLangkah === 0 && !dibantu,
      ringkasKesalahan: Object.keys(kesalahan).map((k) => LABEL_KESALAHAN[k] || k),
    });
  }

  render();
  return h('div', { class: 'kartu' },
    h('div', { class: 'soal-kepala' }, h('p', { class: 'redup', style: 'margin:0' }, 'Selesaikan:'),
      h('div', { class: 'mat-besar' }, mat(soal, ''))),
    daftar, kerja, pesan, alat);
}
