// Ulfa & Lino: karakter ORISINAL ULFALINE dengan ekspresi.
// ekspresi: 'senyum' | 'hore' | 'tanya' | 'semangat'
// Animasi lompat hanya sekali saat muncul (dimatikan oleh "Kurangi gerakan").

import { s } from '../ui.js';

const GARIS = '#3b2a20';

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
  const RAMBUT = '#87491f';
  const KULIT = '#ffd9bd';
  const tangan = {
    hore: [s('circle', { cx: 16, cy: 66, r: 8, fill: KULIT, stroke: GARIS, 'stroke-width': 2 }),
      s('circle', { cx: 104, cy: 66, r: 8, fill: KULIT, stroke: GARIS, 'stroke-width': 2 })],
    tanya: [s('circle', { cx: 76, cy: 98, r: 7.5, fill: KULIT, stroke: GARIS, 'stroke-width': 2 })],
    semangat: [s('circle', { cx: 102, cy: 84, r: 9, fill: KULIT, stroke: GARIS, 'stroke-width': 2 }),
      s('rect', { x: 98, y: 66, width: 8, height: 14, rx: 4, fill: KULIT, stroke: GARIS, 'stroke-width': 2 })],
  }[ekspresi] || [];
  return [
    // bahu: kemeja putih berkerah & tali ransel
    s('path', { d: 'M22 128 C24 104 40 96 60 96 C80 96 96 104 98 128 Z', fill: '#ffffff', stroke: GARIS, 'stroke-width': 2.5 }),
    s('path', { d: 'M48 96 L60 110 L72 96 L68 94 L60 102 L52 94 Z', fill: '#fff', stroke: GARIS, 'stroke-width': 2 }),
    s('path', { d: 'M36 100 Q33 114 36 128 M84 100 Q87 114 84 128', stroke: '#f2668f', 'stroke-width': 6, fill: 'none' }),
    // kuncir & pita
    s('path', { d: 'M30 40 C8 48 6 84 22 100 C18 78 24 60 36 50 Z', fill: RAMBUT, stroke: GARIS, 'stroke-width': 2.2 }),
    s('path', { d: 'M24 34 l-15 -10 l3 18 Z M29 34 l13 -12 l2 16 Z', fill: '#ff6f9c', stroke: GARIS, 'stroke-width': 2 }),
    s('circle', { cx: 26.5, cy: 34, r: 4.5, fill: '#ff6f9c', stroke: GARIS, 'stroke-width': 1.8 }),
    // kepala
    s('ellipse', { cx: 60, cy: 56, rx: 30, ry: 31, fill: RAMBUT, stroke: GARIS, 'stroke-width': 2.5 }),
    s('ellipse', { cx: 61, cy: 63, rx: 25, ry: 24.5, fill: KULIT, stroke: GARIS, 'stroke-width': 2.2 }),
    s('ellipse', { cx: 87, cy: 64, rx: 5, ry: 6, fill: KULIT, stroke: GARIS, 'stroke-width': 2 }),
    s('path', { d: 'M31 54 C35 28 80 24 91 52 C80 42 68 42 60 50 C55 40 42 42 36 56 Z', fill: RAMBUT, stroke: GARIS, 'stroke-width': 2.2 }),
    ekspresi === 'tanya'
      ? s('path', { d: 'M64 52 Q70 47 76 51', stroke: GARIS, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' })
      : s('path', { d: 'M64 54 Q69 51 75 54', stroke: GARIS, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: 'M45 54 Q50 51 55 54', stroke: GARIS, 'stroke-width': 2.2, fill: 'none', 'stroke-linecap': 'round' }),
    mata(ekspresi, 51, 63, 4.4),
    mata(ekspresi, 70, 63, 4.4),
    s('ellipse', { cx: 44, cy: 72, rx: 5, ry: 3.2, fill: '#ff9e9e', opacity: 0.7 }),
    s('ellipse', { cx: 77, cy: 72, rx: 5, ry: 3.2, fill: '#ff9e9e', opacity: 0.7 }),
    mulut(ekspresi, 60.5, 76, 7.5),
    ...tangan,
    ekspresi === 'tanya' ? s('text', { x: 98, y: 30, 'font-size': 26, 'font-weight': 900, fill: '#7c4ddb', stroke: GARIS, 'stroke-width': 1 }, '?') : null,
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
