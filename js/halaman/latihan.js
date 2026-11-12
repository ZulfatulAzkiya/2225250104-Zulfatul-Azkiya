// Halaman Latihan: pilih topik & level, sesi 5 soal langkah demi langkah, nilai + pembahasan.

import { h, mat, umpan, kosongkan, LABEL_LEVEL, LABEL_TOPIK_LATIHAN } from '../ui.js';
import * as simpan from '../simpan.js';
import { ambilSoal } from '../api.js';
import { buatPengerja } from '../komponen/pengerja.js';
import { baris } from '../komponen/contoh.js';
import { selesaikan, LABEL_KESALAHAN } from '../mesin.js';

const JUMLAH_SOAL = 5;
const LEVEL = ['dasar', 'menengah', 'tantangan'];

/** Rekomendasi materi berdasarkan jenis kesalahan (umpan balik akhir sesi). */
export const SARAN_KESALAHAN = {
  E_TANDA_TIDAK_DIBALIK: { href: '#/belajar/tanda/1', teks: 'Lihat lagi animasi "Kenapa tandanya dibalik?"' },
  E_TANDA_DIBALIK_SALAH: { href: '#/belajar/tanda/2', teks: 'Ulangi aturan kapan tanda dibalik' },
  E_TANDA_TERTUKAR: { href: '#/belajar/simbol', teks: 'Ulangi arti simbol <, >, ≤, ≥' },
  E_HITUNG_NEGATIF: { href: '#/belajar/prasyarat/1', teks: 'Ulangi operasi bilangan negatif' },
  E_SATU_RUAS: { href: '#/belajar/plsv/2', teks: 'Ulangi prinsip timbangan' },
  E_PINDAH_RUAS: { href: '#/belajar/plsv/2', teks: 'Ulangi prinsip timbangan' },
  E_DISTRIBUTIF: { href: '#/belajar/prasyarat/5', teks: 'Ulangi sifat distributif' },
  E_OPERASI_KURANG_TEPAT: { href: '#/belajar/plsv/4', teks: 'Lihat lagi contoh memilih operasi' },
};

export function halamanPilihLatihan() {
  return [
    h('h1', {}, '📝 Latihan'),
    h('p', { class: 'redup' }, `Setiap sesi berisi ${JUMLAH_SOAL} soal. Level berikutnya terbuka jika nilaimu minimal ${simpan.AMBANG_KUASAI}.`),
    ['plsv', 'ptlsv'].map((topik) => h('section', { class: 'kartu' },
      h('h2', {}, LABEL_TOPIK_LATIHAN[topik]),
      h('ul', { class: 'daftar' }, LEVEL.map((level) => {
        const info = simpan.infoLatihan(topik, level);
        const terbuka = simpan.levelTerbuka(topik, level);
        const status = info?.dikuasai ? h('span', { class: 'lencana ok' }, `✓ ${info.terbaik}`)
          : info ? h('span', { class: 'lencana proses' }, `Terbaik ${info.terbaik}`)
            : !terbuka ? h('span', { class: 'lencana' }, '🔒') : null;
        return h('li', {}, h('a', {
          href: `#/latihan/${topik}/${level}`,
          onclick: (e) => {
            if (!terbuka && !confirm(`Level ${LABEL_LEVEL[level]} mungkin terasa sulit karena level sebelumnya belum dikuasai. Tetap coba?`)) e.preventDefault();
          },
        },
        h('span', { class: 'ikon', 'aria-hidden': 'true' }, { dasar: '🌱', menengah: '🌿', tantangan: '🌳' }[level]),
        h('span', { class: 'isi' }, h('strong', {}, LABEL_LEVEL[level]),
          h('span', { class: 'redup kecil' }, {
            dasar: 'Satu atau dua langkah',
            menengah: topik === 'ptlsv' ? 'Banyak soal perlu membalik tanda' : 'x di kedua ruas & bilangan negatif',
            tantangan: 'Kurung, pecahan, dan campuran',
          }[level])),
        status));
      })))),
  ];
}

