// Visual konsep: garis bilangan, penjelajah simbol, timbangan, dan cermin tanda.
// Animasi hanya untuk konsep (DS05) dan selalu dikendalikan siswa (EL04).

import { h, s, mat, umpan, kosongkan } from '../ui.js';
import { gerakDikurangi } from '../simpan.js';

const minus = (v) => (v < 0 ? `−${Math.abs(v)}` : String(v));

export const INFO_SIMBOL = {
  '<': { simbol: '<', baca: 'kurang dari', bulatan: 'kosong', arah: 'kiri' },
  '>': { simbol: '>', baca: 'lebih dari', bulatan: 'kosong', arah: 'kanan' },
  '<=': { simbol: '≤', baca: 'kurang dari atau sama dengan', bulatan: 'penuh', arah: 'kiri' },
  '>=': { simbol: '≥', baca: 'lebih dari atau sama dengan', bulatan: 'penuh', arah: 'kanan' },
};

/** Garis bilangan SVG. rel+nilai menggambar himpunan penyelesaian; titik menandai bilangan. */
export function garisBilangan({ rel = null, nilai = 0, min = null, maks = null, titik = [] } = {}) {
  const pusat = rel ? nilai : 0;
  const lo = min ?? Math.floor(pusat) - 5;
  const hi = maks ?? Math.floor(pusat) + 5;
  const X = (v) => 20 + ((v - lo) * 300) / (hi - lo);
  const langkahLabel = hi - lo > 14 ? 2 : 1;
  const el = s('svg', { viewBox: '0 0 340 74', class: 'visual', role: 'img' });
  el.append(s('line', { x1: 8, y1: 34, x2: 332, y2: 34, class: 'sumbu' }));
  el.append(s('path', { d: 'M332 34 l-8 -5 v10 z', fill: 'currentColor', class: 'redup' }));
  el.append(s('path', { d: 'M8 34 l8 -5 v10 z', fill: 'currentColor', class: 'redup' }));
  for (let v = Math.ceil(lo); v <= hi; v++) {
    el.append(s('line', { x1: X(v), y1: 28, x2: X(v), y2: 40, class: 'sumbu' }));
    if ((v - Math.ceil(lo)) % langkahLabel === 0) {
      el.append(s('text', { x: X(v), y: 60, 'text-anchor': 'middle', 'font-size': 13 }, minus(v)));
    }
  }
  let label = '';
  if (rel && rel !== '=') {
    const info = INFO_SIMBOL[rel];
    const ujung = info.arah === 'kiri' ? 14 : 326;
    el.append(s('line', { x1: X(nilai), y1: 34, x2: ujung, y2: 34, class: 'solusi' }));
    el.append(s('path', {
      d: info.arah === 'kiri' ? `M6 34 l12 -8 v16 z` : `M334 34 l-12 -8 v16 z`, class: 'solusi-isi',
    }));
    el.append(s('circle', { cx: X(nilai), cy: 34, r: 7, class: info.bulatan === 'penuh' ? 'titik-penuh' : 'titik-kosong' }));
    label = `Garis bilangan x ${info.baca} ${minus(nilai)}: bulatan ${info.bulatan} di ${minus(nilai)}, arsiran ke ${info.arah}.`;
  } else if (rel === '=') {
    el.append(s('circle', { cx: X(nilai), cy: 34, r: 7, class: 'titik-penuh' }));
    label = `Titik di ${minus(nilai)}.`;
  }
  for (const t of titik) {
    el.append(s('circle', { cx: X(t), cy: 34, r: 7, class: 'titik-penuh' }));
    el.append(s('text', { x: X(t), y: 18, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700 }, minus(t)));
  }
  if (titik.length) label = `Garis bilangan dengan titik ${titik.map(minus).join(' dan ')}.`;
  el.setAttribute('aria-label', label || 'Garis bilangan');
  return el;
}

/** Kartu Makna Simbol interaktif (FR-05). */
export function penjelajahSimbol() {
  const isi = h('div', { 'aria-live': 'polite' });
  const tombol = Object.keys(INFO_SIMBOL).map((rel) =>
    h('button', { type: 'button', 'aria-pressed': 'false', 'aria-label': INFO_SIMBOL[rel].baca, onclick: () => pilih(rel) },
      INFO_SIMBOL[rel].simbol));
  function pilih(rel) {
    tombol.forEach((b, i) => b.setAttribute('aria-pressed', String(Object.keys(INFO_SIMBOL)[i] === rel)));
    const info = INFO_SIMBOL[rel];
    kosongkan(isi,
      h('div', { class: 'mat-besar' }, mat(`x ${info.simbol} 3`, 'mat')),
      h('p', { class: 'redup', style: 'text-align:center' }, `dibaca "x ${info.baca} 3"`),
      garisBilangan({ rel, nilai: 3 }),
      h('p', {}, `Bulatan ${info.bulatan}: 3 ${info.bulatan === 'penuh' ? 'IKUT' : 'TIDAK ikut'}. Arsiran ke ${info.arah}.`));
  }
  pilih('<');
  return h('div', {}, h('p', {}, 'Ketuk setiap simbol untuk melihat artinya.'),
    h('div', { class: 'relasi-pilih', role: 'group', 'aria-label': 'Pilih simbol' }, tombol), isi);
}

