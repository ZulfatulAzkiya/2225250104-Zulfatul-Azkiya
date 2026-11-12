// Mesin aljabar ULFALINE (JavaScript).
// Cermin 1:1 dari backend/app/services/{aljabar,operasi,pemeriksa}.py.
// Kesetaraannya diuji oleh backend/tests/test_paritas_js.py — jika mengubah
// logika di sini, ubah juga versi Python-nya (dan sebaliknya).
// File ini sengaja tanpa `import` agar bisa diuji langsung di mesin V8.

// ------------------------------------------------------------ bilangan pecahan
function fpb(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}
function kpk2(a, b) { return (a / fpb(a, b)) * b; }

export class Q {
  constructor(n, d = 1) {
    if (d === 0) throw new GalatBentuk('Tidak boleh membagi dengan nol.');
    if (d < 0) { n = -n; d = -d; }
    const g = fpb(n, d) || 1;
    this.n = n / g; this.d = d / g;
  }
  static dari(v) { return v instanceof Q ? v : Q.teks(String(v)); }
  static teks(s) {
    const m = /^(-?)(\d+)(?:\.(\d+))?(?:\/(\d+))?$/.exec(s);
    if (!m) throw new GalatBentuk('Penulisan bilangan tidak dikenal.');
    const neg = m[1] === '-' ? -1 : 1;
    if (m[4]) return new Q(neg * parseInt(m[2], 10), parseInt(m[4], 10));
    const pecahan = m[3] || '';
    return new Q(neg * parseInt(m[2] + pecahan, 10), 10 ** pecahan.length);
  }
  tambah(o) { return new Q(this.n * o.d + o.n * this.d, this.d * o.d); }
  kurang(o) { return new Q(this.n * o.d - o.n * this.d, this.d * o.d); }
  kali(o) { return new Q(this.n * o.n, this.d * o.d); }
  bagi(o) { return new Q(this.n * o.d, this.d * o.n); }
  neg() { return new Q(-this.n, this.d); }
  abs() { return new Q(Math.abs(this.n), this.d); }
  sama(o) { return this.n === o.n && this.d === o.d; }
  banding(o) { return Math.sign(this.n * o.d - o.n * this.d); }
  nol() { return this.n === 0; }
  satu() { return this.n === 1 && this.d === 1; }
  negatif() { return this.n < 0; }
  toString() { return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`; }
}
const NOL = new Q(0), SATU = new Q(1), MIN_SATU = new Q(-1);

export class GalatBentuk extends Error {}

// ------------------------------------------------------------------ konstanta
const MAKS_PANJANG = 120;
const RELASI = ['<=', '>=', '<', '>', '='];
export const CERMIN = { '=': '=', '<': '>', '>': '<', '<=': '>=', '>=': '<=' };
export const SIMBOL = { '=': '=', '<': '<', '>': '>', '<=': '≤', '>=': '≥' };
const POLA_SEDERHANA = new Set(['N', 'x', 'Nx', 'x/N', 'Nx/N', 'N/N']);
const GANTI = [
  ['−', '-'], ['–', '-'], ['≤', '<='], ['≥', '>='], ['×', '*'], ['·', '*'],
  ['÷', '/'], [':', '/'], [',', '.'], ['X', 'x'], ['=<', '<='], ['=>', '>='],
];

// ------------------------------------------------------------------- linear
export class Linear {
  constructor(a, b) { this.a = a; this.b = b; }
  tambah(o) { return new Linear(this.a.tambah(o.a), this.b.tambah(o.b)); }
  kurang(o) { return new Linear(this.a.kurang(o.a), this.b.kurang(o.b)); }
  kali(k) { return new Linear(this.a.kali(k), this.b.kali(k)); }
  sama(o) { return this.a.sama(o.a) && this.b.sama(o.b); }
}
const bentuk = (l, rel, r) => ({ l, rel, r });

// ------------------------------------------------------------------- parser
export function normalisasi(teks) {
  if (teks.length > MAKS_PANJANG) throw new GalatBentuk('Tulisan terlalu panjang.');
  let s = teks;
  for (const [lama, baru] of GANTI) s = s.split(lama).join(baru);
  s = s.replace(/\s+/g, '');
  if (!s) throw new GalatBentuk('Jawaban masih kosong.');
  if (!/^[0-9x+\-*/().<>=]+$/.test(s)) throw new GalatBentuk('Ada karakter yang tidak dikenal.');
  return s;
}

function tokenisasi(s) {
  const tokens = s.match(/\d+(?:\.\d+)?|<=|>=|[x+\-*/()<>=]/g) || [];
  if (tokens.join('') !== s) throw new GalatBentuk('Penulisan bilangan tidak dikenal.');
  return tokens;
}

const angka = (tok) => tok !== undefined && tok !== null && /^\d/.test(tok);

function kaliLin(p, q) {
  if (!p.a.nol() && !q.a.nol()) throw new GalatBentuk('x dikali x bukan bentuk linear.');
  return p.a.nol() ? q.kali(p.b) : p.kali(q.b);
}
function bagiLin(p, q) {
  if (!q.a.nol()) throw new GalatBentuk('Pembagian oleh x bukan bentuk linear.');
  if (q.b.nol()) throw new GalatBentuk('Tidak boleh membagi dengan nol.');
  return p.kali(SATU.bagi(q.b));
}

class Pengurai {
  constructor(tokens) { this.t = tokens; this.i = 0; this.adaKurung = false; }
  lihat() { return this.i < this.t.length ? this.t[this.i] : null; }
  ambil() {
    const tok = this.lihat();
    if (tok === null) throw new GalatBentuk('Tulisan belum lengkap.');
    this.i += 1;
    return tok;
  }
  ekspresi() {
    let [lin, info] = this.suku();
    const daftar = [info];
    while (this.lihat() === '+' || this.lihat() === '-') {
      const op = this.ambil();
      const [kanan, info2] = this.suku();
      lin = op === '+' ? lin.tambah(kanan) : lin.kurang(kanan);
      daftar.push(info2);
    }
    return [lin, daftar];
  }
  suku() {
    let [lin, pola, tanda] = this.unary();
    for (;;) {
      const tok = this.lihat();
      if (tok === '*') {
        this.ambil();
        const [k, p, t] = this.unary();
        lin = kaliLin(lin, k); pola += p; tanda += t;
      } else if (tok === '/') {
        this.ambil();
        const [k, p, t] = this.unary();
        lin = bagiLin(lin, k); pola += '/' + p; tanda += t;
      } else if (tok === 'x' || tok === '(' || angka(tok)) {
        const [k, p] = this.primer();
        lin = kaliLin(lin, k); pola += p;
      } else break;
    }
    return [lin, [pola, tanda, pola.includes('x')]];
  }
  unary() {
    let tanda = 0, negatif = false;
    while (this.lihat() === '+' || this.lihat() === '-') {
      tanda += 1;
      if (this.ambil() === '-') negatif = !negatif;
    }
    const [lin, pola] = this.primer();
    return [negatif ? lin.kali(MIN_SATU) : lin, pola, tanda];
  }
  primer() {
    const tok = this.ambil();
    if (tok === 'x') return [new Linear(SATU, NOL), 'x'];
    if (tok === '(') {
      this.adaKurung = true;
      const [lin] = this.ekspresi();
      if (this.ambil() !== ')') throw new GalatBentuk('Tanda kurung belum ditutup.');
      return [lin, 'P'];
    }
    if (angka(tok)) return [new Linear(NOL, Q.teks(tok)), 'N'];
    throw new GalatBentuk('Penulisan belum tepat.');
  }
}

function uraiRuas(tokens) {
  if (!tokens.length) throw new GalatBentuk('Salah satu ruas masih kosong.');
  const p = new Pengurai(tokens);
  const [lin, daftar] = p.ekspresi();
  if (p.lihat() !== null) throw new GalatBentuk('Penulisan belum tepat.');
  const sukuX = daftar.filter((d) => d[2]).length;
  const sukuK = daftar.length - sukuX;
  const sederhana = !p.adaKurung && sukuX <= 1 && sukuK <= 1 &&
    daftar.every(([pola, tanda]) => POLA_SEDERHANA.has(pola) && tanda <= 1);
  return { lin, sederhana, adaKurung: p.adaKurung };
}

export function uraiEkspresi(teks) {
  const tokens = tokenisasi(normalisasi(teks));
  if (tokens.some((t) => RELASI.includes(t))) {
    throw new GalatBentuk('Ruas tidak boleh berisi tanda = atau pertidaksamaan.');
  }
  return uraiRuas(tokens);
}

export function uraiKalimat(teks) {
  const tokens = tokenisasi(normalisasi(teks));
  const posisi = tokens.map((t, i) => (RELASI.includes(t) ? i : -1)).filter((i) => i >= 0);
  if (posisi.length !== 1) throw new GalatBentuk('Harus ada tepat satu tanda =, <, >, ≤, atau ≥.');
  const i = posisi[0];
  const kiri = uraiRuas(tokens.slice(0, i));
  const kanan = uraiRuas(tokens.slice(i + 1));
  return { bentuk: bentuk(kiri.lin, tokens[i], kanan.lin), sederhana: kiri.sederhana && kanan.sederhana };
}

// ------------------------------------------------------------- penyelesaian
function bandingRel(p, rel, q) {
  const c = p.banding(q);
  return { '=': c === 0, '<': c < 0, '>': c > 0, '<=': c <= 0, '>=': c >= 0 }[rel];
}

export function himpunan(b) {
  const a = b.l.a.kurang(b.r.a);
  const c = b.r.b.kurang(b.l.b);
  if (a.nol()) return bandingRel(NOL, b.rel, c) ? ['semua'] : ['kosong'];
  const rel = a.negatif() ? CERMIN[b.rel] : b.rel;
  return ['x', rel, c.bagi(a)];
}

export function samaHimpunan(h1, h2) {
  if (h1[0] !== h2[0]) return false;
  if (h1[0] !== 'x') return true;
  return h1[1] === h2[1] && h1[2].sama(h2[2]);
}

function penyebutKpk(b) {
  return [b.l.a.d, b.l.b.d, b.r.a.d, b.r.b.d].reduce(kpk2, 1);
}

// -------------------------------------------------------------------- format
export function formatBilangan(q) {
  q = Q.dari(q);
  const tanda = q.negatif() ? '−' : '';
  const m = q.abs();
  if (m.d === 1) return `${tanda}${m.n}`;
  for (let k = 1; k < 4; k++) {
    if ((10 ** k) % m.d === 0) {
      const v = (m.n * 10 ** k) / m.d;
      const bulat = Math.floor(v / 10 ** k);
      const pecahan = String(v % 10 ** k).padStart(k, '0').replace(/0+$/, '');
      return `${tanda}${bulat},${pecahan}`;
    }
  }
  return `${tanda}${m.n}/${m.d}`;
}

export function formatSukuX(m) {
  m = Q.dari(m);
  if (m.satu()) return 'x';
  if (m.d === 1) return `${m.n}x`;
  if (m.n === 1) return `x/${m.d}`;
  return `${m.n}x/${m.d}`;
}

export function formatSuku(daftar) {
  let teks = '';
  daftar.forEach(([v, jenis], i) => {
    v = Q.dari(v);
    const m = v.abs();
    const isi = jenis === 'x' ? formatSukuX(m) : formatBilangan(m);
    if (i === 0) teks = (v.negatif() ? '−' : '') + isi;
    else teks += (v.negatif() ? ' − ' : ' + ') + isi;
  });
  return teks;
}

export function formatLinear(lin) {
  const daftar = [];
  if (!lin.a.nol()) daftar.push([lin.a, 'x']);
  if (!lin.b.nol() || !daftar.length) daftar.push([lin.b, '1']);
  return formatSuku(daftar);
}

export function formatBentuk(b) {
  return `${formatLinear(b.l)} ${SIMBOL[b.rel]} ${formatLinear(b.r)}`;
}

export function formatHimpunan(h) {
  if (h[0] === 'semua') return 'semua bilangan memenuhi';
  if (h[0] === 'kosong') return 'tidak ada penyelesaian';
  return `x ${SIMBOL[h[1]]} ${formatBilangan(h[2])}`;
}

// ------------------------------------------------------------------- operasi
const INVERS = { add: 'sub', sub: 'add', mul: 'div', div: 'mul', addx: 'subx', subx: 'addx' };

export function opDariTeks(teks) {
  if (teks === 'simplify') return { jenis: 'simplify', nilai: NOL };
  const m = /^(add|sub|mul|div|addx|subx):(-?\d+(?:\/\d+)?)$/.exec(teks);
  if (!m) throw new GalatBentuk('Operasi tidak dikenal.');
  const nilai = Q.teks(m[2]);
  if ((m[1] === 'mul' || m[1] === 'div') && nilai.nol()) {
    throw new GalatBentuk('Tidak boleh mengali atau membagi dengan nol.');
  }
  return { jenis: m[1], nilai };
}
export const opTeks = (op) => (op.jenis === 'simplify' ? 'simplify' : `${op.jenis}:${op.nilai}`);
const op = (jenis, nilai = NOL) => ({ jenis, nilai: Q.dari(nilai) });
const invers = (o) => op(INVERS[o.jenis], o.nilai);

export function membalik(o, rel) {
  return rel !== '=' && (o.jenis === 'mul' || o.jenis === 'div') && o.nilai.negatif();
}

export function terapkan(b, o) {
  const { jenis: j, nilai: n } = o;
  if (j === 'simplify') return b;
  if (['add', 'sub', 'addx', 'subx'].includes(j)) {
    const v = j === 'add' || j === 'addx' ? n : n.neg();
    const d = j.endsWith('x') ? new Linear(v, NOL) : new Linear(NOL, v);
    return bentuk(b.l.tambah(d), b.rel, b.r.tambah(d));
  }
  const k = j === 'mul' ? n : SATU.bagi(n);
  const rel = membalik(o, b.rel) ? CERMIN[b.rel] : b.rel;
  return bentuk(b.l.kali(k), rel, b.r.kali(k));
}

export function selesai(b) {
  const kiri = b.l.a.satu() && b.l.b.nol() && b.r.a.nol();
  const kanan = b.r.a.satu() && b.r.b.nol() && b.l.a.nol();
  return kiri || kanan;
}

export function jarak(b, sederhana) {
  if (sederhana && selesai(b)) return 0;
  let d = 0;
  if (penyebutKpk(b) > 1) d += 1;
  if (!sederhana) d += 1;
  const n = (cond) => (cond ? 1 : 0);
  if (!b.l.a.nol() && !b.r.a.nol()) {
    d += 1 + n(!b.l.b.nol()) + n(!b.l.a.kurang(b.r.a).satu());
  } else if (!b.l.a.nol()) {
    d += n(!b.l.b.nol()) + n(!b.l.a.satu());
  } else if (!b.r.a.nol()) {
    d += n(!b.r.b.nol()) + n(!b.r.a.satu());
  }
  return d;
}

function tambahKurang(jenisX, nilai) {
  if (jenisX) return nilai.negatif() ? op('addx', nilai.neg()) : op('subx', nilai);
  return nilai.negatif() ? op('add', nilai.neg()) : op('sub', nilai);
}

export function rencana(k) {
  const b = k.bentuk;
  if (k.sederhana && selesai(b)) return null;
  const kpk = penyebutKpk(b);
  if (kpk > 1) return op('mul', new Q(kpk));
  if (!k.sederhana) return op('simplify');
  if (!b.l.a.nol() && !b.r.a.nol()) return tambahKurang(true, b.r.a);
  let sisi;
  if (!b.l.a.nol()) sisi = b.l;
  else if (!b.r.a.nol()) sisi = b.r;
  else return null;
  if (!sisi.b.nol()) return tambahKurang(false, sisi.b);
  if (!sisi.a.satu()) return op('div', sisi.a);
  return null;
}

const dalamKurung = (n) => (n.negatif() ? `(${formatBilangan(n)})` : formatBilangan(n));

export function labelOperasi(o) {
  const { jenis: j, nilai: n } = o;
  if (j === 'simplify') return 'Sederhanakan';
  let isi;
  if (j === 'add') isi = `+${dalamKurung(n)}`;
  else if (j === 'sub') isi = `−${dalamKurung(n)}`;
  else if (j === 'mul') isi = `×${dalamKurung(n)}`;
  else if (j === 'div') isi = `÷${dalamKurung(n)}`;
  else if (j === 'addx') isi = n.negatif() ? `+(−${formatSukuX(n.neg())})` : `+${formatSukuX(n)}`;
  else isi = n.negatif() ? `−(−${formatSukuX(n.neg())})` : `−${formatSukuX(n)}`;
  return `${isi} di kedua ruas`;
}

export function jelaskanOperasi(o, rel) {
  const { jenis: j, nilai: n } = o;
  const b = formatBilangan(n);
  if (j === 'simplify') return 'Sederhanakan dulu: jabarkan tanda kurung dan gabungkan suku sejenis.';
  let teks = {
    add: `Tambahkan ${b} pada kedua ruas.`,
    sub: `Kurangi kedua ruas dengan ${b}.`,
    mul: `Kalikan kedua ruas dengan ${b}.`,
    div: `Bagi kedua ruas dengan ${b}.`,
    addx: `Tambahkan ${formatSukuX(n.abs())} pada kedua ruas.`,
    subx: `Kurangi kedua ruas dengan ${formatSukuX(n.abs())}.`,
  }[j];
  if (membalik(o, rel)) teks += ' Karena dikali/dibagi bilangan negatif, tanda pertidaksamaan DIBALIK.';
  else if (rel !== '=' && (j === 'mul' || j === 'div')) teks += ' Bilangannya positif, jadi tanda tetap.';
  return teks;
}

// ------------------------------------------------------------------ pemeriksa
export const PESAN = {
  OK: 'Tepat!',
  OK_CARA_LAIN: 'Benar! Kamu memakai cara yang sedikit berbeda, dan itu boleh.',
  E_FORMAT: 'Tulisanmu belum bisa dibaca. Contoh penulisan: 2x + 3',
  E_TANDA_TIDAK_DIBALIK: 'Kamu mengali/membagi dengan bilangan NEGATIF. Tanda pertidaksamaannya perlu dibalik.',
  E_TANDA_DIBALIK_SALAH: 'Tandanya tidak perlu dibalik. Tanda hanya dibalik saat dikali/dibagi bilangan negatif.',
  E_TANDA_TERTUKAR: 'Ruasnya sudah tepat, tetapi tandanya belum. Ingat: < kurang dari, > lebih dari, ≤ dan ≥ termasuk sama dengan.',
  E_SATU_RUAS: 'Operasinya baru dilakukan di satu ruas. Ingat timbangan: lakukan di KEDUA ruas.',
  E_PINDAH_RUAS: 'Di salah satu ruas kamu memakai operasi kebalikannya. Lakukan operasi yang sama persis di kedua ruas.',
  E_HITUNG_NEGATIF: 'Hampir tepat! Ada tanda positif/negatif yang tertukar. Cek lagi hitungan bilangan negatifnya.',
  E_DISTRIBUTIF: 'Saat menjabarkan, kalikan bilangan di depan kurung ke SETIAP suku di dalam kurung.',
  E_HITUNG: 'Hasilnya belum tepat. Cek lagi perhitungannya pelan-pelan.',
  E_BELUM_DIOPERASIKAN: 'Bentuknya masih sama seperti sebelumnya. Terapkan dulu operasinya.',
  E_BELUM_SEDERHANA: 'Masih ada tanda kurung atau suku sejenis. Sederhanakan dulu.',
  E_TIDAK_MAJU: 'Bentuknya setara, tetapi belum lebih sederhana. Coba lagi.',
};

export const LABEL_KESALAHAN = {
  E_TANDA_TIDAK_DIBALIK: 'Lupa membalik tanda',
  E_TANDA_DIBALIK_SALAH: 'Membalik tanda padahal tidak perlu',
  E_TANDA_TERTUKAR: 'Simbol pertidaksamaan tertukar',
  E_SATU_RUAS: 'Operasi hanya di satu ruas',
  E_PINDAH_RUAS: 'Operasi berlawanan di salah satu ruas',
  E_HITUNG_NEGATIF: 'Salah tanda bilangan negatif',
  E_DISTRIBUTIF: 'Penjabaran kurung belum lengkap',
  E_HITUNG: 'Salah hitung',
  E_FORMAT: 'Penulisan belum tepat',
  E_BELUM_DIOPERASIKAN: 'Operasi belum diterapkan',
  E_BELUM_SEDERHANA: 'Belum disederhanakan',
  E_TIDAK_MAJU: 'Langkah belum maju',
  E_OPERASI_KURANG_TEPAT: 'Pilihan operasi kurang tepat',
};

function orientasi(s, e) {
  if (s.l.sama(e.l) && s.r.sama(e.r)) return 'lurus';
  if (s.l.sama(e.r) && s.r.sama(e.l)) return 'tukar';
  return null;
}

export function cocokStruktur(s, e) {
  const o = orientasi(s, e);
  if (o === 'lurus') return s.rel === e.rel;
  if (o === 'tukar') return CERMIN[s.rel] === e.rel;
  return false;
}

const samaMutlak = (p, q) => p.a.abs().sama(q.a.abs()) && p.b.abs().sama(q.b.abs());

function klasifikasi(k, o, e, s, adaKurung) {
  const ori = orientasi(s, e);
  if (ori) {
    const relS = ori === 'lurus' ? s.rel : CERMIN[s.rel];
    if (e.rel !== '=') {
      if (membalik(o, k.rel) && relS === k.rel) return 'E_TANDA_TIDAK_DIBALIK';
      if (!membalik(o, k.rel) && relS === CERMIN[e.rel]) return 'E_TANDA_DIBALIK_SALAH';
    }
    return 'E_TANDA_TERTUKAR';
  }
  if (o.jenis !== 'simplify') {
    if ((s.l.sama(e.l) && s.r.sama(k.r)) || (s.l.sama(k.l) && s.r.sama(e.r))) return 'E_SATU_RUAS';
    const b = terapkan(k, invers(o));
    if ((s.l.sama(e.l) && s.r.sama(b.r)) || (s.l.sama(b.l) && s.r.sama(e.r))) return 'E_PINDAH_RUAS';
  }
  if ((samaMutlak(s.l, e.l) && samaMutlak(s.r, e.r)) || (samaMutlak(s.l, e.r) && samaMutlak(s.r, e.l))) {
    return 'E_HITUNG_NEGATIF';
  }
  if (o.jenis === 'simplify' && adaKurung) return 'E_DISTRIBUTIF';
  return 'E_HITUNG';
}

function pesanOperasi(o, saran) {
  const js = saran.jenis;
  if (js === 'mul') return 'Ada pecahan. Hilangkan dulu pecahannya dengan mengalikan penyebutnya.';
  if (js === 'simplify') return 'Sederhanakan dulu: jabarkan tanda kurung dan gabungkan suku sejenis.';
  if (js === 'addx' || js === 'subx') return 'x masih ada di kedua ruas. Kumpulkan dulu suku x di satu ruas.';
  if (js === 'add' || js === 'sub') {
    if (o.jenis === 'mul' || o.jenis === 'div') {
      return 'Boleh saja, tetapi nanti muncul pecahan. Lebih mudah hilangkan konstantanya dulu.';
    }
    return 'Operasi ini belum menghilangkan bilangan di ruas x. Gunakan kebalikan dari bilangan tersebut.';
  }
  if (o.jenis === 'div' && o.nilai.sama(saran.nilai.neg())) {
    return `Masih tersisa −x. Bagi dengan koefisien x beserta tandanya (${formatBilangan(saran.nilai)}).`;
  }
  if (o.jenis === 'mul' && o.nilai.sama(saran.nilai)) {
    return `x sedang dikali ${formatBilangan(saran.nilai)}. Kebalikan dari perkalian adalah pembagian.`;
  }
  return 'Pilih operasi yang membuat koefisien x menjadi 1.';
}

export function periksaOperasi(sebelum, opT) {
  const k = uraiKalimat(sebelum);
  const o = opDariTeks(opT);
  const saran = rencana(k);
  if (saran === null) return { ok: false, kode: 'SUDAH_SELESAI', pesan: 'x sudah sendirian. Soal selesai!' };
  const maju = o.jenis === 'simplify'
    ? !k.sederhana
    : jarak(terapkan(k.bentuk, o), k.sederhana) < jarak(k.bentuk, k.sederhana);
  if (maju) {
    const pesan = membalik(o, k.bentuk.rel)
      ? 'Tepat! Hati-hati: kamu akan mengali/membagi dengan bilangan negatif.'
      : PESAN.OK;
    return { ok: true, kode: 'OK', pesan };
  }
  return { ok: false, kode: 'E_OPERASI_KURANG_TEPAT', pesan: pesanOperasi(o, saran) };
}

export function periksaLangkah(sebelum, opT, jawaban) {
  const k = uraiKalimat(sebelum);
  const o = opDariTeks(opT);
  const e = terapkan(k.bentuk, o);
  const hasil = { harapan: formatBentuk(e), selesai: false, cara_lain: false };
  let sk;
  try {
    sk = uraiKalimat(jawaban);
  } catch (g) {
    if (!(g instanceof GalatBentuk)) throw g;
    return { ...hasil, ok: false, kode: 'E_FORMAT', pesan: `${PESAN.E_FORMAT} (${g.message})` };
  }
  const s = sk.bentuk;
  const benar = (kode, caraLain = false) => ({
    ...hasil, ok: true, kode, pesan: PESAN[kode], selesai: selesai(s) && sk.sederhana, cara_lain: caraLain,
  });
  const salah = (kode) => ({ ...hasil, ok: false, kode, pesan: PESAN[kode] });

  if (cocokStruktur(s, e)) {
    if (o.jenis === 'simplify' && !sk.sederhana) return salah('E_BELUM_SEDERHANA');
    return benar('OK');
  }
  if (samaHimpunan(himpunan(s), himpunan(k.bentuk))) {
    if (cocokStruktur(s, k.bentuk)) return salah('E_BELUM_DIOPERASIKAN');
    if (jarak(s, sk.sederhana) < jarak(k.bentuk, k.sederhana)) return benar('OK_CARA_LAIN', true);
    return salah('E_TIDAK_MAJU');
  }
  return salah(klasifikasi(k.bentuk, o, e, s, sebelum.includes('(')));
}

export function pilihanOperasi(sebelum, acak = Math.random) {
  const k = uraiKalimat(sebelum);
  const saran = rencana(k);
  if (saran === null) return [];
  const b = k.bentuk;
  const a = (!b.l.a.nol() ? b.l : b.r).a;
  const n = saran.nilai;
  const calon = [];
  if (saran.jenis === 'add' || saran.jenis === 'sub') {
    calon.push(op(saran.jenis === 'add' ? 'sub' : 'add', n));
    if (!a.nol() && !a.abs().satu()) calon.push(op('div', a), op('mul', a.abs()));
  } else if (saran.jenis === 'div') {
    calon.push(op('mul', n));
    if (!n.abs().satu()) calon.push(op('div', n.neg()));
    calon.push(op('sub', n.abs()));
  } else if (saran.jenis === 'addx' || saran.jenis === 'subx') {
    calon.push(op(saran.jenis === 'addx' ? 'subx' : 'addx', n), op('sub', n));
  } else if (saran.jenis === 'mul') {
    calon.push(op('div', n), op('add', n));
  }
  calon.push(op('mul', MIN_SATU), op('add', SATU), op('mul', new Q(2)));

  const pilihan = [opTeks(saran)];
  for (const c of calon) {
    const t = opTeks(c);
    if (pilihan.includes(t)) continue;
    if (!periksaOperasi(sebelum, t).ok) pilihan.push(t);
    if (pilihan.length === 3) break;
  }
  for (let i = pilihan.length - 1; i > 0; i--) {
    const j = Math.floor(acak() * (i + 1));
    [pilihan[i], pilihan[j]] = [pilihan[j], pilihan[i]];
  }
  return pilihan;
}

export function petunjuk(sebelum, tingkat) {
  const k = uraiKalimat(sebelum);
  const saran = rencana(k);
  if (saran === null) return 'x sudah sendirian. Soal selesai!';
  if (tingkat >= 3) return `Hasil langkah ini: ${formatBentuk(terapkan(k.bentuk, saran))}`;
  if (tingkat === 2) {
    return `Gunakan operasi: ${labelOperasi(saran)}. ${jelaskanOperasi(saran, k.bentuk.rel)}`;
  }
  let umum = {
    mul: 'Ada pecahan. Bagaimana cara menghilangkan penyebutnya?',
    simplify: 'Ada tanda kurung atau suku sejenis. Rapikan dulu bentuknya.',
    addx: 'x ada di kedua ruas. Kumpulkan suku x di satu ruas.',
    subx: 'x ada di kedua ruas. Kumpulkan suku x di satu ruas.',
    add: 'Tujuanmu: x sendirian. Bilangan apa yang masih menempel di ruas x?',
    sub: 'Tujuanmu: x sendirian. Bilangan apa yang masih menempel di ruas x?',
    div: 'x masih dikali sebuah bilangan. Apa kebalikan dari perkalian?',
  }[saran.jenis];
  if (membalik(saran, k.bentuk.rel)) umum += ' Perhatikan tanda bilangannya!';
  return umum;
}

export function selesaikan(soal) {
  let k = uraiKalimat(soal);
  const langkah = [];
  let sekarang = soal;
  for (let i = 0; i < 10; i++) {
    const o = rencana(k);
    if (o === null) {
      return { soal, langkah, jawaban: formatHimpunan(himpunan(k.bentuk)) };
    }
    const berikut = formatBentuk(terapkan(k.bentuk, o));
    langkah.push({
      sebelum: sekarang,
      operasi: opTeks(o),
      label: labelOperasi(o),
      penjelasan: jelaskanOperasi(o, k.bentuk.rel),
      hasil: berikut,
      balik: membalik(o, k.bentuk.rel),
    });
    sekarang = berikut;
    k = uraiKalimat(berikut);
  }
  throw new Error('Penyelesaian tidak berhenti');
}

/** Relasi dari sebuah soal ("=", "<", ...). */
export function relasiSoal(teks) {
  return uraiKalimat(teks).bentuk.rel;
}

/** Label operasi dari teks operasi, untuk tombol. */
export function labelDariTeks(teks) {
  return labelOperasi(opDariTeks(teks));
}
