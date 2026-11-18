// Ilustrasi kartun 2D ORISINAL ULFALINE: Ulfa (siswi SMP) & Lino berbadan penuh, adegan, peti harta.
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
 * Ulfa, siswi SMP berseragam (kemeja putih, rok biru tua), rambut kuncir berpita, ransel & sepatu kets.
 * Koordinat lokal: lebar ±100, kaki di y = 168. pose: 'jalan' | 'hore' | 'tunjuk' | 'diam'
 */
export function gambarUlfa(pose = 'diam', u = `u${nomor++}`) {
  const G = '#3b2a20';
  const KULIT = '#ffd9bd';
  const RAMBUT = `url(#${u}r)`;
  const g = s('g', {});
  g.append(s('defs', {},
    gradasi(`${u}r`, '#9a5a2e', '#6e3b1c'),
    gradasi(`${u}k`, '#ff8fb1', '#f2668f'),
    gradasi(`${u}rk`, '#2f4a8c', '#22366a')));

  // posisi kaki & lengan per pose
  const kaki = {
    jalan: [[40, 126, 34, 152], [60, 126, 66, 150]],
    hore: [[42, 126, 38, 152], [58, 126, 62, 152]],
    tunjuk: [[42, 126, 40, 154], [58, 126, 62, 154]],
    diam: [[42, 126, 41, 154], [58, 126, 59, 154]],
  }[pose] || [[42, 126, 41, 154], [58, 126, 59, 154]];
  const lengan = {
    jalan: [[30, 84, 22, 108], [70, 84, 80, 104]],
    hore: [[30, 82, 16, 56], [70, 82, 84, 56]],
    tunjuk: [[30, 84, 32, 104], [70, 82, 98, 74]],
    diam: [[31, 84, 38, 100], [69, 84, 62, 100]],
  }[pose] || [[31, 84, 38, 100], [69, 84, 62, 100]];
  const garisTebal = (x1, y1, x2, y2, w, warna) => [
    s('line', { x1, y1, x2, y2, stroke: G, 'stroke-width': w + 3.5, 'stroke-linecap': 'round' }),
    s('line', { x1, y1, x2, y2, stroke: warna, 'stroke-width': w, 'stroke-linecap': 'round' }),
  ];

  g.append(
    s('ellipse', { cx: 50, cy: 166, rx: 26, ry: 4.5, fill: 'rgba(80,50,20,.18)' }),
    // ransel (di belakang badan)
    s('rect', { x: 20, y: 80, width: 60, height: 44, rx: 14, fill: `url(#${u}k)`, stroke: G, 'stroke-width': 2.2 }),
    // kaki, kaus kaki putih, sepatu kets merah muda
    ...kaki.flatMap(([x1, y1, x2, y2]) => [
      ...garisTebal(x1, y1, x2, y2, 8, KULIT),
      ...garisTebal(x2 + (x1 - x2) * 0.35, y2 - 10, x2, y2, 8.5, '#ffffff'),
      s('path', { d: `M${x2 - 8} ${y2 + 2} Q${x2 - 8} ${y2 - 6} ${x2} ${y2 - 5} Q${x2 + 10} ${y2 - 4} ${x2 + 11} ${y2 + 3} Z`, fill: '#ff7aa2', stroke: G, 'stroke-width': 2 }),
      s('path', { d: `M${x2 - 9} ${y2 + 2.5} L${x2 + 12} ${y2 + 2.5} L${x2 + 11} ${y2 + 6} L${x2 - 8} ${y2 + 6} Z`, fill: '#fff', stroke: G, 'stroke-width': 1.6 }),
      s('path', { d: `M${x2 - 3} ${y2 - 3} l5 0 M${x2 - 2} ${y2 - 0.5} l5 0`, stroke: '#fff', 'stroke-width': 1.4 }),
    ]),
    // rok lipit biru tua
    s('path', { d: 'M30 100 L70 100 L78 130 Q50 136 22 130 Z', fill: `url(#${u}rk)`, stroke: G, 'stroke-width': 2.2 }),
    ...[38, 46, 54, 62].map((x) => s('path', { d: `M${x} 102 L${x + (x - 50) * 0.35} 131`, stroke: '#16244a', 'stroke-width': 1.4 })),
    // kemeja putih berkerah
    s('path', { d: 'M32 78 Q50 72 68 78 L70 102 Q50 106 30 102 Z', fill: '#ffffff', stroke: G, 'stroke-width': 2.2 }),
    s('path', { d: 'M28 80 Q22 84 23 92 L31 92 Z', fill: '#ffffff', stroke: G, 'stroke-width': 2 }),
    s('path', { d: 'M72 80 Q78 84 77 92 L69 92 Z', fill: '#ffffff', stroke: G, 'stroke-width': 2 }),
    s('path', { d: 'M42 74 L50 84 L58 74 L56 72 L50 78 L44 72 Z', fill: '#ffffff', stroke: G, 'stroke-width': 1.8 }),
    s('circle', { cx: 50, cy: 89, r: 1.4, fill: G }),
    s('circle', { cx: 50, cy: 95, r: 1.4, fill: G }),
    // tali ransel
    s('path', { d: 'M36 77 Q34 90 37 100', stroke: '#f2668f', 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: 'M64 77 Q66 90 63 100', stroke: '#f2668f', 'stroke-width': 4.5, fill: 'none', 'stroke-linecap': 'round' }),
    // lengan & tangan
    ...lengan.flatMap(([x1, y1, x2, y2]) => [...garisTebal(x1, y1, x2, y2, 7.5, KULIT),
      s('circle', { cx: x2, cy: y2, r: 5.2, fill: KULIT, stroke: G, 'stroke-width': 2 })]),
    // kuncir rambut & pita
    s('path', { d: 'M28 34 C10 40 8 70 20 84 C16 66 22 52 32 44 Z', fill: RAMBUT, stroke: G, 'stroke-width': 2 }),
    s('path', { d: 'M22 30 l-12 -8 l2 14 Z M26 30 l10 -10 l2 13 Z', fill: '#ff6f9c', stroke: G, 'stroke-width': 1.8 }),
    s('circle', { cx: 24, cy: 30, r: 3.6, fill: '#ff6f9c', stroke: G, 'stroke-width': 1.6 }),
    // kepala
    s('ellipse', { cx: 50, cy: 48, rx: 24, ry: 25, fill: RAMBUT, stroke: G, 'stroke-width': 2.2 }),
    s('ellipse', { cx: 51, cy: 54, rx: 20, ry: 19.5, fill: KULIT, stroke: G, 'stroke-width': 2 }),
    s('ellipse', { cx: 72, cy: 55, rx: 4, ry: 5, fill: KULIT, stroke: G, 'stroke-width': 1.8 }),
    // poni menyamping
    s('path', { d: 'M27 46 C30 26 66 22 75 44 C66 36 56 36 50 42 C46 34 36 36 31 48 Z', fill: RAMBUT, stroke: G, 'stroke-width': 2 }),
    // wajah
    s('ellipse', { cx: 43, cy: 54, rx: 3.6, ry: 4.6, fill: '#2a1a12' }),
    s('ellipse', { cx: 59, cy: 54, rx: 3.6, ry: 4.6, fill: '#2a1a12' }),
    s('circle', { cx: 44.3, cy: 52.4, r: 1.4, fill: '#fff' }),
    s('circle', { cx: 60.3, cy: 52.4, r: 1.4, fill: '#fff' }),
    s('path', { d: 'M39 47 Q43 45 47 46.5 M55 46.5 Q59 45 63 47', stroke: G, 'stroke-width': 1.6, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: 'M51 58 q1.5 1.5 0 2.6', stroke: '#c98a6a', 'stroke-width': 1.3, fill: 'none' }),
    s('ellipse', { cx: 38, cy: 61, rx: 3.8, ry: 2.6, fill: '#ff9e9e', opacity: 0.7 }),
    s('ellipse', { cx: 64, cy: 61, rx: 3.8, ry: 2.6, fill: '#ff9e9e', opacity: 0.7 }),
    pose === 'hore'
      ? s('path', { d: 'M44 63 Q51 73 58 63 Z', fill: '#c2414e', stroke: G, 'stroke-width': 1.6 })
      : s('path', { d: 'M45 63.5 Q51 70 57 63.5 Q51 66 45 63.5 Z', fill: '#c2414e', stroke: G, 'stroke-width': 1.5 }),
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
