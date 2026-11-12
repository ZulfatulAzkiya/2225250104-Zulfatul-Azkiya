// Helper tampilan kecil tanpa framework.

/** Membuat elemen: h('button', {class: 'tombol', onclick}, 'Teks', anak, ...). */
export function h(tag, atribut = {}, ...anak) {
  const el = document.createElement(tag);
  for (const [k, v] of Object.entries(atribut || {})) {
    if (v === undefined || v === null || v === false) continue;
    if (k.startsWith('on') && typeof v === 'function') el.addEventListener(k.slice(2), v);
    else if (k === 'class') el.className = v;
    else if (k === 'html') throw new Error('Jangan memakai innerHTML');
    else if (v === true) el.setAttribute(k, '');
    else el.setAttribute(k, String(v));
  }
  tambah(el, anak);
  return el;
}

function tambah(el, anak) {
  for (const a of anak.flat(Infinity)) {
    if (a === null || a === undefined || a === false) continue;
    el.append(a instanceof Node ? a : document.createTextNode(String(a)));
  }
}

/** Elemen SVG. */
export function s(tag, atribut = {}, ...anak) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(atribut)) {
    if (v !== undefined && v !== null && v !== false) el.setAttribute(k, String(v));
  }
  tambah(el, anak);
  return el;
}

/** Teks matematika: huruf x ditampilkan miring & berwarna (signaling variabel). */
export function mat(teks, kelas = 'mat') {
  const el = h('span', { class: kelas });
  const bagian = String(teks).split('x');
  bagian.forEach((b, i) => {
    if (b) el.append(document.createTextNode(b));
    if (i < bagian.length - 1) el.append(h('var', {}, 'x'));
  });
  el.setAttribute('aria-label', bacaMat(teks));
  return el;
}

/** Teks alternatif untuk pembaca layar, mis. "minus dua x lebih dari empat". */
export function bacaMat(teks) {
  return String(teks)
    .replace(/≤/g, ' kurang dari atau sama dengan ')
    .replace(/≥/g, ' lebih dari atau sama dengan ')
    .replace(/</g, ' kurang dari ')
    .replace(/>/g, ' lebih dari ')
    .replace(/=/g, ' sama dengan ')
    .replace(/−/g, ' minus ')
    .replace(/÷/g, ' dibagi ')
    .replace(/×/g, ' kali ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function acak(daftar) {
  const a = [...daftar];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Umumkan pesan ke pembaca layar. */
export function umumkan(pesan) {
  const el = document.getElementById('pengumuman');
  if (el) { el.textContent = ''; setTimeout(() => { el.textContent = pesan; }, 30); }
}

export function umpan(jenis, judul, ...isi) {
  return h('div', { class: `umpan ${jenis}`, role: jenis === 'salah' || jenis === 'awas' ? 'alert' : 'status' },
    judul ? h('strong', {}, judul) : null, ...isi);
}

/** Dialog modal sederhana berisi elemen. */
export function bukaDialog(judul, isi) {
  const tutup = h('button', { class: 'tombol netral penuh', onclick: () => d.close() }, 'Tutup');
  const d = h('dialog', { 'aria-label': judul }, h('h2', {}, judul), isi, tutup);
  d.addEventListener('close', () => d.remove());
  document.body.append(d);
  d.showModal();
  return d;
}

export function kosongkan(el, ...anak) {
  el.replaceChildren();
  tambah(el, anak);
  return el;
}

export const LABEL_LEVEL = { dasar: 'Dasar', menengah: 'Menengah', tantangan: 'Tantangan' };
export const LABEL_TOPIK_LATIHAN = { plsv: 'Persamaan (PLSV)', ptlsv: 'Pertidaksamaan (PtLSV)' };
