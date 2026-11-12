# Arsitektur Teknis

> Versi 1.0. Keputusan pemilik proyek: bahasa pemrograman **Python dan JavaScript**; aplikasi **dibuka di browser dan dipasang tanpa toko aplikasi**.

## 1. Ringkasan Stack

| Lapisan | Teknologi | Alasan |
|---|---|---|
| Aplikasi web | **HTML + CSS + JavaScript murni (ES modules)** | Tanpa build step dan tanpa Node.js, mudah dipelajari dan dijalankan |
| Pemasangan | **PWA**: `manifest.webmanifest` + service worker `sw.js` | Bisa di-install dari browser di Android, iOS, dan desktop; offline |
| Server | **Python + FastAPI + uvicorn** | Satu proses menyajikan API dan file aplikasi |
| Mesin aljabar | Python `fractions.Fraction` + parser rekursif sendiri | Eksak, aman (tanpa `eval`), mudah diuji |
| Mesin aljabar (klien) | `frontend/js/mesin.js`, cermin 1:1 dari Python | Umpan balik instan dan tetap jalan offline |
| Penyimpanan | `localStorage` di perangkat siswa | Tanpa akun dan server basis data; privasi anak terjaga |
| Pengujian | pytest, SymPy (pembanding), mini-racer (V8), Playwright + Chrome | Kebenaran matematika, paritas JS↔Python, dan E2E |
| Hosting | Docker → Render.com (gratis, HTTPS) atau layanan serupa | HTTPS wajib untuk pemasangan PWA |

## 2. Diagram

```
┌────────────────────────────── Perangkat siswa ──────────────────────────────┐
│  Browser / PWA terpasang                                                     │
│  ┌──────────────┐   ┌──────────────────┐   ┌───────────────────────────┐    │
│  │ halaman/*.js │──▶│ komponen/*.js     │──▶│ mesin.js (cek langkah,     │    │
│  │ (router hash)│   │ pengerja, visual  │   │ pilihan operasi, petunjuk) │    │
│  └──────┬───────┘   └──────────────────┘   └───────────────────────────┘    │
│         │ simpan.js → localStorage (profil, progres, nilai, riwayat)         │
│         │ api.js ──┐                                                         │
│  sw.js (cache semua file aplikasi + data/bank-soal.json untuk offline)       │
└────────────────────┼─────────────────────────────────────────────────────────┘
                     │ HTTPS  GET /api/soal  (jika gagal → bank soal lokal)
┌────────────────────▼─────────────────────────────────────────────────────────┐
│  Server Python (FastAPI)                                                      │
│  /api/soal ─▶ generator.py ─▶ pemeriksa.selesaikan (verifikasi)               │
│  /api/periksa-langkah, /api/periksa-operasi, /api/selesaikan, …              │
│  "/" ─▶ StaticFiles(frontend/)                                                │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Pembagian tanggung jawab
- **Python** adalah sumber kebenaran logika matematika dan pembangkit soal tak terbatas. Ia juga membuat bank soal offline (`scripts/ekspor_bank_soal.py`) dan ikon.
- **JavaScript** menjalankan antarmuka dan memeriksa langkah secara lokal (tanpa jeda jaringan, EL04). Logikanya dijamin sama dengan Python oleh `tests/test_paritas_js.py`.
- Endpoint pemeriksa di server tetap tersedia untuk klien lain dan tahap berikutnya (mis. penilaian terpusat untuk dasbor guru).

## 3. Struktur Folder

```
backend/
  app/main.py              FastAPI: rute /api + StaticFiles(frontend)
  app/services/aljabar.py  normalisasi, tokenisasi, parser, Linear/Bentuk, himpunan, format
  app/services/operasi.py  Operasi, terapkan, membalik, rencana, jarak, label & penjelasan
  app/services/pemeriksa.py periksa_operasi, periksa_langkah (+klasifikasi E_*), pilihan_operasi, petunjuk, selesaikan
  app/services/generator.py templat soal PLSV/PtLSV × 3 level, buat_paket
  scripts/                 ekspor_bank_soal.py, buat_ikon.py
  tests/                   test_aljabar, test_pemeriksa, test_generator (SymPy), test_api,
                           test_konten, test_frontend (sintaks JS, sw.js, manifest), test_paritas_js
  e2e/uji_e2e.py           alur lengkap di Chrome
