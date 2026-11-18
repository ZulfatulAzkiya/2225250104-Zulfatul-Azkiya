// Ekspedisi Pulau Aljabar: peta 3D, pos teka-teki, dan peti harta karun.
// Teka-teki mengikuti 4 indikator literasi matematika pada pretest-posttest (skor maks 6 per indikator).

import { h, mat, umpan, kosongkan, saatKeluar, umumkan } from '../ui.js';
import * as simpan from '../simpan.js';
import { muatJson } from '../api.js';
import { buatPilihan } from '../komponen/pilihan.js';
import { buatPengerja } from '../komponen/pengerja.js';
import { garisBilangan, INFO_SIMBOL } from '../komponen/visual.js';
import { buatDunia, dukungWebGL, TITIK_POS, TITIK_HARTA } from '../petualangan/dunia3d.js';
import * as suara from '../petualangan/suara.js';

const DATA = 'data/petualangan.json';
const NAMA = { ulfa: 'Ulfa', lino: 'Lino' };
const INDIKATOR_URUT = ['R', 'F', 'E', 'I'];

function posAktif(data) {
  const sudah = simpan.petualangan().pos;
  const i = data.pos.findIndex((p) => !sudah[p.id]?.selesai);
  return i === -1 ? data.pos.length : i;
}

function rekap(data) {
  const skor = { R: 0, F: 0, E: 0, I: 0 };
  let bintang = 0;
  for (const p of data.pos) {
    const c = simpan.petualangan().pos[p.id];
    if (!c) continue;
    for (const [k, v] of Object.entries(c.skor || {})) skor[k] += v;
    bintang += c.bintang || 0;
  }
  const maksBintang = data.pos.flatMap((p) => p.teka).reduce((a, t) => a + (t.bintang || 0), 0);
  return { skor, total: Object.values(skor).reduce((a, b) => a + b, 0), bintang, maksBintang };
}

/** Percakapan Ulfa & Lino, dengan tombol dengarkan (narasi suara). */
function percakapan(baris) {
  const teksSemua = baris.map((b) => `${NAMA[b.siapa]}: ${b.teks}`).join(' ');
  return h('div', { class: 'percakapan' },
    baris.map((b) => h('div', { class: `gelembung ${b.siapa}` },
      h('img', { src: `gambar/${b.siapa}.svg`, alt: '', width: 56, height: 56 }),
      h('p', {}, h('strong', {}, `${NAMA[b.siapa]}: `), b.teks))),
    suara.bisaBicara()
      ? h('button', { class: 'tombol netral', type: 'button', onclick: () => suara.bicara(teksSemua) }, '🔊 Dengarkan')
      : null);
}

function tombolSuara() {
  const b = h('button', { class: 'tombol netral', type: 'button' });
  const segar = () => {
    const nyala = simpan.ambil().pengaturan.musik !== 'mati';
    b.textContent = nyala ? '🔊 Musik' : '🔇 Musik';
    b.setAttribute('aria-pressed', String(nyala));
  };
  b.addEventListener('click', () => {
    const nyala = simpan.ambil().pengaturan.musik !== 'mati';
    simpan.setPengaturan({ musik: nyala ? 'mati' : 'nyala' });
    if (nyala) suara.hentikanMusik(); else suara.mulaiMusik();
    segar();
  });
  segar();
  return b;
}

