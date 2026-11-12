// Misi Literasi Matematika: masalah kontekstual dengan proses
// Pahami → Rumuskan → Selesaikan → Tafsirkan → Cek (merumuskan, menerapkan, menafsirkan, mengevaluasi).

import { h, mat, umpan, kosongkan, LABEL_LEVEL } from '../ui.js';
import * as simpan from '../simpan.js';
import { muatJson } from '../api.js';
import { buatPilihan } from '../komponen/pilihan.js';
import { buatPengerja } from '../komponen/pengerja.js';
import { pembahasan } from './latihan.js';

const TAHAP = ['Cerita', 'Pahami', 'Rumuskan', 'Selesaikan', 'Tafsirkan', 'Cek'];

export function halamanDaftarLiterasi() {
  const wadah = h('div', {}, h('p', { class: 'redup' }, 'Memuat misi…'));
  muatJson('data/literasi.json').then((data) => {
    const catatan = simpan.ambil().literasi;
    kosongkan(wadah, h('ul', { class: 'daftar' }, data.misi.map((m) => h('li', {},
      h('a', { href: `#/literasi/${m.id}` },
        h('span', { class: 'ikon', 'aria-hidden': 'true' }, m.ikon),
        h('span', { class: 'isi' }, h('strong', {}, m.judul),
          h('span', { class: 'redup kecil' }, `${LABEL_LEVEL[m.level]} · ${m.jenis === 'plsv' ? 'Persamaan' : 'Pertidaksamaan'} · Konteks ${m.konteks}`)),
        catatan[m.id] ? h('span', { class: 'lencana ok' }, `✓ ${catatan[m.id].terbaik}`) : null)))));
  }).catch(() => kosongkan(wadah, umpan('salah', '', 'Misi belum bisa dimuat. Periksa koneksi.')));
  return [
    h('h1', {}, '🌏 Misi Literasi'),
    h('p', {}, 'Pakai matematika untuk menyelesaikan masalah sehari-hari, lalu cek apakah jawabanmu masuk akal.'),
    h('p', { class: 'redup kecil' }, 'Belum kenal langkahnya? ', h('a', { href: '#/belajar/literasi' }, 'Baca materi Literasi Matematika')),
    wadah,
  ];
}

