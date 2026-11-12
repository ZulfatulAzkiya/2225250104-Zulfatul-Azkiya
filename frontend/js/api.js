// Mengambil soal dari server Python; jika offline, memakai bank soal di perangkat.

import { acak } from './ui.js';

const cacheJson = new Map();

export async function muatJson(jalur) {
  if (!cacheJson.has(jalur)) {
    cacheJson.set(jalur, fetch(jalur).then((r) => {
      if (!r.ok) throw new Error(`Gagal memuat ${jalur}`);
      return r.json();
    }).catch((e) => { cacheJson.delete(jalur); throw e; }));
  }
  return cacheJson.get(jalur);
}

async function dariServer(topik, level, jumlah) {
  const ctrl = new AbortController();
  const batas = setTimeout(() => ctrl.abort(), 4000);
  try {
    const r = await fetch(`api/soal?topik=${topik}&level=${level}&jumlah=${jumlah}`, { signal: ctrl.signal });
    if (!r.ok) throw new Error(String(r.status));
    return (await r.json()).soal;
  } finally {
    clearTimeout(batas);
  }
}

async function dariBank(topik, level, jumlah) {
  const bank = await muatJson('data/bank-soal.json');
  return acak(bank.soal.filter((p) => p.topik === topik && p.level === level)).slice(0, jumlah);
}

// Di hosting statis (Netlify/GitHub Pages) tidak ada server Python: cukup cek sekali.
let tanpaServer = false;

/** Mengembalikan {soal: [...], sumber: 'server' | 'perangkat'}. */
export async function ambilSoal(topik, level, jumlah) {
  if (navigator.onLine !== false && !tanpaServer) {
    try {
      return { soal: await dariServer(topik, level, jumlah), sumber: 'server' };
    } catch (e) {
      if (String(e.message) === '404') tanpaServer = true;
    }
  }
  return { soal: await dariBank(topik, level, jumlah), sumber: 'perangkat' };
}