// ======================================================================= PETA
export function halamanPeta() {
  const wadah = h('div', {}, h('p', { class: 'redup' }, 'Menyiapkan peta…'));
  muatJson(DATA).then((data) => tampil(data)).catch(() => kosongkan(wadah, umpan('salah', '', 'Peta belum bisa dimuat. Periksa koneksi.')));
  saatKeluar(() => { suara.hentikanMusik(); suara.hentikanBicara(); });

  function tampil(data) {
    const pt = simpan.petualangan();
    if (!pt.pembuka) {
      kosongkan(wadah, h('section', { class: 'kartu' },
        h('h2', {}, 'Peta kuno ditemukan!'),
        percakapan(data.pembuka),
        h('button', {
          class: 'tombol penuh', type: 'button', style: 'margin-top:12px',
          onclick: () => { simpan.setPembukaDilihat(); suara.efek('buka'); tampil(data); },
        }, 'Ayo berangkat! 🧭')));
      return;
    }

    const aktif = posAktif(data);
    const sudah = new Set(Object.keys(pt.pos).filter((k) => pt.pos[k].selesai));
    const tujuan = aktif < data.pos.length ? TITIK_POS[aktif] : TITIK_HARTA;
    const r = rekap(data);
    const ruang3d = h('div', { class: 'dunia' });
    const info = h('div', { 'aria-live': 'polite' });
    const masuk = (i) => {
      if (i > aktif) {
        kosongkan(info, umpan('info', '🔒 ', `Selesaikan dulu Pos ${aktif + 1}: ${data.pos[aktif].nama}.`));
        suara.efek('salah');
        return;
      }
      suara.efek('klik');
      location.hash = `#/petualangan/${data.pos[i].id}`;
    };

    let dunia = null;
    const tombolKamera = h('button', { class: 'tombol netral', type: 'button' }, '🧭 Seluruh peta');
    let semua = false;
    tombolKamera.addEventListener('click', () => {
      semua = !semua;
      if (semua) dunia?.lihatSemua(); else dunia?.ikuti();
      tombolKamera.textContent = semua ? '🚶 Ikuti Ulfa' : '🧭 Seluruh peta';
    });

    const kartuBerikut = aktif < data.pos.length
      ? h('section', { class: 'kartu sorot' },
        h('p', { class: 'redup kecil', style: 'margin:0' }, `Pos berikutnya (${aktif + 1} dari ${data.pos.length})`),
        h('h2', {}, `${data.pos[aktif].ikon} ${data.pos[aktif].nama}`),
        h('p', { class: 'redup' }, data.pos[aktif].fokus),
        h('button', { class: 'tombol penuh', type: 'button', onclick: () => masuk(aktif) }, `Masuk Pos ${aktif + 1} ▶`))
      : h('section', { class: 'kartu sorot' }, h('h2', {}, '🏆 Semua pos terlewati!'),
        h('p', {}, 'Rakit sudah siap. Ayo buka peti harta karun di Pulau Harta!'),
        h('a', { class: 'tombol penuh', href: '#/petualangan/harta' }, 'Buka Peti Harta Karun ✨'));

    kosongkan(wadah,
      h('div', { class: 'baris antara', style: 'margin-bottom:8px' }, tombolSuara(), tombolKamera),
      ruang3d, info, kartuBerikut,
      h('section', { class: 'kartu' },
        h('h2', {}, 'Bekal skor literasi'),
        h('div', { class: 'skor-indikator' }, INDIKATOR_URUT.map((k) => batangIndikator(data.indikator[k], r.skor[k]))),
        h('p', { class: 'redup kecil' }, `Bintang pemanasan: ${'⭐'.repeat(r.bintang)} ${r.bintang}/${r.maksBintang}`)),
      h('details', {}, h('summary', {}, '📍 Daftar pos'),
        h('ul', { class: 'daftar' }, data.pos.map((p, i) => h('li', {},
          h('button', { class: 'item', type: 'button', onclick: () => masuk(i) },
            h('span', { class: 'ikon', 'aria-hidden': 'true' }, sudah.has(p.id) ? '✅' : i === aktif ? p.ikon : '🔒'),
            h('span', { class: 'isi' }, h('strong', {}, `${i + 1}. ${p.nama}`), h('span', { class: 'redup kecil' }, p.fokus))))))),
      h('p', { class: 'redup kecil', style: 'text-align:center' }, 'Ingin tantangan lain? ', h('a', { href: '#/literasi' }, '🌏 Misi Literasi tambahan')));

    if (!dukungWebGL()) {
      kosongkan(ruang3d, h('div', { class: 'dunia-cadangan' }, '🗺️ Perangkat ini tidak mendukung tampilan 3D. Gunakan tombol di bawah untuk melanjutkan perjalanan.'));
      return;
    }
    buatDunia(ruang3d, {
      daftarPos: data.pos, posAktif: aktif, selesai: sudah, diTitik: Math.min(pt.titik, tujuan), onPilihPos: masuk,
    }).then((d) => {
      dunia = d;
      if (!d) return;
      saatKeluar(() => d.hapus());
      suara.mulaiMusik();
      if (pt.titik < tujuan) {
        d.pindahKe(tujuan, () => {
          simpan.setTitikPetualangan(tujuan);
          suara.efek('pos');
          umumkan(aktif < data.pos.length ? `Ulfa tiba di ${data.pos[aktif].nama}` : 'Ulfa tiba di Pulau Harta');
        });
      }
    }).catch((e) => {
      console.warn(e);
      kosongkan(ruang3d, h('div', { class: 'dunia-cadangan' }, '🗺️ Peta 3D belum bisa ditampilkan. Gunakan tombol di bawah.'));
    });
  }

  return [h('h1', {}, '🗺️ Ekspedisi Pulau Aljabar'), wadah];
}

