// Beranda (ringkasan + lanjutkan belajar) dan halaman Progres.

import { h, LABEL_LEVEL, LABEL_TOPIK_LATIHAN } from '../ui.js';
import * as simpan from '../simpan.js';
import { TOPIK } from '../konten/materi.js';
import { topikBerikut, statusTopik } from './belajar.js';
import { SARAN_KESALAHAN } from './latihan.js';
import { LABEL_KESALAHAN } from '../mesin.js';
import { blokPasang, bisaDipasang } from '../pasang.js';

function latihanDisarankan() {
  for (const topik of ['plsv', 'ptlsv']) {
    for (const level of ['dasar', 'menengah', 'tantangan']) {
      if (!simpan.infoLatihan(topik, level)?.dikuasai) return { topik, level };
    }
  }
  return null;
}

function ringkasan() {
  const d = simpan.ambil();
  const dipelajari = TOPIK.filter((t) => d.topik[t.id]?.dipelajari).length;
  const dikuasai = Object.values(d.latihan).filter((l) => l.dikuasai).length;
  const misi = Object.keys(d.literasi).length;
  return { dipelajari, dikuasai, misi };
}

export function halamanBeranda() {
  const d = simpan.ambil();
  const berikut = topikBerikut();
  const saran = latihanDisarankan();
  const r = ringkasan();
  const kesalahanUtama = simpan.rekapKesalahan()[0];
  return [
    h('h1', {}, `Halo, ${d.profil?.nama || 'teman'}! 👋`),
    berikut
      ? h('section', { class: 'kartu sorot' },
        h('p', { class: 'redup kecil', style: 'margin:0' }, 'Lanjutkan belajar'),
        h('h2', {}, `${berikut.ikon} ${berikut.no}. ${berikut.judul}`),
        h('p', { class: 'redup' }, berikut.ringkas),
        h('a', { class: 'tombol penuh', href: `#/belajar/${berikut.id}` }, 'Lanjut →'))
      : h('section', { class: 'kartu sorot' }, h('h2', {}, '🎉 Semua materi sudah dipelajari'),
        h('p', {}, 'Pertahankan dengan latihan dan misi literasi.')),
    !d.prasyarat ? h('section', { class: 'kartu' }, h('h2', {}, '🔁 Pemanasan'),
      h('p', {}, 'Cek dulu bilangan negatif dan bentuk aljabar (8 soal).'),
      h('a', { class: 'tombol kedua penuh', href: '#/prasyarat' }, 'Mulai Pemanasan')) : null,
    saran ? h('section', { class: 'kartu' }, h('h2', {}, '📝 Latihan disarankan'),
      h('p', {}, `${LABEL_TOPIK_LATIHAN[saran.topik]} · Level ${LABEL_LEVEL[saran.level]}`),
      h('a', { class: 'tombol kedua penuh', href: `#/latihan/${saran.topik}/${saran.level}` }, 'Mulai latihan')) : null,
    kesalahanUtama && SARAN_KESALAHAN[kesalahanUtama[0]]
      ? h('section', { class: 'kartu' }, h('h2', {}, '🎯 Fokus perbaikan'),
        h('p', {}, `Kesalahan yang paling sering: ${LABEL_KESALAHAN[kesalahanUtama[0]]} (${kesalahanUtama[1]}×).`),
        h('a', { class: 'tombol kedua penuh', href: SARAN_KESALAHAN[kesalahanUtama[0]].href }, SARAN_KESALAHAN[kesalahanUtama[0]].teks))
      : null,
    h('section', { class: 'kartu' },
      h('div', { class: 'baris antara' }, h('h2', { style: 'margin:0' }, '📊 Progresku'), h('a', { href: '#/progres' }, 'Lihat semua')),
      h('ul', {},
        h('li', {}, `Materi dipelajari: ${r.dipelajari} dari ${TOPIK.length}`),
        h('li', {}, `Level latihan dikuasai: ${r.dikuasai} dari 6`),
        h('li', {}, `Misi literasi selesai: ${r.misi}`))),
    bisaDipasang() ? h('section', { class: 'kartu' }, h('h2', {}, '📲 Pasang aplikasi'), blokPasang({ ringkas: true })) : null,
  ];
}

export function halamanProgres() {
  const d = simpan.ambil();
  const kesalahan = simpan.rekapKesalahan();
  const sesi = d.sesi.slice(0, 10);
  return [
    h('h1', {}, '📊 Progres Saya'),
    h('section', { class: 'kartu' }, h('h2', {}, 'Materi'),
      h('ul', { class: 'daftar' }, TOPIK.map((t) => {
        const st = statusTopik(t.id);
        return h('li', { class: 'baris antara', style: 'padding:6px 0' }, `${t.ikon} ${t.judul}`, h('span', { class: `lencana ${st.kelas}` }, st.teks));
      }))),
    h('section', { class: 'kartu' }, h('h2', {}, 'Latihan'),
      ['plsv', 'ptlsv'].map((topik) => [h('h3', {}, LABEL_TOPIK_LATIHAN[topik]),
        h('ul', { class: 'daftar' }, ['dasar', 'menengah', 'tantangan'].map((level) => {
          const info = simpan.infoLatihan(topik, level);
          return h('li', { class: 'baris antara', style: 'padding:4px 0' }, LABEL_LEVEL[level],
            info ? h('span', { class: `lencana ${info.dikuasai ? 'ok' : 'proses'}` }, `Terbaik ${info.terbaik} · ${info.kali}×`) : h('span', { class: 'lencana' }, 'Belum'));
        }))])),
    d.prasyarat ? h('section', { class: 'kartu' }, h('h2', {}, 'Pemanasan prasyarat'), h('p', {}, `Nilai: ${d.prasyarat.skor}`)) : null,
    h('section', { class: 'kartu' }, h('h2', {}, 'Kesalahan yang sering terjadi'),
      kesalahan.length
        ? h('ul', {}, kesalahan.slice(0, 5).map(([k, n]) => h('li', {}, `${LABEL_KESALAHAN[k] || k}: ${n}×`)))
        : h('p', { class: 'redup' }, 'Belum ada data. Ayo mulai latihan!')),
    sesi.length ? h('section', { class: 'kartu' }, h('h2', {}, 'Riwayat terakhir'),
      h('ul', {}, sesi.map((s) => h('li', {},
        `${new Date(s.waktu).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })} · `,
        s.jenis === 'latihan' ? `${LABEL_TOPIK_LATIHAN[s.topik]} ${LABEL_LEVEL[s.level]}` : `Misi ${s.topik}`,
        ` · nilai ${s.skor}`)))) : null,
  ];
}