export function halamanSesi(topik, level) {
  if (!LABEL_TOPIK_LATIHAN[topik] || !LABEL_LEVEL[level]) {
    return [h('p', {}, 'Latihan tidak ditemukan.'), h('a', { href: '#/latihan' }, 'Kembali')];
  }
  const wadah = h('div', {}, h('p', { class: 'redup' }, 'Menyiapkan soal…'));
  const judul = h('h1', {}, `${LABEL_TOPIK_LATIHAN[topik]} · ${LABEL_LEVEL[level]}`);

  ambilSoal(topik, level, JUMLAH_SOAL + 2).then(({ soal, sumber }) => {
    if (soal.length < 2) throw new Error('soal kurang');
    const utama = soal.slice(0, Math.min(JUMLAH_SOAL, soal.length - 1));
    const contoh = soal.slice(utama.length);
    jalankan(utama, contoh, sumber);
  }).catch(() => {
    kosongkan(wadah, umpan('salah', '', 'Soal belum bisa dimuat. Periksa koneksi, lalu muat ulang halaman.'));
  });

  function jalankan(daftarSoal, contoh, sumber) {
    const hasil = [];
    let i = 0;
    function tampil() {
      const lanjut = h('button', { class: 'tombol penuh', type: 'button', hidden: true, onclick: () => { i += 1; i < daftarSoal.length ? tampil() : akhir(); } },
        i === daftarSoal.length - 1 ? 'Lihat hasil' : 'Soal berikutnya →');
      const pengerja = buatPengerja({
        soal: daftarSoal[i].soal,
        petunjukOtomatis: level === 'dasar',
        contohSerupa: contoh[i % contoh.length]?.soal || null,
        onSelesai: (r) => { hasil[i] = r; lanjut.hidden = false; lanjut.focus(); },
      });
      kosongkan(wadah,
        h('div', { class: 'baris antara' }, h('span', { class: 'redup' }, `Soal ${i + 1} dari ${daftarSoal.length}`),
          sumber === 'perangkat' && navigator.onLine === false ? h('span', { class: 'lencana', title: 'Soal diambil dari perangkat karena server tidak terjangkau' }, '📴 Offline') : null),
        h('div', { class: 'batang', 'aria-hidden': 'true', style: 'margin-bottom:12px' }, h('i', { style: `width:${(i / daftarSoal.length) * 100}%` })),
        pengerja, lanjut);
      window.scrollTo({ top: 0 });
    }

    function akhir() {
      const benar = hasil.filter((r) => r.benar).length;
      const skor = Math.round((benar / hasil.length) * 100);
      const kesalahan = {};
      hasil.forEach((r) => Object.entries(r.kesalahan).forEach(([k, n]) => { kesalahan[k] = (kesalahan[k] || 0) + n; }));
      const info = simpan.catatLatihan(topik, level, { skor, benar, total: hasil.length, kesalahan });
      const urut = Object.entries(kesalahan).sort((a, b) => b[1] - a[1]);
      const saran = urut.map(([k]) => SARAN_KESALAHAN[k]).filter(Boolean)
        .filter((sr, j, arr) => arr.findIndex((x) => x.href === sr.href) === j).slice(0, 2);
      const berikut = simpan.levelBerikut(level);

      kosongkan(wadah,
        h('section', { class: 'kartu' },
          h('h2', {}, 'Hasil Latihan'),
          h('div', { class: 'skor-besar' }, String(skor)),
          h('p', { style: 'text-align:center' }, `${benar} dari ${hasil.length} soal benar tanpa kesalahan dan tanpa petunjuk terakhir`),
          skor >= simpan.AMBANG_KUASAI
            ? umpan('benar', '🎉 Level dikuasai! ', berikut ? `Level ${LABEL_LEVEL[berikut]} sudah terbuka.` : 'Kamu menuntaskan level tertinggi.')
            : umpan('info', 'Terus berlatih! ', `Capai nilai ${simpan.AMBANG_KUASAI} untuk menguasai level ini.`),
          urut.length ? [h('h3', {}, 'Perlu diperhatikan'),
            h('ul', {}, urut.slice(0, 3).map(([k, n]) => h('li', {}, `${LABEL_KESALAHAN[k] || k} (${n}×)`))),
            saran.map((sr) => h('a', { class: 'tombol kedua penuh', href: sr.href, style: 'margin-top:8px' }, sr.teks))] : null),
        h('h2', {}, 'Pembahasan'),
        hasil.map((r, j) => pembahasan(r, j)),
        h('div', { class: 'tumpuk', style: 'margin-top:12px' },
          h('button', { class: 'tombol penuh', type: 'button', onclick: () => { location.hash = `#/latihan/${topik}/${level}?u=${Date.now()}`; } }, '↻ Ulangi dengan soal baru'),
          info.dikuasai && berikut ? h('a', { class: 'tombol kedua penuh', href: `#/latihan/${topik}/${berikut}` }, `Level ${LABEL_LEVEL[berikut]} →`) : null,
          h('a', { class: 'tombol netral penuh', href: '#/latihan' }, 'Kembali ke Latihan')));
      window.scrollTo({ top: 0 });
    }
    tampil();
  }

  return [h('p', { style: 'margin:0' }, h('a', { href: '#/latihan' }, '← Latihan')), judul, wadah];
}

/** Pembahasan satu soal: langkah siswa berdampingan dengan langkah kunci (FR-12). */
export function pembahasan(r, j) {
  const kunci = selesaikan(r.soal);
  return h('details', {},
    h('summary', {}, `${r.benar ? '✅' : '⚠️'} Soal ${j + 1}: `, mat(r.soal)),
    h('div', { class: 'dua-kolom', style: 'margin-top:8px' },
      h('div', {}, h('h4', {}, 'Langkahmu'),
        r.langkah.map((lk) => h('div', {},
          lk.salah.map((sl) => h('span', { class: 'baris-mat salah-langkah' }, '✗ ', mat(sl.jawaban, ''),
            h('span', { class: 'kecil' }, ` — ${LABEL_KESALAHAN[sl.kode] || sl.kode}`))),
          h('span', { class: 'baris-mat' }, mat(lk.tampil, ''))))),
      h('div', {}, h('h4', {}, 'Langkah kunci'),
        h('ol', { class: 'langkah-daftar' }, kunci.langkah.map(baris)))),
    r.dibantu ? h('p', { class: 'kecil redup' }, 'Memakai petunjuk tingkat 3 (hasil langkah ditampilkan).') : null,
    h('p', {}, 'Jawaban: ', mat(kunci.jawaban)));
}
