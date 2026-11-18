// Ilustrasi kartun 2D ORISINAL ULFALINE: Ulfa (siswi SMP) & Lino berbadan penuh, adegan, peti harta.
// Gaya: garis tegas, warna cerah, gradasi lembut. Bukan karakter/elemen dari karya pihak lain.

import { s } from '../ui.js';

const GARIS = '#8a5a3b';
let nomor = 0;

/** Definisi gradasi dengan id unik per gambar. */
function gradasi(id, atas, bawah, arah = 'v') {
  return s('linearGradient', { id, x1: 0, y1: 0, x2: arah === 'h' ? 1 : 0, y2: arah === 'h' ? 0 : 1 },
    s('stop', { offset: '0%', 'stop-color': atas }), s('stop', { offset: '100%', 'stop-color': bawah }));
}

// ------------------------------------------------------------------- Ulfa
/**
 * Ulfa, siswi SMP berseragam: bentuk melengkung halus, garis tepi lembut, gradasi & kilau.
 * Lengan, kaki, dan mata adalah grup terpisah (kelas CSS) agar bisa beranimasi luwes.
 * Koordinat lokal: lebar ±100, kaki di y = 168. pose: 'jalan' | 'hore' | 'tunjuk' | 'diam'
 */
export function gambarUlfa(pose = 'diam', u = `u${nomor++}`) {
  const G = '#8a5a3b';
  const W = 1.6;
  const g = s('g', { class: `ulfa pose-${pose}` });
  g.append(s('defs', {},
    gradasi(`${u}rb`, '#a8673a', '#6f3b1f'),
    gradasi(`${u}kl`, '#ffe3cc', '#f6c4a2'),
    gradasi(`${u}rk`, '#3b5aa3', '#22356b'),
    gradasi(`${u}kj`, '#ffffff', '#e9eef6'),
    gradasi(`${u}rs`, '#ffa3c0', '#f0628f'),
    gradasi(`${u}sp`, '#ff9cbc', '#f2668f'),
    s('radialGradient', { id: `${u}pipi` }, s('stop', { offset: '0%', 'stop-color': '#ff8f9a', 'stop-opacity': 0.75 }), s('stop', { offset: '100%', 'stop-color': '#ff8f9a', 'stop-opacity': 0 }))));
  const KULIT = `url(#${u}kl)`;

  // Satu lengan: bentuk meruncing melengkung dengan tangan bulat, berporos di bahu (0,0).
  const lengan = (sudut, kelas) => s('g', { class: `lengan ${kelas}`, style: `--sudut:${sudut}deg`, transform: `rotate(${sudut})` },
    s('path', { d: 'M-4.5 0 C-5.5 9 -5 17 -3.6 24 C-2.6 27.5 2.6 27.5 3.6 24 C5 17 5.5 9 4.5 0 Z', fill: KULIT, stroke: G, 'stroke-width': W }),
    s('path', { d: 'M-6.5 -2 C-7 4 -6 8 -5 10 C-1 12 1 12 5 10 C6 8 7 4 6.5 -2 Z', fill: `url(#${u}kj)`, stroke: G, 'stroke-width': W }),
    s('ellipse', { cx: 0, cy: 28, rx: 5.4, ry: 5.8, fill: KULIT, stroke: G, 'stroke-width': W }));
  // Satu kaki: paha-betis meruncing, kaus kaki, sepatu kets membulat. Poros di pinggul (0,0).
  const kaki = (sudut, kelas) => s('g', { class: `kaki ${kelas}`, style: `--sudut:${sudut}deg`, transform: `rotate(${sudut})` },
    s('path', { d: 'M-5 0 C-5.5 10 -4.6 20 -3.6 28 L3.6 28 C4.6 20 5.5 10 5 0 Z', fill: KULIT, stroke: G, 'stroke-width': W }),
    s('path', { d: 'M-4.2 20 C-4.4 24 -4 27 -3.8 31 L3.8 31 C4 27 4.4 24 4.2 20 Z', fill: '#ffffff', stroke: G, 'stroke-width': W }),
    s('path', { d: 'M-7 36 C-7.5 30.5 -4 29 0 29 C6 29 10.5 31.5 11 35.5 C11.2 37.5 9.5 38.6 7.5 38.6 L-5 38.6 C-6.4 38.6 -7 37.6 -7 36 Z', fill: `url(#${u}sp)`, stroke: G, 'stroke-width': W }),
    s('path', { d: 'M-7 36.2 L11 36.2', stroke: '#fff', 'stroke-width': 2, 'stroke-linecap': 'round' }),
    s('path', { d: 'M-1 31.5 q2 1 4 0', stroke: '#fff', 'stroke-width': 1.2, fill: 'none', 'stroke-linecap': 'round' }));

  const sudut = {
    jalan: { la: 22, ra: -22, lk: 12, rk: -12 },
    hore: { la: 128, ra: -150, lk: 6, rk: -6 },
    tunjuk: { la: 10, ra: -100, lk: 3, rk: -3 },
    diam: { la: 12, ra: -12, lk: 2, rk: -2 },
  }[pose] || { la: 12, ra: -12, lk: 2, rk: -2 };

  const badan = s('g', { class: 'badan' });
  badan.append(
    // ransel membulat
    s('path', { d: 'M23 92 C21 80 30 76 50 76 C70 76 79 80 77 92 L76 118 C76 124 70 127 50 127 C30 127 24 124 24 118 Z', fill: `url(#${u}rs)`, stroke: G, 'stroke-width': W }),
    // kaki (di belakang rok)
    s('g', { transform: 'translate(43 124)' }, kaki(sudut.lk, 'kaki-kiri')),
    s('g', { transform: 'translate(57 124)' }, kaki(sudut.rk, 'kaki-kanan')),
    // rok lipit melebar dengan ujung bergelombang
    s('path', { d: 'M31 100 C40 98 60 98 69 100 C73 110 77 120 79 129 C74 131.5 70 129.5 65 131.5 C60 129.5 55 131.5 50 129.5 C45 131.5 40 129.5 35 131.5 C30 129.5 26 131.5 21 129 C23 120 27 110 31 100 Z', fill: `url(#${u}rk)`, stroke: G, 'stroke-width': W }),
    ...[38, 46, 54, 62].map((x) => s('path', { d: `M${x} 102 C${x + (x - 50) * 0.15} 112 ${x + (x - 50) * 0.3} 122 ${x + (x - 50) * 0.38} 130`, stroke: '#1b2a57', 'stroke-width': 1.1, fill: 'none', opacity: 0.8 })),
    // kemeja putih
    s('path', { d: 'M33 79 C40 75 60 75 67 79 C69 86 70 94 69.5 101.5 C60 104 40 104 30.5 101.5 C30 94 31 86 33 79 Z', fill: `url(#${u}kj)`, stroke: G, 'stroke-width': W }),
    s('path', { d: 'M42 75.5 C45 79 47.5 82 50 85 C52.5 82 55 79 58 75.5 C56 74.5 54 74.2 50 78.5 C46 74.2 44 74.5 42 75.5 Z', fill: '#fff', stroke: G, 'stroke-width': W }),
    s('circle', { cx: 50, cy: 90, r: 1.3, fill: G }),
    s('circle', { cx: 50, cy: 96, r: 1.3, fill: G }),
    // tali ransel melengkung
    s('path', { d: 'M37.5 78 C35.5 86 35.5 94 37.5 101', stroke: '#f0628f', 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: 'M62.5 78 C64.5 86 64.5 94 62.5 101', stroke: '#f0628f', 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }),
    // lengan (poros di bahu)
    s('g', { transform: 'translate(32 81)' }, lengan(sudut.la, 'lengan-kiri')),
    s('g', { transform: 'translate(68 81)' }, lengan(sudut.ra, 'lengan-kanan')),
  );

  const kepala = s('g', { class: 'kepala' });
  kepala.append(
    // kuncir bergelombang & pita simpul bulat
    s('path', { d: 'M30 36 C14 38 8 56 13 72 C15 79 20 84 24 86 C21 79 20 72 22 65 C24 57 28 50 34 45 Z', fill: `url(#${u}rb)`, stroke: G, 'stroke-width': W }),
    s('path', { d: 'M16 60 C17 68 19 74 22 79', stroke: '#c58a5c', 'stroke-width': 1.3, fill: 'none', opacity: 0.8 }),
    s('g', { transform: 'translate(27 31) rotate(-18)' },
      s('path', { d: 'M0 0 C-6 -9 -15 -8 -15 -1 C-15 6 -6 6 0 0 Z', fill: '#ff7fa8', stroke: G, 'stroke-width': W }),
      s('path', { d: 'M0 0 C6 -9 15 -8 15 -1 C15 6 6 6 0 0 Z', fill: '#ff7fa8', stroke: G, 'stroke-width': W }),
      s('path', { d: 'M-1 1 C-4 6 -6 9 -7 12 M1 1 C4 6 6 9 7 12', stroke: '#ff7fa8', 'stroke-width': 3, 'stroke-linecap': 'round' }),
      s('ellipse', { cx: 0, cy: 0, rx: 3.6, ry: 3.2, fill: '#ff5b93', stroke: G, 'stroke-width': W })),
    // kepala & wajah
    s('ellipse', { cx: 50.5, cy: 48, rx: 24, ry: 25, fill: `url(#${u}rb)`, stroke: G, 'stroke-width': W }),
    s('path', { d: 'M31 58 C30 44 38 34 51 34 C64 34 72 44 71 58 C70 68 62 74 51 74 C40 74 32 68 31 58 Z', fill: KULIT, stroke: G, 'stroke-width': W }),
    s('ellipse', { cx: 71.5, cy: 56, rx: 3.6, ry: 4.6, fill: KULIT, stroke: G, 'stroke-width': W }),
    // poni lembut menyamping
    s('path', { d: 'M27.5 49 C28 31 44 23 56 25 C67 27 75 36 75 46 C70 40 63 37.5 56 39 C53 42 50 45 46.5 46 C46 41.5 47 39 48 37.5 C42 39 36 43.5 32 51 Z', fill: `url(#${u}rb)`, stroke: G, 'stroke-width': W }),
    s('path', { d: 'M40 31 C46 27.5 55 27 61 29', stroke: '#d79c6c', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round', opacity: 0.85 }),
    // mata besar dengan kilau (grup "mata" berkedip)
    s('g', { class: 'mata' },
      s('ellipse', { cx: 43, cy: 56, rx: 3.9, ry: 4.9, fill: '#3a2216' }),
      s('ellipse', { cx: 59, cy: 56, rx: 3.9, ry: 4.9, fill: '#3a2216' }),
      s('circle', { cx: 44.4, cy: 54.2, r: 1.5, fill: '#fff' }),
      s('circle', { cx: 60.4, cy: 54.2, r: 1.5, fill: '#fff' }),
      s('circle', { cx: 42.2, cy: 58, r: 0.7, fill: '#fff' }),
      s('circle', { cx: 58.2, cy: 58, r: 0.7, fill: '#fff' })),
    s('path', { d: 'M38.5 49.5 C40.5 47.8 43.5 47.4 46.5 48.6 M55.5 48.6 C58.5 47.4 61.5 47.8 63.5 49.5', stroke: '#7a4a2a', 'stroke-width': 1.4, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: 'M50.8 60.5 q1.3 1.3 0 2.4', stroke: '#d89a7c', 'stroke-width': 1.2, fill: 'none', 'stroke-linecap': 'round' }),
    s('ellipse', { cx: 37.5, cy: 63, rx: 5, ry: 3.4, fill: `url(#${u}pipi)` }),
    s('ellipse', { cx: 64.5, cy: 63, rx: 5, ry: 3.4, fill: `url(#${u}pipi)` }),
    pose === 'hore'
      ? s('path', { d: 'M44.5 65 C46 71 56 71 57.5 65 C54 66.5 48 66.5 44.5 65 Z', fill: '#c94b5a', stroke: G, 'stroke-width': 1.3 })
      : s('path', { d: 'M45.5 65.2 C47.5 69 54.5 69 56.5 65.2', stroke: '#b3404f', 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }),
  );

  g.append(s('ellipse', { cx: 50, cy: 166, rx: 24, ry: 4, fill: 'rgba(90,60,30,.16)' }), badan, kepala);
  return g;
}

// ------------------------------------------------------------------- Lino
/** Lino si tarsius berbadan penuh. Lebar ±70, kaki di y = 96. pose: 'duduk' | 'hore' */
export function gambarLino(pose = 'duduk', u = `l${nomor++}`) {
  const bulu = `url(#${u}b)`;
  const g = s('g', {});
  const naik = pose === 'hore';
  g.append(
    s('defs', {}, gradasi(`${u}b`, '#b98a5a', '#8c6238')),
    // ekor panjang berujung jumbai
    s('path', { d: 'M44 86 C66 86 70 60 62 44', stroke: GARIS, 'stroke-width': 5, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: 'M44 86 C66 86 70 60 62 44', stroke: '#9a6f45', 'stroke-width': 2.8, fill: 'none', 'stroke-linecap': 'round' }),
    s('ellipse', { cx: 61, cy: 40, rx: 5, ry: 8, fill: '#7a5532', stroke: GARIS, 'stroke-width': 1.8 }),
    // badan & kaki
    s('ellipse', { cx: 35, cy: 78, rx: 15, ry: 17, fill: bulu, stroke: GARIS, 'stroke-width': 1.6 }),
    s('ellipse', { cx: 35, cy: 81, rx: 9, ry: 11, fill: '#e2c39a' }),
    s('ellipse', { cx: 26, cy: 94, rx: 7, ry: 4, fill: bulu, stroke: GARIS, 'stroke-width': 1.8 }),
    s('ellipse', { cx: 44, cy: 94, rx: 7, ry: 4, fill: bulu, stroke: GARIS, 'stroke-width': 1.8 }),
    // lengan panjang
    s('path', { d: naik ? 'M24 72 Q14 58 12 46' : 'M24 74 Q18 84 24 90', stroke: GARIS, 'stroke-width': 6.5, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: naik ? 'M24 72 Q14 58 12 46' : 'M24 74 Q18 84 24 90', stroke: '#a87c50', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: naik ? 'M46 72 Q56 58 58 46' : 'M46 74 Q52 84 46 90', stroke: GARIS, 'stroke-width': 6.5, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: naik ? 'M46 72 Q56 58 58 46' : 'M46 74 Q52 84 46 90', stroke: '#a87c50', 'stroke-width': 4, fill: 'none', 'stroke-linecap': 'round' }),
    // syal
    s('path', { d: 'M22 60 Q35 67 48 60 L47 66 Q35 73 23 66 Z', fill: '#ff6f59', stroke: GARIS, 'stroke-width': 1.8 }),
    // telinga
    s('ellipse', { cx: 15, cy: 22, rx: 9, ry: 12, fill: bulu, stroke: GARIS, 'stroke-width': 2, transform: 'rotate(-28 15 22)' }),
    s('ellipse', { cx: 15, cy: 22, rx: 5, ry: 7.5, fill: '#f2b9a2', transform: 'rotate(-28 15 22)' }),
    s('ellipse', { cx: 55, cy: 22, rx: 9, ry: 12, fill: bulu, stroke: GARIS, 'stroke-width': 2, transform: 'rotate(28 55 22)' }),
    s('ellipse', { cx: 55, cy: 22, rx: 5, ry: 7.5, fill: '#f2b9a2', transform: 'rotate(28 55 22)' }),
    // kepala & mata besar
    s('circle', { cx: 35, cy: 40, r: 22, fill: bulu, stroke: GARIS, 'stroke-width': 1.6 }),
    s('ellipse', { cx: 35, cy: 46, rx: 15, ry: 13, fill: '#e2c39a' }),
    s('circle', { cx: 26, cy: 38, r: 9.5, fill: '#fff8de', stroke: GARIS, 'stroke-width': 1.6 }),
    s('circle', { cx: 44, cy: 38, r: 9.5, fill: '#fff8de', stroke: GARIS, 'stroke-width': 1.6 }),
    s('circle', { cx: 26, cy: 38.5, r: 7, fill: '#e3a21f' }),
    s('circle', { cx: 44, cy: 38.5, r: 7, fill: '#e3a21f' }),
    s('circle', { cx: 26, cy: 39, r: 4.2, fill: '#1d130b' }),
    s('circle', { cx: 44, cy: 39, r: 4.2, fill: '#1d130b' }),
    s('circle', { cx: 28, cy: 36, r: 1.8, fill: '#fff' }),
    s('circle', { cx: 46, cy: 36, r: 1.8, fill: '#fff' }),
    s('ellipse', { cx: 35, cy: 48, rx: 2.2, ry: 1.5, fill: '#4a2e1a' }),
    naik
      ? s('path', { d: 'M30 52 Q35 59 40 52 Z', fill: '#8a2f22', stroke: GARIS, 'stroke-width': 1.3 })
      : s('path', { d: 'M31 52 Q35 55.5 39 52', stroke: '#4a2e1a', 'stroke-width': 1.6, fill: 'none', 'stroke-linecap': 'round' }),
  );
  return g;
}

// ------------------------------------------------------------- unsur alam
export function daunTropis(x, y, skala = 1, putar = 0, warna = '#2fa35a') {
  const g = s('g', { transform: `translate(${x} ${y}) rotate(${putar}) scale(${skala})` });
  g.append(
    s('path', { d: 'M0 0 C-30 -20 -34 -60 0 -90 C34 -60 30 -20 0 0 Z', fill: warna, stroke: GARIS, 'stroke-width': 2 }),
    s('path', { d: 'M0 -4 L0 -84', stroke: '#1d6e3a', 'stroke-width': 2, fill: 'none' }),
    ...[-20, -40, -60].map((yy) => s('path', { d: `M0 ${yy} L-16 ${yy - 14} M0 ${yy} L16 ${yy - 14}`, stroke: '#1d6e3a', 'stroke-width': 1.5 })),
  );
  return g;
}

export function awan(x, y, skala = 1) {
  return s('g', { transform: `translate(${x} ${y}) scale(${skala})` },
    s('path', { d: 'M-30 10 C-44 10 -44 -8 -30 -8 C-30 -24 -8 -26 -2 -14 C4 -28 30 -24 28 -6 C42 -6 42 10 28 10 Z', fill: '#fff', stroke: '#9cc9e8', 'stroke-width': 2 }));
}

export function matahari(x, y, r = 22) {
  const sinar = [];
  for (let i = 0; i < 12; i++) {
    const a = (i / 12) * Math.PI * 2;
    sinar.push(s('path', {
      d: `M${x + Math.cos(a) * (r + 4)} ${y + Math.sin(a) * (r + 4)} L${x + Math.cos(a + 0.12) * (r + 15)} ${y + Math.sin(a + 0.12) * (r + 15)} L${x + Math.cos(a - 0.12) * (r + 15)} ${y + Math.sin(a - 0.12) * (r + 15)} Z`,
      fill: '#ffd34d',
    }));
  }
  return s('g', { class: 'matahari' }, ...sinar, s('circle', { cx: x, cy: y, r, fill: '#ffd34d', stroke: '#f2a51a', 'stroke-width': 3 }));
}

export function bunga(x, y, warna = '#ff6f59', r = 5) {
  const kelopak = [0, 72, 144, 216, 288].map((d) => s('circle', {
    cx: x + Math.cos((d * Math.PI) / 180) * r, cy: y + Math.sin((d * Math.PI) / 180) * r, r: r * 0.75, fill: warna, stroke: GARIS, 'stroke-width': 1,
  }));
  return s('g', {}, ...kelopak, s('circle', { cx: x, cy: y, r: r * 0.55, fill: '#ffd34d', stroke: GARIS, 'stroke-width': 1 }));
}

export function kupu(x, y, warna = '#ffc93c') {
  return s('g', { transform: `translate(${x} ${y})` }, s('g', { class: 'kupu' },
    s('ellipse', { cx: -6, cy: 0, rx: 7, ry: 5.5, fill: warna, stroke: GARIS, 'stroke-width': 1.3 }),
    s('ellipse', { cx: 6, cy: 0, rx: 7, ry: 5.5, fill: warna, stroke: GARIS, 'stroke-width': 1.3 }),
    s('rect', { x: -1.2, y: -5, width: 2.4, height: 10, rx: 1.2, fill: GARIS })));
}

export function kelapa(x, y, skala = 1, balik = false) {
  return s('g', { transform: `translate(${x} ${y}) scale(${balik ? -skala : skala} ${skala})` },
    s('path', { d: 'M0 0 C4 -30 2 -60 14 -88', stroke: GARIS, 'stroke-width': 10, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: 'M0 0 C4 -30 2 -60 14 -88', stroke: '#b07a43', 'stroke-width': 7, fill: 'none', 'stroke-linecap': 'round' }),
    ...[[-40, '#2fa35a'], [-10, '#3dbb67'], [25, '#2fa35a'], [60, '#3dbb67'], [100, '#2fa35a']].map(([r, w]) =>
      s('path', { d: 'M14 -88 C0 -104 -30 -104 -44 -86 C-26 -94 -6 -92 14 -88 Z', fill: w, stroke: GARIS, 'stroke-width': 1.8, transform: `rotate(${r} 14 -88)` })),
    s('circle', { cx: 12, cy: -84, r: 4.5, fill: '#7a4e24', stroke: GARIS, 'stroke-width': 1.3 }),
    s('circle', { cx: 19, cy: -83, r: 4.5, fill: '#7a4e24', stroke: GARIS, 'stroke-width': 1.3 }));
}

// ------------------------------------------------------------------ adegan
/**
 * Adegan kartun lebar (hero): langit, bukit, daun tropis, Ulfa & Lino.
 * pose: 'jalan' | 'hore' | 'tunjuk' | 'diam'
 */
export function adegan({ pose = 'jalan', judul = 'Ulfa dan Lino', peti = false, tinggi = 200 } = {}) {
  const u = `a${nomor++}`;
  const svg = s('svg', { viewBox: '0 0 360 220', class: 'adegan', role: 'img', 'aria-label': judul, style: `max-height:${tinggi}px` });
  svg.append(
    s('defs', {}, gradasi(`${u}l`, '#6fc8ff', '#c9ecff'), gradasi(`${u}r`, '#7ed36b', '#3fa65a'), gradasi(`${u}j`, '#f6dc9c', '#e6b964')),
    s('rect', { x: 0, y: 0, width: 360, height: 220, fill: `url(#${u}l)` }),
    matahari(300, 42, 20),
    awan(70, 40, 0.9), awan(190, 28, 0.7),
    s('path', { d: 'M0 140 C60 100 120 120 180 104 C240 90 300 118 360 100 L360 220 L0 220 Z', fill: '#a8e08f', stroke: '#5aa64a', 'stroke-width': 2 }),
    s('path', { d: 'M0 172 C80 146 150 166 230 150 C290 140 330 152 360 146 L360 220 L0 220 Z', fill: `url(#${u}r)` }),
    s('path', { d: 'M120 220 C140 196 210 192 260 176 C290 168 320 168 360 172 L360 186 C320 184 296 186 268 194 C220 208 170 210 156 220 Z', fill: `url(#${u}j)`, stroke: '#b98a3a', 'stroke-width': 1.5 }),
    kelapa(30, 196, 0.9), kelapa(338, 200, 0.75, true),
    bunga(84, 196, '#ff6f59'), bunga(100, 204, '#ffc93c'), bunga(250, 210, '#c084fc'), bunga(300, 200, '#ff8fc7'),
    kupu(250, 80, '#ffc93c'), kupu(116, 96, '#ff8fc7'),
  );
  if (peti) svg.append(s('g', { transform: 'translate(250 148) scale(1.1)' }, gambarPeti(peti === 'buka')));
  const ulfa = gambarUlfa(pose);
  ulfa.setAttribute('transform', `translate(${peti ? 120 : 140} 42) scale(1.02)`);
  const lino = gambarLino(pose === 'hore' ? 'hore' : 'duduk');
  lino.setAttribute('transform', `translate(${peti ? 210 : 230} 112) scale(1)`);
  svg.append(s('g', { class: 'tokoh-adegan lompat' }, ulfa, lino));
  svg.append(daunTropis(-6, 230, 0.9, 30, '#2fa35a'), daunTropis(18, 230, 0.7, 60, '#3dbb67'), daunTropis(368, 232, 0.85, -35, '#2fa35a'));
  return svg;
}

/** Peti harta kartun. terbuka: tutup terangkat & koin terlihat. Lebar ±80. */
export function gambarPeti(terbuka = false) {
  const tutup = s('g', { class: 'tutup-peti', style: 'transform-origin: 40px 22px' },
    s('path', { d: 'M4 22 C4 4 76 4 76 22 Z', fill: '#a8642c', stroke: GARIS, 'stroke-width': 1.8 }),
    s('rect', { x: 34, y: 4, width: 12, height: 18, fill: '#ffc93c', stroke: GARIS, 'stroke-width': 2 }));
  if (terbuka) tutup.style.transform = 'rotate(-28deg) translate(-6px, -14px)';
  const koin = s('g', { class: 'koin-peti', opacity: terbuka ? 1 : 0 },
    ...[[22, 18], [34, 12], [46, 16], [58, 20], [40, 22]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 7, fill: '#ffd34d', stroke: '#c48a0a', 'stroke-width': 2 })),
    s('path', { d: 'M14 4 l3 -7 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 Z', fill: '#fff6b0' }),
    s('path', { d: 'M64 0 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z', fill: '#fff6b0' }));
  return s('g', { class: 'peti' },
    koin,
    s('rect', { x: 4, y: 22, width: 72, height: 40, rx: 4, fill: '#8f5424', stroke: GARIS, 'stroke-width': 1.8 }),
    s('rect', { x: 4, y: 30, width: 72, height: 6, fill: '#ffc93c', stroke: GARIS, 'stroke-width': 1.5 }),
    s('rect', { x: 34, y: 26, width: 12, height: 16, rx: 2, fill: '#ffc93c', stroke: GARIS, 'stroke-width': 2 }),
    tutup);
}
