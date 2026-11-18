// Ruang Ulfa: perkenalan karakter, musik, "Ketuk Ulfa!" (tips), dan koleksi bintang.

import { h, s, kosongkan, saatKeluar } from '../ui.js';
import * as simpan from '../simpan.js';
import { gambarUlfa, gambarLino } from '../komponen/ilustrasi.js';
import { tokoh } from '../komponen/tokoh.js';
import * as suara from '../petualangan/suara.js';

const TIPS = [
  'Ingat timbangan: lakukan operasi yang sama di KEDUA ruas.',
  'Dikali atau dibagi bilangan negatif? Tanda pertidaksamaan dibalik!',
  'Ujung runcing tanda < menunjuk bilangan yang lebih kecil.',
  'Tanda ≤ dan ≥ berarti bulatan PENUH di garis bilangan.',
  'Cek jawabanmu: masukkan nilai x ke soal, lalu lihat apakah benar.',
  'Soal cerita? Tentukan dulu apa yang dimisalkan sebagai x.',
  'Benda tidak bisa dipotong: hasil 4,5 peti berarti paling banyak 4 peti.',
  'Menambah atau mengurangi tidak pernah membalik tanda.',
];

function hitungBintang() {
  const d = simpan.ambil();
  const pos = Object.values(d.petualangan?.pos || {});
  const bintangPemanasan = pos.reduce((a, p) => a + (p.bintang || 0), 0);
  const posSelesai = pos.filter((p) => p.selesai).length;
  const levelKuasai = Object.values(d.latihan || {}).filter((l) => l.dikuasai).length;
  const harta = posSelesai >= 7 ? 1 : 0;
  return { dapat: Math.min(20, bintangPemanasan + posSelesai + levelKuasai + harta), maks: 20 };
}

function potretUlfa() {
  const svg = s('svg', { viewBox: '-6 0 150 176', class: 'potret', role: 'img', 'aria-label': 'Ulfa melambaikan tangan bersama Lino' });
  svg.append(
    s('ellipse', { cx: 70, cy: 150, rx: 70, ry: 18, fill: '#cfe3a8' }),
    s('circle', { cx: 18, cy: 140, r: 5, fill: '#ff8fb1' }), s('circle', { cx: 128, cy: 146, r: 5, fill: '#f7c548' }),
  );
  const u = gambarUlfa('hore');
  u.setAttribute('transform', 'translate(10 0)');
  const l = gambarLino('duduk');
  l.setAttribute('transform', 'translate(88 84) scale(.85)');
  svg.append(u, l);
  return svg;
}