// ------------------------------------------------------------------ timbangan
const TAHAP_TIMBANGAN = [
  { kiri: { x: 2, b: 3 }, kanan: { b: 11 }, miring: 0, mat: '2x + 3 = 11', teks: 'Kiri: 2 kotak x dan 3 beban. Kanan: 11 beban. Timbangan seimbang.' },
  { kiri: { x: 2, b: 0 }, kanan: { b: 11 }, miring: 9, mat: '2x ≠ 11', teks: 'Jika 3 beban diambil HANYA dari kiri, timbangan jadi miring. Tidak seimbang lagi!', awas: true },
  { kiri: { x: 2, b: 0 }, kanan: { b: 8 }, miring: 0, mat: '2x = 8', op: '−3 di kedua ruas', teks: 'Ambil 3 beban dari KEDUA sisi. Timbangan tetap seimbang.' },
  { kiri: { x: 1, b: 0 }, kanan: { b: 4 }, miring: 0, mat: 'x = 4', op: '÷2 di kedua ruas', teks: 'Bagi kedua sisi menjadi 2 bagian sama. Satu kotak x seimbang dengan 4 beban.' },
];

function isiPiring(g, { x = 0, b = 0 }) {
  g.replaceChildren();
  const benda = [...Array(x).fill('x'), ...Array(b).fill('b')];
  benda.forEach((jenis, i) => {
    const kol = i % 5, brs = Math.floor(i / 5);
    const diBaris = Math.min(5, benda.length - brs * 5);
    const cx = -((diBaris - 1) * 11) + kol * 22, cy = -14 - brs * 22;
    if (jenis === 'x') {
      g.append(s('rect', { x: cx - 10, y: cy - 10, width: 20, height: 20, rx: 4, fill: 'var(--var)' }));
      g.append(s('text', { x: cx, y: cy + 5, 'text-anchor': 'middle', 'font-size': 14, 'font-style': 'italic', 'font-weight': 700, fill: 'var(--surface)' }, 'x'));
    } else {
      g.append(s('circle', { cx, cy, r: 8, fill: 'var(--primary)' }));
    }
  });
}

export function timbangan() {
  let tahap = 0;
  const svg = s('svg', { viewBox: '0 0 340 210', class: 'visual', role: 'img' });
  svg.append(s('path', { d: 'M150 200 L190 200 L170 72 Z', fill: 'var(--border)' }));
  const batang = s('line', { x1: 60, y1: 70, x2: 280, y2: 70, stroke: 'var(--text-muted)', 'stroke-width': 6, 'stroke-linecap': 'round', class: 'timbangan-batang' });
  svg.append(batang);
  const piring = [0, 1].map(() => {
    const g = s('g', { class: 'gerak' });
    g.append(s('line', { x1: 0, y1: 0, x2: 0, y2: 60, stroke: 'var(--text-muted)', 'stroke-width': 2 }));
    g.append(s('path', { d: 'M-58 60 Q0 76 58 60 Z', fill: 'var(--surface-2)', stroke: 'var(--text-muted)', 'stroke-width': 2 }));
    const isi = s('g', { transform: 'translate(0 58)' });
    g.append(isi);
    svg.append(g);
    return { g, isi };
  });
  const teks = h('div', { class: 'panel-langkah', 'aria-live': 'polite' });
  const maju = h('button', { class: 'tombol', type: 'button', onclick: () => ke(tahap + 1) }, 'Langkah berikutnya ▶');
  const ulang = h('button', { class: 'tombol netral', type: 'button', onclick: () => ke(0) }, 'Ulangi');

  function ke(i) {
    tahap = Math.max(0, Math.min(i, TAHAP_TIMBANGAN.length - 1));
    const t = TAHAP_TIMBANGAN[tahap];
    const rad = (t.miring * Math.PI) / 180;
    batang.style.transformOrigin = '170px 70px';
    batang.style.transform = `rotate(${t.miring}deg)`;
    const lengan = 110;
    const ujung = [[170 - lengan * Math.cos(rad), 70 - lengan * Math.sin(rad)], [170 + lengan * Math.cos(rad), 70 + lengan * Math.sin(rad)]];
    piring.forEach((p, j) => { p.g.style.transform = `translate(${ujung[j][0]}px, ${ujung[j][1]}px)`; });
    isiPiring(piring[0].isi, t.kiri);
    isiPiring(piring[1].isi, t.kanan);
    svg.setAttribute('aria-label', `Timbangan: ${t.teks}`);
    kosongkan(teks,
      t.op ? h('p', { style: 'text-align:center' }, h('span', { class: 'chip-op' }, t.op)) : null,
      h('div', { class: 'mat-besar' }, mat(t.mat)),
      t.awas ? umpan('awas', '⚠️ ', t.teks) : h('p', {}, t.teks));
    maju.disabled = tahap === TAHAP_TIMBANGAN.length - 1;
  }
  ke(0);
  return h('div', {}, svg, teks, h('div', { class: 'alat' }, ulang, maju));
}

