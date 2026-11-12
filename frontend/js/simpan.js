// Penyimpanan progres di perangkat (localStorage). Data hanya ada di HP/laptop siswa.
// Semua akses dibungkus try/catch: aplikasi tetap jalan walau penyimpanan diblokir.

const KUNCI = 'ulfaline:v1';
const LEVEL = ['dasar', 'menengah', 'tantangan'];
export const AMBANG_KUASAI = 80;

function awal() {
  return {
    versi: 1,
    profil: null,
    pengaturan: { teks: 'normal', gerak: 'normal', tema: 'otomatis' },
    prasyarat: null,
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
    return { ...awal(), ...JSON.parse(mentah) };
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
