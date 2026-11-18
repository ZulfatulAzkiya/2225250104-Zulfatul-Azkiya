// Ulfa & Lino: karakter ORISINAL ULFALINE dengan ekspresi.
// ekspresi: 'senyum' | 'hore' | 'tanya' | 'semangat'
// Animasi lompat hanya sekali saat muncul (dimatikan oleh "Kurangi gerakan").

import { s } from '../ui.js';

const KULIT = '#e8b48a';
const HIJAB = '#14a39a';
const TOPI = '#d9952e';
const GARIS = '#2b2d42';

function mulut(ekspresi, cx, cy, lebar) {
  if (ekspresi === 'hore') {
    return s('path', { d: `M${cx - lebar} ${cy} Q${cx} ${cy + lebar * 1.6} ${cx + lebar} ${cy} Z`, fill: '#7a2e1e', stroke: GARIS, 'stroke-width': 2 });
  }
  if (ekspresi === 'tanya') return s('ellipse', { cx, cy: cy + 2, rx: lebar * 0.35, ry: lebar * 0.45, fill: '#7a2e1e' });
  return s('path', { d: `M${cx - lebar} ${cy} Q${cx} ${cy + lebar * 1.1} ${cx + lebar} ${cy}`, stroke: '#7a2e1e', 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' });
}

function mata(ekspresi, x, y, r, warnaIris = '#2b1b10') {
  if (ekspresi === 'hore') {
    return s('path', { d: `M${x - r} ${y + 1} Q${x} ${y - r * 1.4} ${x + r} ${y + 1}`, stroke: GARIS, 'stroke-width': 3, fill: 'none', 'stroke-linecap': 'round' });
  }
  return s('g', {},
    s('ellipse', { cx: x, cy: y, rx: r, ry: r * 1.2, fill: warnaIris }),
    s('circle', { cx: x + r * 0.35, cy: y - r * 0.4, r: r * 0.38, fill: '#fff' }),
    ekspresi === 'semangat' ? s('circle', { cx: x - r * 0.4, cy: y + r * 0.4, r: r * 0.18, fill: '#fff' }) : null);
}

function ulfa(ekspresi) {
  const tangan = {
    hore: [s('ellipse', { cx: 18, cy: 58, rx: 9, ry: 9, fill: KULIT, stroke: GARIS, 'stroke-width': 2 }),
      s('ellipse', { cx: 102, cy: 58, rx: 9, ry: 9, fill: KULIT, stroke: GARIS, 'stroke-width': 2 })],
    tanya: [s('ellipse', { cx: 74, cy: 92, rx: 9, ry: 8, fill: KULIT, stroke: GARIS, 'stroke-width': 2 })],
    semangat: [s('circle', { cx: 100, cy: 80, r: 10, fill: KULIT, stroke: GARIS, 'stroke-width': 2 }),
      s('rect', { x: 96, y: 62, width: 8, height: 14, rx: 4, fill: KULIT, stroke: GARIS, 'stroke-width': 2 })],
  }[ekspresi] || [];
  return [
    s('path', { d: 'M20 124 C24 96 42 88 60 88 C78 88 96 96 100 124 Z', fill: TOPI, stroke: GARIS, 'stroke-width': 2.5 }),
    s('path', { d: 'M48 90 L60 108 L72 90 Z', fill: HIJAB, stroke: GARIS, 'stroke-width': 2 }),
    s('path', { d: 'M28 66 C28 36 43 22 60 22 C77 22 92 36 92 66 C92 84 80 96 60 98 C40 96 28 84 28 66 Z', fill: HIJAB, stroke: GARIS, 'stroke-width': 2.5 }),
    s('ellipse', { cx: 60, cy: 64, rx: 21, ry: 24, fill: KULIT, stroke: GARIS, 'stroke-width': 2 }),
    s('ellipse', { cx: 60, cy: 32, rx: 40, ry: 8, fill: '#b5741f', stroke: GARIS, 'stroke-width': 2.5 }),
    s('path', { d: 'M38 32 C38 14 82 14 82 32 Z', fill: TOPI, stroke: GARIS, 'stroke-width': 2.5 }),
    s('rect', { x: 39, y: 26, width: 42, height: 5, fill: '#ff6f59' }),
    ekspresi === 'tanya'
      ? s('path', { d: 'M64 51 Q70 46 76 50', stroke: GARIS, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' })
      : s('path', { d: 'M64 53 Q69 50 75 53', stroke: GARIS, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: 'M45 53 Q51 50 56 53', stroke: GARIS, 'stroke-width': 2.5, fill: 'none', 'stroke-linecap': 'round' }),
    mata(ekspresi, 51, 62, 4.2),
    mata(ekspresi, 69, 62, 4.2),
    s('circle', { cx: 45, cy: 72, r: 4.5, fill: '#ff8a7a', opacity: 0.7 }),
    s('circle', { cx: 75, cy: 72, r: 4.5, fill: '#ff8a7a', opacity: 0.7 }),
    mulut(ekspresi, 60, 76, 8),
    ...tangan,
    ekspresi === 'tanya' ? s('text', { x: 98, y: 30, 'font-size': 26, 'font-weight': 900, fill: '#8b5cf6', stroke: GARIS, 'stroke-width': 1 }, '?') : null,
  ];
}

function lino(ekspresi) {
  return [
    s('ellipse', { cx: 26, cy: 42, rx: 15, ry: 19, fill: '#9a6f45', stroke: GARIS, 'stroke-width': 2.5, transform: `rotate(${ekspresi === 'hore' ? -40 : -25} 26 42)` }),
    s('ellipse', { cx: 26, cy: 42, rx: 8, ry: 12, fill: '#f2b9a2', transform: `rotate(${ekspresi === 'hore' ? -40 : -25} 26 42)` }),
    s('ellipse', { cx: 94, cy: 42, rx: 15, ry: 19, fill: '#9a6f45', stroke: GARIS, 'stroke-width': 2.5, transform: `rotate(${ekspresi === 'hore' ? 40 : 25} 94 42)` }),
    s('ellipse', { cx: 94, cy: 42, rx: 8, ry: 12, fill: '#f2b9a2', transform: `rotate(${ekspresi === 'hore' ? 40 : 25} 94 42)` }),
    s('ellipse', { cx: 60, cy: 108, rx: 26, ry: 17, fill: '#a87c50', stroke: GARIS, 'stroke-width': 2.5 }),
    s('circle', { cx: 60, cy: 66, r: 34, fill: '#a87c50', stroke: GARIS, 'stroke-width': 2.5 }),
    s('ellipse', { cx: 60, cy: 74, rx: 24, ry: 21, fill: '#d4b085' }),
    s('circle', { cx: 45, cy: 62, r: 15, fill: '#fff6d8', stroke: GARIS, 'stroke-width': 2 }),
    s('circle', { cx: 75, cy: 62, r: 15, fill: '#fff6d8', stroke: GARIS, 'stroke-width': 2 }),
    ekspresi === 'hore' ? mata('hore', 45, 63, 9) : mata(ekspresi, 45, 62, 9, '#d99a1e'),
    ekspresi === 'hore' ? mata('hore', 75, 63, 9) : mata(ekspresi, 75, 62, 9, '#d99a1e'),
    ekspresi === 'hore' ? null : s('circle', { cx: 45, cy: 63, r: 5, fill: '#1d130b' }),
    ekspresi === 'hore' ? null : s('circle', { cx: 75, cy: 63, r: 5, fill: '#1d130b' }),
    ekspresi === 'hore' ? null : s('circle', { cx: 47, cy: 59, r: 2.2, fill: '#fff' }),
    ekspresi === 'hore' ? null : s('circle', { cx: 77, cy: 59, r: 2.2, fill: '#fff' }),
    s('ellipse', { cx: 60, cy: 80, rx: 3.2, ry: 2.2, fill: '#4a2e1a' }),
    mulut(ekspresi, 60, 86, 6),
    s('path', { d: 'M36 98 Q60 108 84 98 L82 105 Q60 114 38 105 Z', fill: '#ff6f59', stroke: GARIS, 'stroke-width': 2 }),
    ekspresi === 'semangat' ? s('text', { x: 92, y: 30, 'font-size': 22 }, '✨') : null,
    ekspresi === 'tanya' ? s('text', { x: 96, y: 30, 'font-size': 26, 'font-weight': 900, fill: '#8b5cf6', stroke: GARIS, 'stroke-width': 1 }, '?') : null,
  ];
}

/** Elemen SVG karakter. ukuran dalam px. */
export function tokoh(siapa, ekspresi = 'senyum', ukuran = 64, { lompat = true } = {}) {
  const el = s('svg', {
    viewBox: '0 0 120 128', width: ukuran, height: ukuran * (128 / 120),
    class: `tokoh${lompat ? ' lompat' : ''}`, role: 'img',
    'aria-label': `${siapa === 'ulfa' ? 'Ulfa' : 'Lino'} ${{ senyum: 'tersenyum', hore: 'bersorak', tanya: 'bertanya', semangat: 'menyemangati' }[ekspresi] || ''}`,
  }, siapa === 'ulfa' ? ulfa(ekspresi) : lino(ekspresi));
  return el;
}

const HORE = ['Hore! Tepat sekali!', 'Hebat! Kamu pintar!', 'Yes! Jalannya terbuka!', 'Mantap! Lanjut, Penjelajah!'];
const SEMANGAT = ['Tidak apa-apa, ayo coba lagi!', 'Hampir! Baca petunjuknya pelan-pelan.', 'Semangat! Kita pasti bisa!'];

export const kataHore = () => HORE[Math.floor(Math.random() * HORE.length)];
export const kataSemangat = () => SEMANGAT[Math.floor(Math.random() * SEMANGAT.length)];
