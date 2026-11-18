// Suara ULFALINE: semua bunyi dibuat langsung dengan Web Audio API (tanpa file audio).
// Musik latar adalah melodi ORISINAL berskala pentatonis (nuansa gamelan), bukan lagu milik pihak lain.
// Musik hanya diputar di peta, tidak saat siswa membaca teka-teki (mengurangi beban ekstrinsik, DS05).

import * as simpan from '../simpan.js';

let ctx = null;
let utama = null;
let jalurMusik = null;
let pewaktu = null;
let ketukBerikut = 0;
let indeks = 0;

const TEMPO = 100;
const SETENGAH_KETUK = 60 / TEMPO / 2;
// Melodi orisinal (nomor nada MIDI; null = diam). 32 ketukan setengah.
const MELODI = [
  76, 79, 81, 79, 76, 74, 72, 74, 76, 79, 84, 81, 79, 76, 74, null,
  74, 76, 79, 76, 74, 72, 69, 72, 74, 76, 72, 69, 67, 69, 72, null,
];
const BAS = [48, 55, 57, 55, 50, 57, 55, 48];

const nyala = (kunci) => simpan.ambil().pengaturan[kunci] !== 'mati';
const frekuensi = (midi) => 440 * 2 ** ((midi - 69) / 12);

function audio() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    utama = ctx.createGain();
    utama.gain.value = 0.5;
    utama.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function nada(midi, mulai, durasi, { tipe = 'triangle', vol = 0.22, tujuan = utama } = {}) {
  const o = ctx.createOscillator();
  const g = ctx.createGain();
  o.type = tipe;
  o.frequency.value = frekuensi(midi);
  g.gain.setValueAtTime(0.0001, mulai);
  g.gain.exponentialRampToValueAtTime(vol, mulai + 0.015);
  g.gain.exponentialRampToValueAtTime(0.0001, mulai + durasi);
  o.connect(g).connect(tujuan);
  o.start(mulai);
  o.stop(mulai + durasi + 0.05);
}

const EFEK = {
  klik: [[84, 0, 0.06, 'sine', 0.1]],
  langkah: [[67, 0, 0.09, 'sine', 0.12]],
  benar: [[76, 0, 0.16, 'triangle', 0.22], [83, 0.1, 0.28, 'triangle', 0.22]],
  salah: [[57, 0, 0.18, 'sine', 0.16], [52, 0.12, 0.3, 'sine', 0.16]],
  buka: [[60, 0, 0.2], [64, 0.08, 0.2], [67, 0.16, 0.2], [72, 0.24, 0.35]],
  pos: [[72, 0, 0.14], [76, 0.12, 0.14], [79, 0.24, 0.14], [84, 0.36, 0.5]],
  harta: [[67, 0, 0.2], [72, 0.18, 0.2], [76, 0.36, 0.2], [79, 0.54, 0.35], [76, 0.9, 0.18], [79, 1.06, 0.18], [84, 1.22, 0.8]],
};

/** Mainkan efek suara singkat: klik, langkah, benar, salah, buka, pos, harta. */
export function efek(nama) {
  if (!nyala('suara')) return;
  const a = audio();
  if (!a || !EFEK[nama]) return;
  const t = a.currentTime + 0.02;
  for (const [midi, jeda, durasi, tipe = 'triangle', vol = 0.2] of EFEK[nama]) {
    nada(midi, t + jeda, durasi, { tipe, vol });
  }
}

function jadwalkan() {
  while (ketukBerikut < ctx.currentTime + 0.25) {
    const m = MELODI[indeks % MELODI.length];
    if (m !== null) nada(m, ketukBerikut, SETENGAH_KETUK * 0.9, { tipe: 'triangle', vol: 0.09, tujuan: jalurMusik });
    if (indeks % 4 === 0) {
      nada(BAS[(indeks / 4) % BAS.length], ketukBerikut, SETENGAH_KETUK * 3.6, { tipe: 'sine', vol: 0.07, tujuan: jalurMusik });
    }
    ketukBerikut += SETENGAH_KETUK;
    indeks += 1;
  }
}

export function mulaiMusik() {
  if (pewaktu || !nyala('musik')) return;
  const a = audio();
  if (!a) return;
  jalurMusik = a.createGain();
  jalurMusik.gain.value = 0.9;
  jalurMusik.connect(utama);
  ketukBerikut = a.currentTime + 0.1;
  pewaktu = setInterval(jadwalkan, 60);
}

