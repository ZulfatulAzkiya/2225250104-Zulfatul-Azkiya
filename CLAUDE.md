# CLAUDE.md

Panduan untuk Claude Code saat bekerja di repositori ini. **Baca "Aturan Wajib" sebelum mengubah kode atau konten.**

## Tentang Proyek

**ULFALINE** adalah aplikasi belajar PLSV dan PtLSV untuk siswa SMP (Kurikulum Merdeka, Fase D), dengan Misi Literasi Matematika. Aplikasi ini berupa **PWA**: dibuka di browser dan bisa dipasang dari browser tanpa Play Store/App Store. Desainnya berbasis **Cognitive Load Theory** dari wawancara siswa ([docs/analisis-kebutuhan.md](docs/analisis-kebutuhan.md)).

Pemilik: Zulfatul Azkiya, S1 Pendidikan Matematika. Penjelasan ke pemilik menggunakan **Bahasa Indonesia**.

## Stack (hanya Python dan JavaScript)

- **backend/** Python 3.10+ · FastAPI · uvicorn. Menyajikan API `/api/*` sekaligus file `frontend/`.
  Mesin aljabar memakai `fractions.Fraction` (eksak, tanpa eval). SymPy hanya dipakai di tes sebagai pembanding independen.
- **frontend/** HTML + CSS + **JavaScript murni (ES modules), tanpa build step, tanpa framework, tanpa npm**.
  PWA: `manifest.webmanifest` + `sw.js`. Progres disimpan di `localStorage` (lihat `js/simpan.js`).
- Tidak ada TypeScript, React, Node.js, atau Firebase di versi ini. Firebase dan dasbor guru adalah rencana tahap berikutnya ([docs/roadmap.md](docs/roadmap.md)).

## Perintah

```bash
cd backend
.venv\Scripts\activate
uvicorn app.main:app --reload --port 8000     # buka http://localhost:8000
pytest                                         # semua tes (butuh requirements-dev.txt)
python -m scripts.ekspor_bank_soal             # setelah mengubah generator.py
python -m scripts.buat_ikon                    # setelah mengubah frontend/ikon/ikon.svg
python e2e/uji_e2e.py http://localhost:8765/   # E2E; butuh `pip install playwright` + Chrome
```
Catatan Windows: path proyek ini panjang, jadi `pip install playwright` di `.venv` proyek gagal (batas panjang path). Pasang Playwright di venv dengan path pendek.

## Arsitektur Singkat

| File | Peran |
|---|---|
| `backend/app/services/aljabar.py` | Parser aman (whitelist karakter, parser rekursif), `Linear`, `Bentuk`, himpunan penyelesaian, format tampilan |
| `backend/app/services/operasi.py` | Operasi kedua ruas (`add:3`, `div:-2`, `subx:1`, `simplify`, …), `rencana()`, `jarak()` |
| `backend/app/services/pemeriksa.py` | `periksa_operasi`, `periksa_langkah` (kode kesalahan `E_*`), `pilihan_operasi`, `petunjuk`, `selesaikan` |
| `backend/app/services/generator.py` | Templat soal per topik × level, diverifikasi sebelum dikirim |
| `frontend/js/mesin.js` | **Cermin 1:1** dari tiga file Python pertama |
| `frontend/js/komponen/pengerja.js` | UI latihan langkah demi langkah |

**PENTING: paritas JS ↔ Python.** Setiap perubahan logika di `aljabar.py`/`operasi.py`/`pemeriksa.py` harus diterapkan juga ke `mesin.js` (dan sebaliknya), termasuk teks pesan. `tests/test_paritas_js.py` menjalankan `mesin.js` di V8 (mini-racer) dan membandingkan >500 kasus.

## Aturan Wajib: Desain Berbasis Beban Kognitif

1. **Satu konsep per layar**; teks ≤ ~40 kata per kartu; instruksi 1 kalimat. *(EL05, DS04, DS05)*
2. **Tanpa autoplay dan tanpa timer**; animasi maju hanya saat siswa menekan tombol. *(EL01, EL04)*
3. **Simbol dijelaskan sebelum dipakai.** *(EL03, IL01)*
4. **Setiap langkah menampilkan operasinya** dengan `.chip-op` (warna `--op`); langkah balik tanda memakai `.chip-op.balik`. *(EL02)*
5. **Animasi hanya untuk konsep**; hormati `prefers-reduced-motion` dan pengaturan "Kurangi gerakan". *(DS05)*
6. **Navigasi bawah tetap 4 menu** (Beranda, Belajar, Latihan, Literasi); Progres & Akun di header. *(DS04)*
7. **Umpan balik spesifik per langkah** dengan kode `E_*`, nada tidak menyalahkan. *(DS03, IL05)*
8. Peringatan pembalikan tanda **selalu** muncul saat memilih ×/÷ bilangan negatif pada pertidaksamaan. *(IL03, DS02)*
9. Latihan bertingkat; level terbuka saat nilai ≥ 80 (`AMBANG_KUASAI`). *(GL04)*
10. Jangan menampilkan informasi yang sama dua kali di satu layar (redundansi = beban ekstrinsik).

Checklist layar: [docs/panduan-ui-ux.md](docs/panduan-ui-ux.md) §8.

## Aturan Konten

- Contoh soal di `js/konten/materi.js` diselesaikan otomatis oleh mesin, jadi cukup tulis soalnya.
- Misi literasi (`data/literasi.json`) dan kuis (`data/prasyarat.json`) diverifikasi `tests/test_konten.py`: model harus menghasilkan `solusi`, dan pengecoh harus berbeda.
- Tampilan memakai minus asli `−` dan simbol `≤ ≥`; parser menerima juga `-`, `<=`, `>=`, dan koma desimal.
- Kode kesalahan baru: tambahkan di `pemeriksa.py` + `mesin.js` (PESAN & LABEL_KESALAHAN) + `docs/konten-materi.md` §5 + tes.

## Konvensi Kode

- JS: buat elemen dengan `h()`/`s()` dari `ui.js`. **Jangan memakai `innerHTML`** (ada tesnya).
- Warna hanya dari token CSS di `css/app.css` (`:root`), dengan pasangan mode gelap.
- File frontend baru **wajib** didaftarkan di `BERKAS` pada `sw.js`; naikkan `VERSI` saat rilis.
- Python: type hints, logika di `services/`, route tipis di `main.py`.
- Nama dalam Bahasa Indonesia (konsisten dengan kode yang ada).

## Privasi

Hanya nama panggilan + kelas (opsional) + data belajar, disimpan di perangkat siswa. Jangan menambah analitik pihak ketiga, iklan, atau pengiriman data pribadi ke server tanpa persetujuan pemilik proyek. Lihat [docs/privasi-dan-keamanan.md](docs/privasi-dan-keamanan.md).
