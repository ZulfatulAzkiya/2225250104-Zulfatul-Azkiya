// Halaman Belajar: peta materi, kartu materi (1 konsep per layar), dan kuis prasyarat.

import { h, mat, umpan, kosongkan } from '../ui.js';
import { TOPIK, cariTopik } from '../konten/materi.js';
import * as simpan from '../simpan.js';
import { garisBilangan, penjelajahSimbol, timbangan, cerminTanda } from '../komponen/visual.js';
import { buatContoh } from '../komponen/contoh.js';
import { buatPilihan } from '../komponen/pilihan.js';
import { muatJson } from '../api.js';

export function statusTopik(id) {
  const t = simpan.ambil().topik[id];
  if (t?.dipelajari) return { teks: 'Selesai', kelas: 'ok', ikon: '✅' };
  if (t) return { teks: 'Sedang', kelas: 'proses', ikon: '🔵' };
  return { teks: 'Belum', kelas: '', ikon: '⚪' };
}

export function topikBerikut() {
  return TOPIK.find((t) => !simpan.ambil().topik[t.id]?.dipelajari) || null;
}

export function halamanPeta() {
  return [
    h('h1', {}, 'Peta Materi'),
    h('p', { class: 'redup' }, 'Pelajari berurutan dari atas. Satu kartu, satu konsep.'),
    h('ul', { class: 'daftar' }, TOPIK.map((t) => {
      const st = statusTopik(t.id);
      return h('li', {}, h('a', { href: `#/belajar/${t.id}` },
        h('span', { class: 'ikon', 'aria-hidden': 'true' }, t.ikon),
        h('span', { class: 'isi' }, h('strong', {}, `${t.no}. ${t.judul}`), h('span', { class: 'redup kecil' }, t.ringkas)),
        h('span', { class: `lencana ${st.kelas}` }, st.teks)));
    })),
  ];
}

function isiKartu(k) {
  const judul = k.judul ? h('h2', {}, k.judul) : null;
  const rumus = k.rumus ? h('div', { class: 'rumus' }, k.rumus.map((r) => h('div', { class: 'mat-besar', style: 'margin:0' }, mat(r, '')))) : null;
  const daftar = k.daftar ? h('ul', {}, k.daftar.map((d) => h('li', {}, d))) : null;
  const teks = k.teks ? h('p', {}, k.teks) : null;
  switch (k.jenis) {
    case 'teks': return [judul, rumus, teks, daftar];
    case 'garis': return [judul, garisBilangan(k.titik ? { titik: k.titik, min: k.min, maks: k.maks } : { rel: k.rel, nilai: k.nilai }), teks];
    case 'simbol': return [judul, penjelajahSimbol()];
    case 'timbangan': return [judul, timbangan()];
    case 'cermin': return [judul, cerminTanda()];
    case 'contoh': return [judul, h('p', { class: 'redup' }, 'Ketuk tombol untuk membuka satu langkah setiap kali.'), buatContoh(k.soal, { catatan: k.catatan })];
    case 'cek': return [h('h2', {}, 'Cek pemahaman'), buatPilihan({ tanya: k.tanya, pilihan: k.pilihan, benar: k.benar, penjelasan: k.penjelasan, garis: k.garis })];
    case 'selesai': return [h('h2', {}, '🎉 Topik selesai!'), teks,
      h('div', { class: 'tumpuk' }, k.aksi.map((a) => h('a', { class: 'tombol penuh', href: a.href }, a.label)))];
    default: return [teks];
  }
}