export function halamanMisi(id) {
  const wadah = h('div', {}, h('p', { class: 'redup' }, 'Memuat misi…'));
  const judul = h('h1', {}, 'Misi Literasi');
  muatJson('data/literasi.json').then((data) => {
    const m = data.misi.find((x) => x.id === id);
    if (!m) { kosongkan(wadah, h('p', {}, 'Misi tidak ditemukan.')); return; }
    judul.textContent = `${m.ikon} ${m.judul}`;
    jalankan(m);
  }).catch(() => kosongkan(wadah, umpan('salah', '', 'Misi belum bisa dimuat. Periksa koneksi.')));

  function jalankan(m) {
    let tahap = 0;
    const nilai = { pahami: false, rumuskan: false, selesaikan: false, tafsirkan: false, cek: false };
    let hasilSelesai = null;

    const cerita = (terbuka) => h('details', { open: terbuka },
      h('summary', {}, '📖 Cerita'), h('p', { class: 'cerita' }, m.cerita));

    function pita() {
      return h('div', { class: 'tahap', 'aria-label': `Tahap ${tahap + 1} dari ${TAHAP.length}: ${TAHAP[tahap]}` },
        TAHAP.map((t, i) => h('span', { class: i === tahap ? 'aktif' : i < tahap ? 'lewat' : '' }, t)));
    }

    function tampil() {
      const lanjut = h('button', { class: 'tombol penuh', type: 'button', onclick: () => { tahap += 1; tahap < TAHAP.length ? tampil() : akhir(); } },
        tahap === TAHAP.length - 1 ? 'Lihat hasil misi' : 'Lanjut →');
      const kunci = () => { lanjut.disabled = true; };
      const buka = () => { lanjut.disabled = false; };
      let isi;
      if (tahap === 0) {
        isi = [h('p', { class: 'redup kecil' }, `Konteks ${m.konteks}`), h('p', { class: 'cerita' }, m.cerita),
          umpan('info', 'Tips: ', 'baca pelan-pelan dan perhatikan bilangan serta kata kuncinya.')];
      } else if (tahap === 1) {
        kunci();
        isi = [cerita(true), h('h2', {}, '1. Pahami'), buatPilihan({ ...pg(m.pahami), onBenar: (p) => { nilai.pahami = p; buka(); } })];
      } else if (tahap === 2) {
        kunci();
        isi = [cerita(true), h('h2', {}, '2. Rumuskan'), umpan('info', 'Misalkan: ', mat(m.variabel)),
          buatPilihan({ ...pg(m.rumuskan), umpanSalah: m.rumuskan.umpan, onBenar: (p) => { nilai.rumuskan = p; buka(); } })];
      } else if (tahap === 3) {
        kunci();
        isi = [cerita(false), h('h2', {}, '3. Selesaikan'), h('p', {}, 'Selesaikan model matematikanya langkah demi langkah.'),
          buatPengerja({
            soal: m.model, petunjukOtomatis: m.level === 'dasar',
            onSelesai: (r) => { hasilSelesai = r; nilai.selesaikan = r.benar; buka(); },
          })];
      } else if (tahap === 4) {
        kunci();
        isi = [cerita(false), h('h2', {}, '4. Tafsirkan'),
          buatPilihan({ ...pg(m.tafsirkan), onBenar: (p) => { nilai.tafsirkan = p; buka(); } })];
      } else {
        kunci();
        isi = [cerita(false), h('h2', {}, '5. Cek: apakah masuk akal?'), h('div', { class: 'hitung' }, m.cek.hitung),
          buatPilihan({ ...pg(m.cek), onBenar: (p) => { nilai.cek = p; buka(); } })];
      }
      kosongkan(wadah, pita(), h('section', { class: 'kartu' }, isi), lanjut);
      window.scrollTo({ top: 0 });
    }

    function akhir() {
      const bagian = Object.values(nilai);
      const skor = Math.round((bagian.filter(Boolean).length / bagian.length) * 100);
      simpan.catatLiterasi(m.id, { skor, benar: bagian.filter(Boolean).length, total: bagian.length, kesalahan: hasilSelesai?.kesalahan || {} });
      const label = { pahami: 'Memahami masalah', rumuskan: 'Merumuskan model', selesaikan: 'Menyelesaikan', tafsirkan: 'Menafsirkan hasil', cek: 'Mengevaluasi jawaban' };
      kosongkan(wadah,
        h('section', { class: 'kartu' },
          h('h2', {}, 'Misi selesai! 🎉'),
          h('div', { class: 'skor-besar' }, String(skor)),
          h('p', { class: 'redup', style: 'text-align:center' }, 'Nilai dihitung dari jawaban benar pada percobaan pertama.'),
          h('ul', { class: 'daftar' }, Object.entries(nilai).map(([k, v]) => h('li', { class: 'baris', style: 'padding:6px 0' },
            h('span', { 'aria-hidden': 'true' }, v ? '✅' : '🔁'), `${label[k]}${v ? '' : ' — perlu dilatih lagi'}`)))),
        hasilSelesai ? pembahasan(hasilSelesai, 0) : null,
        h('div', { class: 'tumpuk', style: 'margin-top:12px' },
          h('a', { class: 'tombol penuh', href: '#/literasi' }, 'Misi lainnya'),
          h('button', { class: 'tombol netral penuh', type: 'button', onclick: () => { tahap = 0; Object.keys(nilai).forEach((k) => { nilai[k] = false; }); tampil(); } }, '↻ Ulangi misi ini')));
      window.scrollTo({ top: 0 });
    }
    tampil();
  }

  return [h('p', { style: 'margin:0' }, h('a', { href: '#/literasi' }, '← Misi Literasi')), judul, wadah];
}

function pg(q) {
  return { tanya: q.tanya, pilihan: q.pilihan, benar: q.benar, penjelasan: q.penjelasan };
}