function batangIndikator(nama, nilai, maks = 6) {
  return h('div', { class: 'indikator' },
    h('div', { class: 'baris antara' }, h('span', { class: 'kecil' }, nama), h('strong', {}, `${nilai}/${maks}`)),
    h('div', { class: 'batang', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': maks, 'aria-valuenow': nilai, 'aria-label': nama },
      h('i', { style: `width:${(nilai / maks) * 100}%` })));
}

// ===================================================================== POS
function teraBatu(item, onSelesai) {
  const info = INFO_SIMBOL[item.rel];
  const terpilih = new Set();
  let salahDulu = false;
  const hasil = h('div', { 'aria-live': 'polite' });
  const tombol = item.batu.map((n) => {
    const b = h('button', {
      type: 'button', class: 'batu', 'aria-pressed': 'false', 'aria-label': `batu ${n}`,
      onclick: () => {
        if (terpilih.has(n)) terpilih.delete(n); else terpilih.add(n);
        b.setAttribute('aria-pressed', String(terpilih.has(n)));
        suara.efek('klik');
      },
    }, n < 0 ? `−${-n}` : String(n));
    return b;
  });
  const aman = (n) => ({ '<': n < item.nilai, '>': n > item.nilai, '<=': n <= item.nilai, '>=': n >= item.nilai }[item.rel]);
  const periksa = h('button', {
    class: 'tombol penuh', type: 'button',
    onclick: () => {
      const salahPilih = [...terpilih].filter((n) => !aman(n));
      const terlewat = item.batu.filter((n) => aman(n) && !terpilih.has(n));
      if (!salahPilih.length && !terlewat.length) {
        tombol.forEach((t) => { t.disabled = true; });
        periksa.disabled = true;
        suara.efek('benar');
        kosongkan(hasil, umpan('benar', '✓ Semua batu aman! ', `x ${info.simbol} ${item.nilai} berarti ${info.baca} ${item.nilai}.`),
          garisBilangan({ rel: item.rel, nilai: item.nilai }));
        onSelesai(!salahDulu);
        return;
      }
      salahDulu = true;
      suara.efek('salah');
      const pesan = [];
      if (salahPilih.length) pesan.push(`Batu ${salahPilih.map(String).join(', ').replace(/-/g, '−')} tidak aman, karena tidak ${info.baca} ${item.nilai}.`);
      if (terlewat.length) pesan.push('Masih ada batu aman yang belum dipilih.');
      kosongkan(hasil, umpan('salah', 'Hampir! ', pesan.join(' ')));
    },
  }, 'Periksa langkahku');
  return h('div', {}, h('p', {}, h('strong', {}, item.tanya)), h('div', { class: 'batu-sungai' }, tombol), periksa, hasil);
}

export function halamanPos(id) {
  const wadah = h('div', {}, h('p', { class: 'redup' }, 'Memuat pos…'));
  const judul = h('h1', {}, 'Pos');
  saatKeluar(() => suara.hentikanBicara());

  muatJson(DATA).then((data) => {
    const i = data.pos.findIndex((p) => p.id === id);
    if (i < 0) { kosongkan(wadah, h('p', {}, 'Pos tidak ditemukan.')); return; }
    const pos = data.pos[i];
    judul.textContent = `${pos.ikon} Pos ${i + 1}: ${pos.nama}`;
    if (i > posAktif(data)) {
      kosongkan(wadah, umpan('info', '🔒 ', 'Pos ini masih terkunci. Selesaikan pos sebelumnya dulu.'), h('a', { class: 'tombol penuh', href: '#/petualangan' }, 'Kembali ke peta'));
      return;
    }
    jalankan(data, pos, i);
  }).catch(() => kosongkan(wadah, umpan('salah', '', 'Pos belum bisa dimuat.')));

  function jalankan(data, pos, iPos) {
    const skor = {};
    let bintang = 0;
    let k = -1; // -1 = narasi

    function tampil() {
      window.scrollTo({ top: 0 });
      if (k === -1) {
        kosongkan(wadah,
          h('p', { class: 'redup', style: 'margin-top:0' }, pos.fokus),
          h('section', { class: 'kartu' }, percakapan(pos.narasi)),
          h('button', { class: 'tombol penuh', type: 'button', onclick: () => { suara.hentikanBicara(); k = 0; tampil(); } }, 'Mulai teka-teki ▶'));
        return;
      }
      if (k >= pos.teka.length) { akhir(); return; }
      const t = pos.teka[k];
      const lanjut = h('button', { class: 'tombol penuh', type: 'button', disabled: true, onclick: () => { k += 1; tampil(); } },
        k === pos.teka.length - 1 ? 'Selesaikan pos ✓' : 'Teka-teki berikutnya →');
      const beri = (pertama) => {
        if (pertama) {
          for (const [ind, n] of Object.entries(t.skor || {})) skor[ind] = (skor[ind] || 0) + n;
          bintang += t.bintang || 0;
        }
        suara.efek('benar');
        lanjut.disabled = false;
      };
      let isi;
      if (t.jenis === 'pilihan') {
        isi = buatPilihan({ tanya: t.tanya, pilihan: t.pilihan, benar: t.benar, penjelasan: t.penjelasan, umpanSalah: t.umpan || [], onBenar: beri, onSalah: () => suara.efek('salah') });
      } else if (t.jenis === 'langkah') {
        isi = h('div', {}, h('p', {}, h('strong', {}, 'Selesaikan langkah demi langkah untuk membuka jalan:')),
          buatPengerja({ soal: t.soal, onSelesai: (r) => beri(r.benar) }));
      } else {
        isi = teraBatu(t, beri);
      }
      kosongkan(wadah,
        h('div', { class: 'titik-progres', 'aria-hidden': 'true' }, pos.teka.map((_, j) => h('i', { class: j === k ? 'aktif' : j < k ? 'lewat' : '' }))),
        h('p', { class: 'redup kecil', style: 'text-align:center;margin:0 0 8px' }, `Teka-teki ${k + 1} dari ${pos.teka.length}`),
        t.jenis === 'langkah' ? isi : h('section', { class: 'kartu' }, isi),
        lanjut);
    }

    function akhir() {
      simpan.catatPos(pos.id, { skor, bintang });
      suara.efek('pos');
      const dapat = Object.entries(skor).filter(([, n]) => n > 0);
      const maks = {};
      pos.teka.forEach((t) => Object.entries(t.skor || {}).forEach(([ind, n]) => { maks[ind] = (maks[ind] || 0) + n; }));
      const maksBintang = pos.teka.reduce((a, t) => a + (t.bintang || 0), 0);
      const terakhir = iPos === data.pos.length - 1;
      kosongkan(wadah,
        h('section', { class: 'kartu', style: 'text-align:center' },
          h('div', { style: 'font-size:3rem', 'aria-hidden': 'true' }, '🎉'),
          h('h2', {}, `${pos.nama} terlewati!`),
          Object.keys(maks).length
            ? h('ul', { class: 'daftar', style: 'text-align:left' }, Object.keys(maks).map((ind) => h('li', { style: 'padding:4px 0' },
              `${data.indikator[ind]}: `, h('strong', {}, `+${skor[ind] || 0} dari ${maks[ind]}`))))
            : null,
          maksBintang ? h('p', {}, `Bintang: ${'⭐'.repeat(bintang)} ${bintang}/${maksBintang}`) : null,
          dapat.length === 0 && Object.keys(maks).length ? h('p', { class: 'redup kecil' }, 'Poin diberikan untuk jawaban benar pada percobaan pertama. Kamu boleh mengulang pos ini nanti.') : null,
          percakapan([{ siapa: 'lino', teks: terakhir ? 'Rakit siap! Pulau Harta sudah di depan mata!' : `Jalan ke ${data.pos[iPos + 1].nama} sudah terbuka. Ayo lanjut!` }])),
        h('a', { class: 'tombol penuh', href: '#/petualangan' }, terakhir ? 'Naik rakit ke Pulau Harta ⛵' : 'Kembali ke peta 🗺️'));
    }
    tampil();
  }

  return [h('p', { style: 'margin:0' }, h('a', { href: '#/petualangan' }, '← Peta')), judul, wadah];
}

// =================================================================== HARTA
export function halamanHarta() {
  const wadah = h('div', {}, h('p', { class: 'redup' }, 'Memuat Pulau Harta…'));
  saatKeluar(() => { suara.hentikanBicara(); suara.hentikanMusik(); });
  muatJson(DATA).then((data) => {
    if (posAktif(data) < data.pos.length) {
      kosongkan(wadah, umpan('info', '🔒 ', 'Peti harta masih terkunci. Lewati semua pos terlebih dahulu.'), h('a', { class: 'tombol penuh', href: '#/petualangan' }, 'Kembali ke peta'));
      return;
    }
    const ruang3d = h('div', { class: 'dunia' });
    const hasil = h('div', { 'aria-live': 'polite' });
    const buka = h('button', { class: 'tombol penuh', type: 'button' }, 'Buka Peti! 🗝️');
    let dunia = null;
    const tampilSertifikat = () => {
      suara.efek('harta');
      kosongkan(hasil, h('section', { class: 'kartu' }, percakapan(data.penutup)), sertifikat(data));
    };
    buka.addEventListener('click', () => {
      buka.hidden = true;
      if (dunia) dunia.bukaPeti(tampilSertifikat); else tampilSertifikat();
    });
    kosongkan(wadah, ruang3d, buka, hasil);
    if (dukungWebGL()) {
      buatDunia(ruang3d, {
        daftarPos: data.pos, posAktif: data.pos.length, selesai: new Set(data.pos.map((p) => p.id)), diTitik: TITIK_HARTA, fokusHarta: true,
      }).then((d) => { dunia = d; if (d) saatKeluar(() => d.hapus()); }).catch(() => ruang3d.remove());
    } else {
      ruang3d.remove();
    }
  }).catch(() => kosongkan(wadah, umpan('salah', '', 'Data petualangan belum bisa dimuat.')));
  return [h('p', { style: 'margin:0' }, h('a', { href: '#/petualangan' }, '← Peta')), h('h1', {}, '🏆 Pulau Harta'), wadah];
}

function kategori(total) {
  if (total >= 21) return 'Sangat Baik';
  if (total >= 16) return 'Baik';
  if (total >= 11) return 'Cukup';
  return 'Perlu Berlatih';
}

function sertifikat(data) {
  const r = rekap(data);
  const nama = simpan.ambil().profil?.nama || 'Penjelajah';
  return h('section', { class: 'kartu sertifikat' },
    h('p', { class: 'redup kecil', style: 'margin:0;text-align:center' }, 'ULFALINE · Ekspedisi Pulau Aljabar'),
    h('h2', { style: 'text-align:center' }, '📜 Sertifikat Penjelajah Aljabar'),
    h('p', { style: 'text-align:center' }, 'Diberikan kepada ', h('strong', {}, nama)),
    h('p', { class: 'redup kecil', style: 'text-align:center' }, new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })),
    h('div', { class: 'skor-indikator' }, INDIKATOR_URUT.map((k) => batangIndikator(data.indikator[k], r.skor[k]))),
    h('div', { class: 'skor-besar' }, `${r.total}/24`),
    h('p', { style: 'text-align:center' }, `Kategori literasi: `, h('strong', {}, kategori(r.total)), ` · Bintang ${r.bintang}/${r.maksBintang}`),
    h('p', { class: 'redup kecil', style: 'text-align:center' }, 'Skor dihitung dari jawaban benar pada percobaan pertama. Ulangi pos untuk memperbaiki skormu.'),
    h('div', { class: 'tumpuk' },
      h('button', { class: 'tombol kedua penuh', type: 'button', onclick: () => window.print() }, '🖨️ Cetak / simpan sertifikat'),
      h('a', { class: 'tombol netral penuh', href: '#/petualangan' }, 'Kembali ke peta'),
      h('button', {
        class: 'tombol netral penuh', type: 'button',
        onclick: () => { if (confirm('Mulai ekspedisi dari awal? Skor petualangan akan direset.')) { simpan.ulangPetualangan(); location.hash = '#/petualangan'; } },
      }, '↻ Ulangi ekspedisi')));
}