export function halamanTopik(id, nomorKartu) {
  const topik = cariTopik(id);
  if (!topik) return [h('p', {}, 'Topik tidak ditemukan.'), h('a', { href: '#/belajar' }, 'Kembali ke Peta Materi')];
  const total = topik.kartu.length;
  const simpanan = simpan.ambil().topik[id]?.kartu ?? 0;
  let i = Number.isInteger(nomorKartu) ? Math.min(Math.max(nomorKartu, 0), total - 1) : (simpanan >= total - 1 ? 0 : simpanan);

  const wadah = h('section', { class: 'kartu', 'aria-live': 'polite' });
  const titik = h('div', { class: 'titik-progres', 'aria-hidden': 'true' });
  const posisi = h('p', { class: 'redup kecil', style: 'text-align:center;margin:0' });
  const kembali = h('button', { class: 'tombol netral', type: 'button', onclick: () => ke(i - 1) }, '← Kembali');
  const lanjut = h('button', { class: 'tombol', type: 'button', onclick: () => (i === total - 1 ? (location.hash = '#/belajar') : ke(i + 1)) });

  function ke(n) {
    i = Math.max(0, Math.min(n, total - 1));
    simpan.catatKartu(id, i, total);
    kosongkan(wadah, isiKartu(topik.kartu[i]));
    kosongkan(titik, topik.kartu.map((_, j) => h('i', { class: j === i ? 'aktif' : j < i ? 'lewat' : '' })));
    posisi.textContent = `Kartu ${i + 1} dari ${total}`;
    kembali.disabled = i === 0;
    lanjut.textContent = i === total - 1 ? 'Ke Peta Materi' : 'Lanjut →';
    window.scrollTo({ top: 0 });
  }
  ke(i);
  return [
    h('p', { style: 'margin:0' }, h('a', { href: '#/belajar' }, '← Peta Materi')),
    h('h1', {}, `${topik.ikon} ${topik.judul}`),
    titik, posisi, wadah,
    h('div', { class: 'navlangkah' }, kembali, lanjut),
  ];
}

// ------------------------------------------------------------- kuis prasyarat
export function halamanPrasyarat() {
  const wadah = h('div');
  muatJson('data/prasyarat.json').then((data) => mulai(data)).catch(() => {
    kosongkan(wadah, umpan('salah', '', 'Kuis belum bisa dimuat. Periksa koneksi lalu coba lagi.'));
  });

  function mulai(data) {
    let i = 0;
    const benarPertama = [];
    const soal = data.soal;
    function tampil() {
      const q = soal[i];
      const lanjut = h('button', { class: 'tombol penuh', type: 'button', disabled: true, onclick: () => { i += 1; i < soal.length ? tampil() : hasil(); } },
        i === soal.length - 1 ? 'Lihat hasil' : 'Soal berikutnya →');
      kosongkan(wadah,
        h('p', { class: 'redup' }, `Soal ${i + 1} dari ${soal.length}`),
        h('div', { class: 'batang', 'aria-hidden': 'true' }, h('i', { style: `width:${(i / soal.length) * 100}%` })),
        h('section', { class: 'kartu', style: 'margin-top:12px' },
          buatPilihan({
            tanya: q.tanya, pilihan: q.pilihan, benar: q.benar, penjelasan: q.penjelasan,
            onBenar: (pertama) => { benarPertama[i] = pertama; lanjut.disabled = false; lanjut.focus(); },
          })),
        lanjut);
    }
    function hasil() {
      const skor = Math.round((benarPertama.filter(Boolean).length / soal.length) * 100);
      const salahPer = {};
      soal.forEach((q, j) => { if (!benarPertama[j]) salahPer[q.topik] = (salahPer[q.topik] || 0) + 1; });
      const lemah = Object.keys(salahPer).filter((t) => (t === 'bilangan' ? salahPer[t] >= 2 : salahPer[t] >= 1));
      simpan.catatPrasyarat({ skor, lemah, waktu: Date.now() });
      kosongkan(wadah,
        h('section', { class: 'kartu' },
          h('h2', {}, 'Hasil Pemanasan'),
          h('div', { class: 'skor-besar' }, String(skor)),
          h('p', { style: 'text-align:center' }, `${benarPertama.filter(Boolean).length} dari ${soal.length} benar pada percobaan pertama`),
          lemah.length
            ? [umpan('info', 'Saran: ', 'ulangi dulu kartu pengingat berikut sebelum masuk materi inti.'),
              h('div', { class: 'tumpuk' }, lemah.map((t) => h('a', { class: 'tombol kedua penuh', href: `#/belajar/prasyarat/${data.topik[t].slide}` }, `Ulangi: ${data.topik[t].judul}`)))]
            : umpan('benar', 'Hebat! ', 'Prasyaratmu sudah kuat. Langsung ke materi Persamaan Linear.')),
        h('a', { class: 'tombol penuh', href: '#/belajar/plsv' }, 'Mulai materi Persamaan Linear →'));
    }
    tampil();
  }

  return [h('h1', {}, '🔁 Kuis Pemanasan'), h('p', { class: 'redup' }, '8 soal singkat tentang bilangan negatif dan bentuk aljabar. Tidak ada batas waktu.'), wadah];
}