export function hentikanMusik() {
  if (pewaktu) clearInterval(pewaktu);
  pewaktu = null;
  if (jalurMusik && ctx) {
    jalurMusik.gain.setTargetAtTime(0.0001, ctx.currentTime, 0.05);
    const j = jalurMusik;
    setTimeout(() => j.disconnect(), 300);
  }
  jalurMusik = null;
}

export const musikBerjalan = () => pewaktu !== null;

// ------------------------------------------------------------- lagu ekspedisi
// Lagu ORISINAL ULFALINE (melodi & lirik ciptaan sendiri). 8 baris × 8 nada.
export const LAGU = [
  { lirik: 'Ayo, ayo, kita berangkat,', nada: [67, 67, 69, 67, 72, 71, 69, 67] },
  { lirik: 'peta di tangan, semangat!', nada: [65, 65, 67, 65, 69, 67, 65, 64] },
  { lirik: 'Kedua ruas harus seimbang,', nada: [64, 67, 72, 72, 71, 69, 67, 69] },
  { lirik: 'x sendirian, kita menang!', nada: [67, 69, 71, 72, 74, 72, 71, 72] },
  { lirik: 'Kali, bagi bilangan negatif,', nada: [76, 76, 74, 72, 74, 72, 71, 69] },
  { lirik: 'tanda dibalik, jangan lupa!', nada: [69, 71, 72, 69, 67, 65, 64, 62] },
  { lirik: 'Ulfa dan Lino penjelajah,', nada: [67, 72, 67, 72, 76, 74, 72, 71] },
  { lirik: 'harta karun menanti kita!', nada: [72, 74, 76, 77, 76, 74, 72, 72] },
];
const AKOR = [48, 53, 48, 55, 57, 50, 52, 48];
const KETUK_LAGU = 60 / 112 / 2;

/**
 * Memutar Lagu Ekspedisi. onBaris(i) dipanggil saat baris ke-i dimulai (untuk lirik karaoke).
 * Mengembalikan fungsi untuk menghentikan lagu.
 */
export function nyanyikan(onBaris, onSelesai) {
  const a = audio();
  if (!a) { onSelesai?.(); return () => {}; }
  hentikanMusik();
  const jalur = a.createGain();
  jalur.gain.value = 1;
  jalur.connect(utama);
  const mulai = a.currentTime + 0.15;
  const panjangBaris = KETUK_LAGU * 10;
  const pewaktuBaris = [];
  LAGU.forEach((b, i) => {
    const t0 = mulai + i * panjangBaris;
    b.nada.forEach((m, j) => {
      const dur = j === 7 ? KETUK_LAGU * 2.6 : KETUK_LAGU * 0.92;
      nada(m, t0 + j * KETUK_LAGU, dur, { tipe: 'triangle', vol: 0.2, tujuan: jalur });
    });
    nada(AKOR[i], t0, panjangBaris * 0.95, { tipe: 'sine', vol: 0.1, tujuan: jalur });
    nada(AKOR[i] + 7, t0 + KETUK_LAGU * 4, panjangBaris * 0.5, { tipe: 'sine', vol: 0.06, tujuan: jalur });
    pewaktuBaris.push(setTimeout(() => onBaris?.(i), (t0 - a.currentTime) * 1000));
  });
  const akhir = setTimeout(() => { jalur.disconnect(); onSelesai?.(); }, (mulai - a.currentTime + LAGU.length * panjangBaris) * 1000);
  return () => {
    pewaktuBaris.forEach(clearTimeout);
    clearTimeout(akhir);
    jalur.gain.setTargetAtTime(0.0001, a.currentTime, 0.05);
    setTimeout(() => jalur.disconnect(), 300);
  };
}

// ------------------------------------------------------------------ narasi
export const bisaBicara = () => 'speechSynthesis' in window;

/** Membacakan teks dengan suara bahasa Indonesia (jika tersedia di perangkat). */
export function bicara(teks) {
  if (!bisaBicara()) return;
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(teks.replace(/−/g, 'minus ').replace(/≤/g, ' kurang dari atau sama dengan ').replace(/≥/g, ' lebih dari atau sama dengan '));
  u.lang = 'id-ID';
  u.rate = 0.95;
  const suara = window.speechSynthesis.getVoices().find((v) => v.lang && v.lang.toLowerCase().startsWith('id'));
  if (suara) u.voice = suara;
  window.speechSynthesis.speak(u);
}

export function hentikanBicara() {
  if (bisaBicara()) window.speechSynthesis.cancel();
}
