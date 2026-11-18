// Peta petualangan bergambar (kartun 2D, SVG) "Pulau Aljabar".
// Ulfa (dengan Lino di bahu) berjalan di sepanjang jalan setapak menuju tiap pos.
// Semua gambar dibuat di kode ini: ORISINAL ULFALINE.

import { s } from '../ui.js';
import { gerakDikurangi } from '../simpan.js';
import { efek } from './suara.js';
import { gambarUlfa, gambarLino, gambarPeti, kelapa, bunga, kupu, awan, matahari } from '../komponen/ilustrasi.js';

const GARIS = '#3a2a1e';
const W = 400;
const H = 780;

// Titik jalan: 0 = awal, 1..7 = pos, 8 = Pulau Harta.
const TITIK = [[80, 740], [205, 682], [318, 598], [140, 532], [292, 446], [108, 362], [276, 284], [150, 206], [300, 92]];
export const TITIK_POS = [1, 2, 3, 4, 5, 6, 7];
export const TITIK_HARTA = 8;

/** Kurva halus (Catmull-Rom → Bézier) melewati semua titik. */
function jalurHalus(titik) {
  let d = `M${titik[0][0]} ${titik[0][1]}`;
  for (let i = 0; i < titik.length - 1; i++) {
    const p0 = titik[i - 1] || titik[i];
    const p1 = titik[i];
    const p2 = titik[i + 1];
    const p3 = titik[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0]} ${c1[1]} ${c2[0]} ${c2[1]} ${p2[0]} ${p2[1]}`;
  }
  return d;
}

// ------------------------------------------------------------- bangunan pos
const BANGUNAN = {
  gerbang: () => s('g', {},
    s('rect', { x: -34, y: -54, width: 16, height: 54, rx: 3, fill: '#a9a29a', stroke: GARIS, 'stroke-width': 2.5 }),
    s('rect', { x: 18, y: -54, width: 16, height: 54, rx: 3, fill: '#a9a29a', stroke: GARIS, 'stroke-width': 2.5 }),
    s('path', { d: 'M-44 -54 L44 -54 L38 -70 L-38 -70 Z', fill: '#8e877e', stroke: GARIS, 'stroke-width': 2.5 }),
    s('circle', { cx: 0, cy: -62, r: 6, fill: '#ffc93c', stroke: GARIS, 'stroke-width': 2 }),
    s('path', { d: 'M-30 -40 q4 -6 8 0 M24 -30 q4 -6 8 0', stroke: '#5aa64a', 'stroke-width': 3, fill: 'none' })),
  jembatan: () => s('g', {},
    s('path', { d: 'M-50 -14 Q0 -36 50 -14 L50 -4 Q0 -26 -50 -4 Z', fill: '#c88a4a', stroke: GARIS, 'stroke-width': 2.5 }),
    ...[-36, -18, 0, 18, 36].map((x) => s('line', { x1: x, y1: -22 - (36 - Math.abs(x)) / 3, x2: x, y2: -8 - (36 - Math.abs(x)) / 3, stroke: GARIS, 'stroke-width': 1.5 })),
    s('path', { d: 'M-50 -30 Q0 -54 50 -30', stroke: '#8a5a2b', 'stroke-width': 3, fill: 'none' }),
    s('rect', { x: -54, y: -40, width: 7, height: 36, fill: '#8a5a2b', stroke: GARIS, 'stroke-width': 1.5 }),
    s('rect', { x: 47, y: -40, width: 7, height: 36, fill: '#8a5a2b', stroke: GARIS, 'stroke-width': 1.5 }),
    // timbangan di tiang
    s('line', { x1: -18, y1: -66, x2: 18, y2: -66, stroke: '#c48a0a', 'stroke-width': 3 }),
    s('line', { x1: 0, y1: -66, x2: 0, y2: -44, stroke: '#8a5a2b', 'stroke-width': 3 }),
    s('path', { d: 'M-26 -58 Q-18 -50 -10 -58 Z M10 -58 Q18 -50 26 -58 Z', fill: '#ffc93c', stroke: GARIS, 'stroke-width': 1.5 })),
  sungai: () => s('g', {},
    s('ellipse', { cx: 0, cy: -10, rx: 56, ry: 24, fill: '#4fb3f0', stroke: '#2a7fbf', 'stroke-width': 2.5 }),
    s('path', { d: 'M-30 -14 q6 -4 12 0 M14 -2 q6 -4 12 0', stroke: '#c9ecff', 'stroke-width': 2, fill: 'none' }),
    ...[[-34, -6], [-12, -16], [10, -6], [32, -16]].map(([x, y]) => s('ellipse', { cx: x, cy: y, rx: 10, ry: 6, fill: '#b9b4ad', stroke: GARIS, 'stroke-width': 2 }))),
  gua: () => s('g', {},
    s('path', { d: 'M-60 0 C-56 -50 -30 -84 0 -86 C30 -84 56 -50 60 0 Z', fill: '#8b8496', stroke: GARIS, 'stroke-width': 2.5 }),
    s('path', { d: 'M-30 -50 l12 -10 M18 -64 l14 8', stroke: '#6d6678', 'stroke-width': 3 }),
    s('path', { d: 'M-22 0 C-22 -40 22 -40 22 0 Z', fill: '#2b2235', stroke: GARIS, 'stroke-width': 2.5 }),
    s('rect', { x: 30, y: -40, width: 14, height: 22, rx: 3, fill: '#d9f1ff', stroke: GARIS, 'stroke-width': 2 }),
    s('path', { d: 'M33 -36 l6 8', stroke: '#fff', 'stroke-width': 2 })),
  pasar: () => s('g', {},
    s('rect', { x: -40, y: -30, width: 64, height: 30, rx: 3, fill: '#c88a4a', stroke: GARIS, 'stroke-width': 2.5 }),
    s('rect', { x: -38, y: -66, width: 5, height: 36, fill: '#8a5a2b' }),
    s('rect', { x: 17, y: -66, width: 5, height: 36, fill: '#8a5a2b' }),
    s('path', { d: 'M-48 -62 L32 -62 L24 -80 L-40 -80 Z', fill: '#ff6f59', stroke: GARIS, 'stroke-width': 2.5 }),
    ...[-32, -16, 0, 16].map((x) => s('rect', { x, y: -80, width: 8, height: 18, fill: '#fff', opacity: 0.85 })),
    ...[-30, -18, -6, 6].map((x) => s('path', { d: `M${x} -34 q4 -10 8 0`, stroke: GARIS, 'stroke-width': 1.5, fill: '#ffd34d' })),
    // perahu
    s('path', { d: 'M24 6 L68 6 L60 18 L32 18 Z', fill: '#a8642c', stroke: GARIS, 'stroke-width': 2 })),
  bukit: () => s('g', {},
    s('path', { d: 'M-64 0 C-40 -70 40 -70 64 0 Z', fill: '#5cbf4f', stroke: GARIS, 'stroke-width': 2.5 }),
    s('path', { d: 'M-20 -46 C-6 -54 8 -54 20 -46', stroke: '#89d97a', 'stroke-width': 4, fill: 'none' }),
    s('rect', { x: 30, y: -54, width: 5, height: 50, fill: '#8a5a2b', stroke: GARIS, 'stroke-width': 1 }),
    s('path', { d: 'M35 -52 L60 -52 L66 -46 L60 -40 L35 -40 Z', fill: '#fff3da', stroke: GARIS, 'stroke-width': 1.5 }),
    s('path', { d: 'M30 -36 L6 -36 L0 -30 L6 -24 L30 -24 Z', fill: '#fff3da', stroke: GARIS, 'stroke-width': 1.5 }),
    s('text', { x: 46, y: -43, 'font-size': 9, 'font-weight': 900, 'text-anchor': 'middle', fill: GARIS }, 'A'),
    s('text', { x: 16, y: -27, 'font-size': 9, 'font-weight': 900, 'text-anchor': 'middle', fill: GARIS }, 'B')),
  dermaga: () => s('g', {},
    s('rect', { x: -10, y: -56, width: 20, height: 56, fill: '#c88a4a', stroke: GARIS, 'stroke-width': 2.5 }),
    ...[-48, -32, -16].map((y) => s('line', { x1: -10, y1: y, x2: 10, y2: y, stroke: GARIS, 'stroke-width': 1.5 })),
    s('g', { transform: 'translate(34 -40)' },
      ...[-18, -9, 0, 9, 18].map((x) => s('rect', { x: x - 4, y: -10, width: 8, height: 26, rx: 4, fill: '#d9a35f', stroke: GARIS, 'stroke-width': 1.5 })),
      s('line', { x1: 0, y1: -10, x2: 0, y2: -34, stroke: '#8a5a2b', 'stroke-width': 3 }),
      s('path', { d: 'M2 -34 L22 -24 L2 -16 Z', fill: '#fff', stroke: GARIS, 'stroke-width': 1.5 }))),
};

/**
 * Membuat peta bergambar di dalam `wadah`.
 * @returns {{pindahKe(titik, selesai?): void, hapus(): void}}
 */
export function buatPeta2D(wadah, { daftarPos, posAktif, selesai, diTitik, onPilihPos }) {
  const kurangGerak = gerakDikurangi();
  const svg = s('svg', { viewBox: `0 0 ${W} ${H}`, class: 'peta2d', role: 'img', 'aria-label': 'Peta Pulau Aljabar dengan tujuh pos dan Pulau Harta' });
  svg.append(s('defs', {},
    s('linearGradient', { id: 'pl-laut', x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: '0%', 'stop-color': '#9fd8ef' }), s('stop', { offset: '100%', 'stop-color': '#5cb0dc' })),
    s('linearGradient', { id: 'pl-darat', x1: 0, y1: 0, x2: 0, y2: 1 }, s('stop', { offset: '0%', 'stop-color': '#b5dc7c' }), s('stop', { offset: '100%', 'stop-color': '#7fb84a' })),
    s('linearGradient', { id: 'pl-jalan', x1: 0, y1: 0, x2: 1, y2: 0 }, s('stop', { offset: '0%', 'stop-color': '#f7df9f' }), s('stop', { offset: '100%', 'stop-color': '#ecc778' }))));

  // laut, ombak, pulau
  svg.append(s('rect', { x: 0, y: 0, width: W, height: H, fill: 'url(#pl-laut)' }));
  for (let y = 30; y < H; y += 70) {
    svg.append(s('path', { d: `M${(y * 7) % 60} ${y} q10 -6 20 0 q10 6 20 0`, stroke: '#bfe9ff', 'stroke-width': 2, fill: 'none', opacity: 0.8 }));
  }
  svg.append(
    s('path', { d: 'M20 760 C-10 640 30 520 10 420 C-8 320 40 240 90 196 C150 150 250 160 330 190 C400 216 396 330 384 420 C372 520 410 620 380 700 C360 760 300 776 200 776 C120 776 40 780 20 760 Z', fill: '#f2d793', stroke: GARIS, 'stroke-width': 3 }),
    s('path', { d: 'M34 752 C8 640 46 524 26 424 C10 330 54 252 100 212 C156 170 248 178 320 206 C382 232 378 334 368 420 C356 516 392 616 366 692 C346 748 292 762 200 762 C124 762 52 766 34 752 Z', fill: 'url(#pl-darat)', stroke: '#3c8f39', 'stroke-width': 2 }),
    // Pulau Harta
    s('ellipse', { cx: 300, cy: 96, rx: 70, ry: 34, fill: '#f2d793', stroke: GARIS, 'stroke-width': 3 }),
    s('ellipse', { cx: 300, cy: 92, rx: 56, ry: 24, fill: '#7fd36b', stroke: '#3c8f39', 'stroke-width': 2 }),
    // sungai melintang di dekat jembatan & laguna pasar
    s('path', { d: 'M368 560 C340 580 330 600 300 606 C270 612 250 628 236 640', stroke: '#2a7fbf', 'stroke-width': 26, fill: 'none', 'stroke-linecap': 'round' }),
    s('path', { d: 'M368 560 C340 580 330 600 300 606 C270 612 250 628 236 640', stroke: '#4fb3f0', 'stroke-width': 20, fill: 'none', 'stroke-linecap': 'round' }),
    s('ellipse', { cx: 54, cy: 380, rx: 30, ry: 40, fill: '#4fb3f0', stroke: '#2a7fbf', 'stroke-width': 2.5 }),
  );

  // langit di atas: matahari & awan (dekorasi tepi)
  svg.append(matahari(54, 60, 22), awan(140, 40, 0.8), awan(220, 150, 0.6));

  // jalan setapak
  const d = jalurHalus(TITIK.slice(0, 8));
  svg.append(
    s('path', { d, stroke: GARIS, 'stroke-width': 26, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    s('path', { d, stroke: 'url(#pl-jalan)', 'stroke-width': 21, fill: 'none', 'stroke-linecap': 'round', 'stroke-linejoin': 'round' }),
    s('path', { d, stroke: '#fff3c4', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '2 14', 'stroke-linecap': 'round' }),
    // rute laut (rakit) ke Pulau Harta
    s('path', { d: `M${TITIK[7][0]} ${TITIK[7][1]} C190 150 250 130 ${TITIK[8][0]} ${TITIK[8][1] + 10}`, stroke: '#fff', 'stroke-width': 3, fill: 'none', 'stroke-dasharray': '8 8' }),
  );
  const jalurGerak = s('path', { d: `${jalurHalus(TITIK.slice(0, 8))} C190 150 250 130 ${TITIK[8][0]} ${TITIK[8][1]}`, fill: 'none', stroke: 'none' });
  svg.append(jalurGerak);

  // dekorasi: pohon kelapa, semak, bunga, kupu-kupu
  [[30, 600, 0.75], [362, 760, 0.7, true], [40, 300, 0.7], [370, 380, 0.7, true], [250, 112, 0.55], [350, 104, 0.5, true]]
    .forEach(([x, y, sk, b]) => svg.append(kelapa(x, y, sk, b)));
  [[60, 700], [170, 600], [230, 520], [40, 470], [200, 400], [330, 330], [80, 260], [230, 240]].forEach(([x, y], i) => {
    svg.append(s('ellipse', { cx: x, cy: y, rx: 18, ry: 10, fill: '#3fa65a', stroke: GARIS, 'stroke-width': 1.5 }));
    svg.append(bunga(x - 8, y - 6, ['#ff6f59', '#ffc93c', '#c084fc', '#ff8fc7'][i % 4], 4));
    svg.append(bunga(x + 8, y - 4, ['#ffc93c', '#ff8fc7', '#ff6f59', '#fff'][i % 4], 3.5));
  });
  svg.append(kupu(210, 470, '#ffc93c'), kupu(330, 240, '#ff8fc7'), kupu(90, 560, '#c084fc'));

  // bangunan pos & penanda
  const geser = { gerbang: [0, 4], jembatan: [8, 10], sungai: [-18, 10], gua: [44, 8], pasar: [-24, 6], bukit: [40, 6], dermaga: [-36, -6] };
  const lapisPenanda = s('g', {});
  daftarPos.forEach((p, i) => {
    const [x, y] = TITIK[TITIK_POS[i]];
    const [gx, gy] = geser[p.id] || [0, 0];
    const b = (BANGUNAN[p.id] || (() => s('g', {})))();
    const kelompok = s('g', { class: 'bangunan', transform: `translate(${x + gx} ${y + gy})`, tabindex: '-1' }, b);
    kelompok.addEventListener('click', () => onPilihPos?.(i));
    svg.append(kelompok);
    const status = selesai.has(p.id) ? 'sudah' : i === posAktif ? 'kini' : 'nanti';
    // Posisi di elemen luar; animasi denyut di elemen dalam (agar transform tidak saling menimpa).
    const warna = status === 'sudah' ? '#4f8a2c' : status === 'kini' ? '#f0932b' : '#a39a8c';
    const lebarLabel = p.nama.length * 6.2 + 16;
    const pn = s('g', { transform: `translate(${x} ${y - (status === 'kini' ? 96 : 88)})` },
      s('g', { class: `penanda ${status}` },
        // pin peta (tetesan) berisi nomor/centang
        s('path', { d: 'M0 16 C-6 8 -15 2 -15 -8 A15 15 0 1 1 15 -8 C15 2 6 8 0 16 Z', fill: warna, stroke: '#fffaf0', 'stroke-width': 2.5 }),
        s('circle', { cy: -8, r: 9.5, fill: '#fffaf0' }),
        s('text', { y: -3.5, 'text-anchor': 'middle', 'font-size': 12.5, 'font-weight': 900, fill: warna }, status === 'sudah' ? '✓' : String(i + 1))),
      s('g', { transform: 'translate(0 -36)' },
        s('rect', { x: -lebarLabel / 2, y: -11, width: lebarLabel, height: 20, rx: 10, fill: '#fffaf0', stroke: '#d9c49a', 'stroke-width': 1.2, opacity: status === 'nanti' ? 0.85 : 1 }),
        s('text', { y: 3.5, 'text-anchor': 'middle', 'font-size': 10.5, 'font-weight': 800, fill: '#4a3a24' }, p.nama)));
    pn.addEventListener('click', () => onPilihPos?.(i));
    lapisPenanda.append(pn);
  });
  const peti = s('g', { transform: 'translate(280 64) scale(.55)' }, gambarPeti(false));
  svg.append(peti);

  // Ulfa (dengan Lino di bahu)
  const tokoh = s('g', { class: 'tokoh-peta' });
  const badan = s('g', {});
  const ulfa = gambarUlfa('jalan');
  const lino = gambarLino('duduk');
  lino.setAttribute('transform', 'translate(54 30) scale(.72)');
  badan.append(ulfa, lino);
  tokoh.append(badan);
  svg.append(tokoh, lapisPenanda);
  wadah.append(svg);

  // panjang jalur tiap titik (untuk animasi berjalan)
  const total = jalurGerak.getTotalLength();
  const panjangTitik = TITIK.map(([tx, ty]) => {
    let terbaik = 0;
    let jarak = Infinity;
    for (let l = 0; l <= total; l += 2) {
      const p = jalurGerak.getPointAtLength(l);
      const dd = (p.x - tx) ** 2 + (p.y - ty) ** 2;
      if (dd < jarak) { jarak = dd; terbaik = l; }
    }
    return terbaik;
  });

  let posisi = panjangTitik[Math.max(0, Math.min(diTitik, TITIK.length - 1))];
  let hadap = 1;
  function taruh(l, lompat = 0) {
    const p = jalurGerak.getPointAtLength(l);
    tokoh.setAttribute('transform', `translate(${p.x} ${p.y - lompat})`);
    badan.setAttribute('transform', `scale(${hadap * 0.42} 0.42) translate(-50 -168)`);
  }
  taruh(posisi);

  function gulirKeTokoh() {
    const r = tokoh.getBoundingClientRect();
    const rw = wadah.getBoundingClientRect();
    wadah.scrollTo({ top: wadah.scrollTop + (r.top - rw.top) - rw.height / 2, behavior: kurangGerak ? 'auto' : 'smooth' });
  }
  requestAnimationFrame(gulirKeTokoh);

  let rafId = null;
  return {
    pindahKe(keTitik, selesaiCb) {
      const target = panjangTitik[keTitik];
      if (kurangGerak || Math.abs(target - posisi) < 1) { posisi = target; taruh(posisi); gulirKeTokoh(); selesaiCb?.(); return; }
      const dari = posisi;
      const durasi = Math.min(4000, Math.max(1200, Math.abs(target - dari) * 6));
      const mulai = performance.now();
      let lompatTerakhir = -1;
      const langkah = (w) => {
        const p = Math.min(1, (w - mulai) / durasi);
        const halus = p < 0.5 ? 2 * p * p : 1 - (-2 * p + 2) ** 2 / 2;
        const lama = posisi;
        posisi = dari + (target - dari) * halus;
        const a = jalurGerak.getPointAtLength(lama);
        const b = jalurGerak.getPointAtLength(posisi);
        if (Math.abs(b.x - a.x) > 0.2) hadap = b.x >= a.x ? 1 : -1;
        const fase = (posisi - dari) / 18;
        taruh(posisi, Math.abs(Math.sin(fase * Math.PI)) * 7);
        const ke = Math.floor(fase);
        if (ke !== lompatTerakhir) { lompatTerakhir = ke; if (ke % 2 === 0) efek('langkah'); }
        gulirKeTokoh();
        if (p < 1) rafId = requestAnimationFrame(langkah);
        else { taruh(posisi); selesaiCb?.(); }
      };
      rafId = requestAnimationFrame(langkah);
    },
    hapus() {
      if (rafId) cancelAnimationFrame(rafId);
      svg.remove();
    },
  };
}