// --------------------------------------------------------------------- cermin
export function cerminTanda() {
  const lo = -6, hi = 6;
  const X = (v) => 20 + ((v - lo) * 300) / (hi - lo);
  const satuan = 300 / (hi - lo);
  const svg = s('svg', { viewBox: '0 0 340 96', class: 'visual', role: 'img' });
  svg.append(s('line', { x1: 8, y1: 52, x2: 332, y2: 52, class: 'sumbu' }));
  for (let v = lo; v <= hi; v++) {
    svg.append(s('line', { x1: X(v), y1: 46, x2: X(v), y2: 58, class: 'sumbu' }));
    svg.append(s('text', { x: X(v), y: 78, 'text-anchor': 'middle', 'font-size': 12 }, minus(v)));
  }
  svg.append(s('line', { x1: X(0), y1: 6, x2: X(0), y2: 90, stroke: 'var(--flip)', 'stroke-dasharray': '4 4', 'stroke-width': 2 }));
  const titik = [[2, 'var(--primary)'], [5, 'var(--op)']].map(([v, warna]) => {
    const g = s('g', { class: 'gerak' });
    g.append(s('circle', { cx: 0, cy: 52, r: 8, fill: warna }));
    const label = s('text', { x: 0, y: 30, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: warna }, String(v));
    g.append(label);
    svg.append(g);
    return { g, label, v };
  });
  const TAHAP = [
    { k: 1, teks: [mat('2 < 5'), ' karena 2 ada di KIRI 5.'] },
    { k: -1, op: '× (−1)', teks: ['Kalikan dengan −1: setiap titik dicerminkan terhadap 0. Titik 2 pindah ke −2, titik 5 pindah ke −5.'] },
    { k: -1, teks: ['Lihat! Sekarang −5 ada di KIRI −2. Urutannya terbalik.'] },
    { k: -1, kesimpulan: true },
    { k: -1, cek: true },
  ];
  let tahap = 0;
  const teks = h('div', { class: 'panel-langkah', 'aria-live': 'polite' });
  const maju = h('button', { class: 'tombol', type: 'button', onclick: () => ke(tahap + 1) }, 'Langkah berikutnya ▶');
  const ulang = h('button', { class: 'tombol netral', type: 'button', onclick: () => ke(0) }, 'Ulangi');

  function ke(i) {
    tahap = Math.max(0, Math.min(i, TAHAP.length - 1));
    const t = TAHAP[tahap];
    for (const p of titik) {
      const nilai = p.v * t.k;
      p.g.style.transform = `translate(${X(0) + nilai * satuan}px, 0px)`;
      p.label.textContent = minus(nilai);
    }
    svg.setAttribute('aria-label', t.k === 1 ? 'Titik 2 dan 5 di garis bilangan' : 'Titik −2 dan −5 di garis bilangan');
    if (t.kesimpulan) {
      kosongkan(teks, h('div', { class: 'mat-besar' }, mat('2 < 5  →  −2 > −5')),
        umpan('awas', 'Jadi: ', 'mengali (atau membagi) dengan bilangan negatif membalik urutan bilangan, maka tanda pertidaksamaan juga DIBALIK.'));
    } else if (t.cek) {
      const hasil = h('div', { 'aria-live': 'polite' });
      const jawab = (rel) => kosongkan(hasil, rel === '>'
        ? umpan('benar', '✓ Tepat! ', '3 < 7, maka −3 > −7. Tandanya dibalik.')
        : umpan('salah', 'Belum tepat. ', 'Ingat: dikali −1 membalik urutan. −3 ada di kanan −7, jadi −3 lebih besar.'));
      kosongkan(teks, h('p', {}, 'Cek pemahaman: jika 3 < 7, maka −3 … −7?'),
        h('div', { class: 'relasi-pilih' },
          h('button', { type: 'button', onclick: () => jawab('<'), 'aria-label': 'kurang dari' }, '<'),
          h('button', { type: 'button', onclick: () => jawab('>'), 'aria-label': 'lebih dari' }, '>')),
        hasil);
    } else {
      kosongkan(teks, t.op ? h('p', { style: 'text-align:center' }, h('span', { class: 'chip-op balik' }, t.op)) : null,
        h('p', {}, ...t.teks));
    }
    maju.disabled = tahap === TAHAP.length - 1;
  }
  ke(0);
  // Saat dimuat ulang tanpa animasi, posisi langsung akhir; tidak ada autoplay.
  if (gerakDikurangi()) titik.forEach((p) => p.g.classList.remove('gerak'));
  return h('div', {}, svg, teks, h('div', { class: 'alat' }, ulang, maju));
}
