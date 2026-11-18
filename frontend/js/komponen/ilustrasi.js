// Ilustrasi kartun 2D ORISINAL ULFALINE: Ulfa & Lino berbadan penuh, adegan hutan tropis, peti harta.
// Gaya: garis tegas, warna cerah, gradasi lembut. Bukan karakter/elemen dari karya pihak lain.

import { s } from '../ui.js';

const GARIS = '#3a2a1e';
let nomor = 0;

/** Definisi gradasi dengan id unik per gambar. */
function gradasi(id, atas, bawah, arah = 'v') {
  return s('linearGradient', { id, x1: 0, y1: 0, x2: arah === 'h' ? 1 : 0, y2: arah === 'h' ? 0 : 1 },
    s('stop', { offset: '0%', 'stop-color': atas }), s('stop', { offset: '100%', 'stop-color': bawah }));
}

// ------------------------------------------------------------------- Ulfa
/**
 * Ulfa berbadan penuh. Koordinat lokal: lebar ±100, kaki di y = 168.
 * pose: 'jalan' | 'hore' | 'tunjuk' | 'diam'
 */
export function gambarUlfa(pose = 'diam', u = `u${nomor++}`) {
  const kulit = `url(#${u}k)`;
  const hijab = `url(#${u}h)`;
  const rompi = `url(#${u}r)`;
  const g = s('g', {});
  g.append(s('defs', {},
    gradasi(`${u}k`, '#f3c49b', '#d9a074'),
    gradasi(`${u}h`, '#22c1b4', '#0f8a80'),
    gradasi(`${u}r`, '#f59a3c', '#d9741f'),
    gradasi(`${u}t`, '#e8b057', '#c4852b')));
  const lengan = {
    jalan: [['M30 82 Q20 104 24 120', 'M70 82 Q82 98 86 112'], [[24, 122], [87, 114]]],
    hore: [['M30 80 Q16 60 18 38', 'M70 80 Q84 60 82 38'], [[18, 34], [82, 34]]],
    tunjuk: [['M30 82 Q22 104 26 120', 'M70 80 Q90 76 104 70'], [[26, 122], [107, 69]]],
    diam: [['M30 82 Q22 104 26 122', 'M70 82 Q78 104 74 122'], [[26, 124], [74, 124]]],
  }[pose] || [[], []];
  const kaki = pose === 'jalan'
    ? [['M42 126 L36 160', 'M58 126 L66 158']]
    : pose === 'hore' ? [['M42 126 L38 154', 'M58 126 L62 154']] : [['M42 126 L42 160', 'M58 126 L58 160']];
  g.append(
    s('ellipse', { cx: 50, cy: 166, rx: 28, ry: 5, fill: 'rgba(0,0,0,.18)' }),
    // kaki (celana khaki) & sepatu bot coklat
    ...kaki[0].map((d) => s('path', { d, stroke: GARIS, 'stroke-width': 18, 'stroke-linecap': 'round', fill: 'none' })),
    ...kaki[0].map((d) => s('path', { d, stroke: '#b98d4f', 'stroke-width': 13.5, 'stroke-linecap': 'round', fill: 'none' })),
    ...kaki[0].map((d) => {
      const akhir = d.split('L')[1].trim().split(' ').map(Number);
      return s('ellipse', { cx: akhir[0] + 2, cy: akhir[1] + 3, rx: 10, ry: 6, fill: '#6b3f1f', stroke: GARIS, 'stroke-width': 2 });
    }),
    // lengan belakang (lengan baju krem)
    ...lengan[0].map((d) => s('path', { d, stroke: GARIS, 'stroke-width': 13, 'stroke-linecap': 'round', fill: 'none' })),
    ...lengan[0].map((d) => s('path', { d, stroke: '#fff3da', 'stroke-width': 9.5, 'stroke-linecap': 'round', fill: 'none' })),
    ...lengan[1].map(([x, y]) => s('circle', { cx: x, cy: y, r: 6.5, fill: kulit, stroke: GARIS, 'stroke-width': 2 })),
    // badan: baju krem + rompi penjelajah oranye
    s('path', { d: 'M28 80 Q50 70 72 80 L76 128 Q50 136 24 128 Z', fill: '#fff3da', stroke: GARIS, 'stroke-width': 2.5 }),
    s('path', { d: 'M28 82 Q38 76 44 78 L42 130 Q32 129 25 127 Z', fill: rompi, stroke: GARIS, 'stroke-width': 2 }),
    s('path', { d: 'M72 82 Q62 76 56 78 L58 130 Q68 129 75 127 Z', fill: rompi, stroke: GARIS, 'stroke-width': 2 }),
    s('rect', { x: 29, y: 100, width: 11, height: 9, rx: 2, fill: '#d9741f', stroke: GARIS, 'stroke-width': 1.5 }),
    s('rect', { x: 60, y: 100, width: 11, height: 9, rx: 2, fill: '#d9741f', stroke: GARIS, 'stroke-width': 1.5 }),
    s('path', { d: 'M25 121 Q50 128 75 121 L75 127 Q50 134 25 127 Z', fill: '#6b3f1f' }),
    // hijab menjuntai ke dada
    s('path', { d: 'M24 52 C24 22 40 10 50 10 C60 10 76 22 76 52 C78 72 70 90 50 94 C30 90 22 72 24 52 Z', fill: hijab, stroke: GARIS, 'stroke-width': 2.5 }),
    // wajah
    s('ellipse', { cx: 50, cy: 50, rx: 18, ry: 20, fill: kulit, stroke: GARIS, 'stroke-width': 2 }),
    s('ellipse', { cx: 43, cy: 49, rx: 4.3, ry: 5.4, fill: '#2b1b10' }),
    s('ellipse', { cx: 57, cy: 49, rx: 4.3, ry: 5.4, fill: '#2b1b10' }),
    s('circle', { cx: 44.6, cy: 47, r: 1.7, fill: '#fff' }),
    s('circle', { cx: 58.6, cy: 47, r: 1.7, fill: '#fff' }),
    s('path', { d: 'M38.5 43 Q43 40 47 42.5 M53 42.5 Q57 40 61.5 43', stroke: GARIS, 'stroke-width': 1.8, fill: 'none', 'stroke-linecap': 'round' }),
    s('circle', { cx: 38, cy: 57, r: 3.6, fill: '#ff8a7a', opacity: 0.6 }),
    s('circle', { cx: 62, cy: 57, r: 3.6, fill: '#ff8a7a', opacity: 0.6 }),
    pose === 'hore'
      ? s('path', { d: 'M43 58 Q50 69 57 58 Z', fill: '#8a2f22', stroke: GARIS, 'stroke-width': 1.6 })
      : s('path', { d: 'M44 59 Q50 64.5 56 59', stroke: '#8a2f22', 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' }),
    // topi penjelajah
    s('ellipse', { cx: 50, cy: 24, rx: 33, ry: 7, fill: `url(#${u}t)`, stroke: GARIS, 'stroke-width': 2.5 }),
    s('path', { d: 'M32 24 C32 6 68 6 68 24 Z', fill: `url(#${u}t)`, stroke: GARIS, 'stroke-width': 2.5 }),
    s('path', { d: 'M33 19 Q50 15 67 19 L67.5 23 Q50 19 32.5 23 Z', fill: '#ff6f59' }),
    // kompas di tali
    s('path', { d: 'M44 80 L50 100 L56 80', stroke: '#6b3f1f', 'stroke-width': 1.5, fill: 'none' }),
    s('circle', { cx: 50, cy: 103, r: 5, fill: '#ffd34d', stroke: GARIS, 'stroke-width': 1.8 }),
    s('path', { d: 'M50 99.5 L51.5 103 L50 106.5 L48.5 103 Z', fill: '#e5483b' }),
  );
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
    s('ellipse', { cx: 35, cy: 78, rx: 15, ry: 17, fill: bulu, stroke: GARIS, 'stroke-width': 2.2 }),
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
    s('circle', { cx: 35, cy: 40, r: 22, fill: bulu, stroke: GARIS, 'stroke-width': 2.2 }),
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
    s('path', { d: 'M4 22 C4 4 76 4 76 22 Z', fill: '#a8642c', stroke: GARIS, 'stroke-width': 2.5 }),
    s('rect', { x: 34, y: 4, width: 12, height: 18, fill: '#ffc93c', stroke: GARIS, 'stroke-width': 2 }));
  if (terbuka) tutup.style.transform = 'rotate(-28deg) translate(-6px, -14px)';
  const koin = s('g', { class: 'koin-peti', opacity: terbuka ? 1 : 0 },
    ...[[22, 18], [34, 12], [46, 16], [58, 20], [40, 22]].map(([x, y]) => s('circle', { cx: x, cy: y, r: 7, fill: '#ffd34d', stroke: '#c48a0a', 'stroke-width': 2 })),
    s('path', { d: 'M14 4 l3 -7 l3 7 l7 3 l-7 3 l-3 7 l-3 -7 l-7 -3 Z', fill: '#fff6b0' }),
    s('path', { d: 'M64 0 l2 -5 l2 5 l5 2 l-5 2 l-2 5 l-2 -5 l-5 -2 Z', fill: '#fff6b0' }));
  return s('g', { class: 'peti' },
    koin,
    s('rect', { x: 4, y: 22, width: 72, height: 40, rx: 4, fill: '#8f5424', stroke: GARIS, 'stroke-width': 2.5 }),
    s('rect', { x: 4, y: 30, width: 72, height: 6, fill: '#ffc93c', stroke: GARIS, 'stroke-width': 1.5 }),
    s('rect', { x: 34, y: 26, width: 12, height: 16, rx: 2, fill: '#ffc93c', stroke: GARIS, 'stroke-width': 2 }),
    tutup);
}