export function halamanUlfa() {
  const d = simpan.ambil();
  const b = hitungBintang();

  // --- Ketuk Ulfa!
  const gelembung = h('p', { class: 'gelembung-tip', 'aria-live': 'polite' }, 'Ketuk aku untuk tips rahasia!');
  const wadahWajah = h('span', {}, tokoh('ulfa', 'senyum', 78));
  let urut = -1;
  const ketuk = h('button', {
    class: 'ketuk-ulfa', type: 'button', 'aria-label': 'Ketuk Ulfa untuk mendapat tips',
    onclick: () => {
      urut = (urut + 1) % TIPS.length;
      kosongkan(wadahWajah, tokoh('ulfa', ['hore', 'tanya', 'semangat', 'senyum'][urut % 4], 78));
      gelembung.textContent = TIPS[urut];
      suara.efek('klik');
    },
  }, wadahWajah);

  // --- Musik
  let hentikanLagu = null;
  const tombolLagu = h('button', { class: 'putar', type: 'button', 'aria-label': 'Putar Lagu Ekspedisi' }, '▶');
  const tombolTema = h('button', { class: 'putar', type: 'button', 'aria-label': 'Putar musik Tema Petualangan' }, '▶');
  const pemutar = h('div', { class: 'pemutar', hidden: true },
    h('span', { class: 'piringan', 'aria-hidden': 'true' }, '🎵'), h('strong', { class: 'judul-putar' }, ''),
    h('button', { class: 'putar kecil', type: 'button', 'aria-label': 'Hentikan', onclick: () => berhenti() }, '⏸'));
  function berhenti() {
    hentikanLagu?.(); hentikanLagu = null;
    suara.hentikanMusik();
    tombolLagu.textContent = '▶'; tombolTema.textContent = '▶';
    pemutar.hidden = true;
  }
  function tampilPemutar(judul) { pemutar.hidden = false; pemutar.querySelector('.judul-putar').textContent = judul; }
  tombolLagu.addEventListener('click', () => {
    const sedang = hentikanLagu; berhenti();
    if (sedang) return;
    hentikanLagu = suara.nyanyikan(null, berhenti);
    tombolLagu.textContent = '⏸';
    tampilPemutar('Lagu Ekspedisi');
  });
  tombolTema.addEventListener('click', () => {
    const sedang = suara.musikBerjalan(); berhenti();
    if (sedang) return;
    if (simpan.ambil().pengaturan.musik === 'mati') simpan.setPengaturan({ musik: 'nyala' });
    suara.mulaiMusik();
    tombolTema.textContent = '⏸';
    tampilPemutar('Tema Petualangan');
  });
  saatKeluar(berhenti);

  return [
    h('h1', {}, '🌼 Ruang Ulfa'),
    h('section', { class: 'kartu profil-ulfa' },
      h('div', { class: 'bingkai-potret' }, potretUlfa()),
      h('h2', { style: 'text-align:center' }, `Hai, ${d.profil?.nama || 'teman'}! Aku Ulfa 🌼`),
      h('p', { style: 'text-align:center' }, 'Aku siswi SMP yang suka berpetualang dan memecahkan teka-teki aljabar. Bersama sahabatku Lino si tarsius, ayo jelajahi Pulau Aljabar!')),
    h('section', { class: 'kartu' },
      h('h2', { style: 'text-align:center' }, 'Aku Suka'),
      h('div', { class: 'suka' },
        [['🧭', 'Petualangan'], ['⚖️', 'Aljabar'], ['🌿', 'Alam'], ['🤝', 'Membantu']].map(([i, t]) =>
          h('div', {}, h('span', { 'aria-hidden': 'true' }, i), t)))),
    h('section', { class: 'kartu ketuk-kartu' },
      h('div', {}, h('h2', {}, 'Ketuk Ulfa!'), gelembung), ketuk),
    h('section', { class: 'kartu' },
      h('h2', {}, '🎶 Musik Ulfa'),
      h('ul', { class: 'daftar-lagu' },
        h('li', {}, h('span', { 'aria-hidden': 'true' }, '⭐'), h('span', {}, h('strong', {}, 'Lagu Ekspedisi'), h('span', { class: 'redup kecil' }, 'Lagu aljabar untuk dinyanyikan bersama')), tombolLagu),
        h('li', {}, h('span', { 'aria-hidden': 'true' }, '🌴'), h('span', {}, h('strong', {}, 'Tema Petualangan'), h('span', { class: 'redup kecil' }, 'Musik latar di peta')), tombolTema)),
      pemutar),
    h('section', { class: 'kartu' },
      h('div', { class: 'baris antara' }, h('h2', { style: 'margin:0' }, '⭐ Kumpulkan Bintang'), h('strong', {}, `${b.dapat} / ${b.maks}`)),
      h('div', { class: 'batang', style: 'margin:10px 0', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': b.maks, 'aria-valuenow': b.dapat, 'aria-label': 'Bintang terkumpul' },
        h('i', { style: `width:${(b.dapat / b.maks) * 100}%` })),
      h('p', { class: 'redup kecil' }, 'Bintang didapat dari teka-teki pemanasan, pos petualangan, level latihan yang dikuasai, dan membuka peti harta.'),
      h('a', { class: 'tombol kedua penuh', href: '#/petualangan' }, 'Cari bintang di petualangan ▶')),
    h('section', { class: 'kartu kutipan' },
      h('h2', {}, '💬 Kata Ulfa'),
      h('p', {}, '"Setiap soal adalah petualangan kecil. Pelan-pelan saja, satu langkah demi satu langkah!"')),
  ];
}
