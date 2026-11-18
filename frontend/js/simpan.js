// Penyimpanan progres di perangkat (localStorage). Data hanya ada di HP/laptop siswa.
// Semua akses dibungkus try/catch: aplikasi tetap jalan walau penyimpanan diblokir.

const KUNCI = 'ulfaline:v1';
const LEVEL = ['dasar', 'menengah', 'tantangan'];
export const AMBANG_KUASAI = 80;

function awal() {
  return {
    versi: 1,
    profil: null,
    pengaturan: { teks: 'normal', gerak: 'normal', tema: 'otomatis', suara: 'nyala', musik: 'nyala' },
    prasyarat: null,
    petualangan: { pembuka: false, pos: {}, titik: 0 },
    topik: {},
    latihan: {},
    literasi: {},
    sesi: [],
  };
}

let data = muat();

function muat() {
  try {
    const mentah = localStorage.getItem(KUNCI);
    if (!mentah) return awal();
    const d = JSON.parse(mentah);
    const a = awal();
    return { ...a, ...d, pengaturan: { ...a.pengaturan, ...d.pengaturan }, petualangan: { ...a.petualangan, ...d.petualangan } };
  } catch {
    return awal();
  }
}

function tulis() {
  try { localStorage.setItem(KUNCI, JSON.stringify(data)); } catch { /* penyimpanan penuh/diblokir */ }
}

export const ambil = () => data;

export function setProfil(profil) { data.profil = profil; tulis(); }

export function setPengaturan(ubah) {
  data.pengaturan = { ...data.pengaturan, ...ubah };
  tulis();
  terapkanPengaturan();
}

export function terapkanPengaturan() {
  const r = document.documentElement;
  const p = data.pengaturan;
  r.dataset.teks = p.teks;
  r.dataset.gerak = p.gerak;
  if (p.tema === 'otomatis') delete r.dataset.tema; else r.dataset.tema = p.tema;
}

export const gerakDikurangi = () =>
  data.pengaturan.gerak === 'kurang' || window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function catatKartu(idTopik, indeks, total) {
  const t = data.topik[idTopik] || { kartu: 0, dipelajari: false };
  t.kartu = indeks;
  if (indeks >= total - 1) t.dipelajari = true;
  data.topik[idTopik] = t;
  tulis();
}

export function catatPrasyarat(hasil) { data.prasyarat = hasil; tulis(); }

function catatSesi(sesi) {
  data.sesi.unshift({ waktu: Date.now(), ...sesi });
  data.sesi = data.sesi.slice(0, 100);
}

export function catatLatihan(topik, level, ringkasan) {
  const kunci = `${topik}-${level}`;
  const l = data.latihan[kunci] || { terbaik: 0, dikuasai: false, kali: 0 };
  l.terbaik = Math.max(l.terbaik, ringkasan.skor);
  l.kali += 1;
  if (ringkasan.skor >= AMBANG_KUASAI) l.dikuasai = true;
  data.latihan[kunci] = l;
  catatSesi({ jenis: 'latihan', topik, level, ...ringkasan });
  tulis();
  return l;
}

export function catatLiterasi(id, ringkasan) {
  const l = data.literasi[id] || { terbaik: 0, kali: 0 };
  l.terbaik = Math.max(l.terbaik, ringkasan.skor);
  l.kali += 1;
  data.literasi[id] = l;
  catatSesi({ jenis: 'literasi', topik: id, ...ringkasan });
  tulis();
}

// ------------------------------------------------------------ petualangan
export const petualangan = () => data.petualangan;

export function setPembukaDilihat() { data.petualangan.pembuka = true; tulis(); }

/** Simpan hasil sebuah pos; skor per indikator diambil yang terbaik. */
export function catatPos(id, hasil) {
  const lama = data.petualangan.pos[id];
  const skor = { ...hasil.skor };
  if (lama) for (const [k, v] of Object.entries(lama.skor || {})) skor[k] = Math.max(v, skor[k] || 0);
  data.petualangan.pos[id] = { selesai: true, skor, bintang: Math.max(hasil.bintang, lama?.bintang || 0), kali: (lama?.kali || 0) + 1 };
  tulis();
}

/** Posisi Ulfa di jalan (indeks titik). */
export function setTitikPetualangan(titik) { data.petualangan.titik = titik; tulis(); }

export function ulangPetualangan() { data.petualangan = { pembuka: true, pos: {}, titik: 0 }; tulis(); }

export const infoLatihan = (topik, level) => data.latihan[`${topik}-${level}`] || null;

/** Level terbuka jika level sebelumnya sudah dikuasai (GL04). */
export function levelTerbuka(topik, level) {
  const i = LEVEL.indexOf(level);
  return i <= 0 || Boolean(infoLatihan(topik, LEVEL[i - 1])?.dikuasai);
}

export function levelBerikut(level) {
  const i = LEVEL.indexOf(level);
  return i >= 0 && i < LEVEL.length - 1 ? LEVEL[i + 1] : null;
}

/** Jumlah tiap jenis kesalahan dari semua sesi. */
export function rekapKesalahan() {
  const total = {};
  for (const s of data.sesi) {
    for (const [kode, n] of Object.entries(s.kesalahan || {})) total[kode] = (total[kode] || 0) + n;
  }
  return Object.entries(total).sort((a, b) => b[1] - a[1]);
}

export function hapusSemua() {
  data = awal();
  try { localStorage.removeItem(KUNCI); } catch { /* abaikan */ }
  terapkanPengaturan();
}