frontend/
  index.html, manifest.webmanifest, sw.js, css/app.css, ikon/
  js/main.js               router hash (#/belajar/tanda/1 …), error handler, daftar service worker
  js/ui.js                 h(), s(), mat(), umpan(), bukaDialog()
  js/simpan.js             localStorage + pengaturan tampilan + aturan penguasaan level
  js/api.js                ambilSoal(): server → fallback bank-soal.json
  js/pasang.js             tombol/instruksi pemasangan PWA
  js/mesin.js              mesin aljabar (cermin Python)
  js/konten/materi.js      6 topik, kartu materi
  js/komponen/             pengerja.js, visual.js, contoh.js, pilihan.js
  js/halaman/              beranda.js, belajar.js, latihan.js, literasi.js, akun.js
  data/                    literasi.json, prasyarat.json, bank-soal.json (360 soal)
```

## 4. Mesin Aljabar

1. **Normalisasi & whitelist**: `−`→`-`, `≤`→`<=`, koma desimal→titik; hanya karakter `0-9 x + - * / ( ) . < > =`; panjang ≤ 120.
2. **Parser rekursif** (ekspresi → suku → unary → primer) menghasilkan `Linear(a, b)` = a·x + b dengan pecahan eksak. Perkalian x·x dan pembagian oleh x ditolak (bukan linear). Parser juga mencatat apakah tulisan **sudah sederhana** (tanpa kurung, maksimal satu suku x dan satu konstanta per ruas).
3. **Rencana langkah** (`rencana`): hilangkan penyebut → sederhanakan → kumpulkan x di kiri → hilangkan konstanta → bagi koefisien.
4. **Jarak** (`jarak`): banyak hal yang belum beres. Operasi pilihan siswa diterima jika jaraknya berkurang, sehingga cara lain yang sah (mis. membagi 2(x−3)=10 dengan 2) tetap diterima.
5. **Pemeriksaan langkah**: hasil siswa dibandingkan **secara struktur** dengan hasil operasi (urutan ruas boleh ditukar). Jika berbeda, hasil diklasifikasikan ke kode kesalahan (`E_TANDA_TIDAK_DIBALIK`, `E_SATU_RUAS`, `E_PINDAH_RUAS`, `E_HITUNG_NEGATIF`, …). Jawaban yang setara dan lebih maju diterima sebagai "cara lain".

## 5. Mode Offline & Pemasangan

- `sw.js` menyimpan semua file aplikasi di cache saat pertama dibuka (daftar `BERKAS`, diperiksa tes). Strategi **network-first**: saat online selalu versi terbaru; saat offline memakai cache.
- `/api/*` tidak di-cache. Jika server tidak terjangkau dalam 4 detik, `api.js` memakai `data/bank-soal.json` dan menampilkan lencana "📴 Offline".
- Syarat pemasangan diuji otomatis di E2E (`Page.getInstallabilityErrors` kosong).

## 6. Keamanan

- Tidak ada `eval`/`sympify` pada input pengguna; parser memakai whitelist.
- Batas panjang input (Pydantic `max_length`) dan validasi parameter (`Literal`, `jumlah ≤ 20`).
- Frontend tidak memakai `innerHTML` (diuji), sehingga teks pengguna tidak bisa menyisipkan HTML.
- Header `X-Content-Type-Options: nosniff`; CORS hanya aktif jika `ALLOWED_ORIGINS` diisi.

## 7. Rencana Tahap Berikutnya (di luar v1.0)

Akun guru, kelas, dan dasbor guru (FR-14 s.d. FR-16) dengan sinkronisasi progres. Opsi: Firebase Auth + Firestore (rancangan di [skema-data-dan-api.md](skema-data-dan-api.md) §3), atau basis data milik server Python (mis. PostgreSQL). Keputusan diambil bersama pemilik proyek.
