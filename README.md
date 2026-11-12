# ULFALINE: Belajar Persamaan & Pertidaksamaan Linear Satu Variabel

Aplikasi belajar **Persamaan Linear Satu Variabel (PLSV)** dan **Pertidaksamaan Linear Satu Variabel (PtLSV)** untuk siswa SMP (Kurikulum Merdeka, Fase D), dengan **Misi Literasi Matematika**. Aplikasi dirancang berdasarkan **Cognitive Load Theory** dari hasil wawancara siswa.

- 🌐 Dibuka di **browser** (HP, tablet, laptop)
- 📲 Bisa **dipasang langsung dari browser** (PWA), tanpa Play Store atau App Store
- 📴 Tetap bisa dipakai **offline** setelah dibuka sekali

**Pengembang:** Zulfatul Azkiya (2225250104), S1 Pendidikan Matematika · **Mata kuliah:** Algoritma Pemrograman 2026
**Bahasa pemrograman:** Python (server, mesin aljabar, generator soal) dan JavaScript (aplikasi web)

## Menjalankan

Windows: klik dua kali **`jalankan.bat`**, lalu buka `http://localhost:8000`.

Manual:
```bash
cd backend
python -m venv .venv && .venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Untuk menerbitkan online dan memasang di HP, lihat [docs/panduan-instalasi.md](docs/panduan-instalasi.md).

## Fitur

| Fitur | Menjawab temuan wawancara |
|---|---|
| 🔁 **Kuis Pemanasan Prasyarat** + saran kartu yang perlu diulang | K01, IL04, IL05 |
| 🗂️ **Kartu materi**: satu konsep per layar, sedikit teks | EL01, EL05, DS04, DS05 |
| ⚖️ **Timbangan interaktif** (prinsip operasi di kedua ruas) | IL02 |
| 🔣 **Penjelajah simbol** <, >, ≤, ≥ dengan garis bilangan | IL01, EL03 |
| 🔄 **Animasi "Kenapa tandanya dibalik?"** (garis bilangan cermin) | IL03, DS02 |
| 📖 **Contoh bertahap**: satu langkah per ketukan, bisa mundur | EL02, EL04, GL03 |
| 🪜 **Latihan langkah demi langkah**: pilih operasi, tulis hasil, umpan balik per langkah, 11 jenis kesalahan terdeteksi | IL02, IL05, DS03 |
| ⚠️ **Pengingat kontekstual** saat mengali/membagi dengan bilangan negatif | IL03 |
| 💡 **Petunjuk 3 tingkat** dan **contoh serupa** | GL02, GL03 |
| 🌱 **3 level** (Dasar → Menengah → Tantangan), terbuka saat nilai ≥ 80; soal baru tanpa batas dari generator Python | GL01, GL04 |
| 📊 **Nilai + pembahasan** (langkahmu vs langkah kunci) + saran materi | DS01, DS03 |
| 🌏 **8 Misi Literasi**: Pahami → Rumuskan → Selesaikan → Tafsirkan → Cek, dengan konteks AKM (personal, sosial budaya, saintifik) | Literasi matematika |
| ⚙️ Ukuran teks, kurangi gerakan, tema gelap | DS05, aksesibilitas |

## Struktur Proyek

```
├─ jalankan.bat            jalankan di Windows (klik dua kali)
├─ Dockerfile, render.yaml terbitkan online (HTTPS)
├─ backend/                Python
│  ├─ app/main.py          server FastAPI: API + menyajikan aplikasi web
│  ├─ app/services/        aljabar.py (parser aman), operasi.py, pemeriksa.py, generator.py
│  ├─ scripts/             ekspor_bank_soal.py, buat_ikon.py
│  ├─ tests/               pytest (158 tes, termasuk cek silang SymPy & kesetaraan JS↔Python)
│  └─ e2e/uji_e2e.py       uji end-to-end di Chrome (Playwright)
├─ frontend/               JavaScript murni (tanpa build), PWA
│  ├─ index.html, sw.js, manifest.webmanifest
│  ├─ js/mesin.js          mesin aljabar (cermin dari Python, untuk umpan balik instan & offline)
│  ├─ js/komponen/         pengerja langkah, visual (timbangan, garis bilangan, cermin), contoh, pilihan ganda
│  ├─ js/halaman/          beranda, belajar, latihan, literasi, akun
│  ├─ js/konten/materi.js  isi kartu materi
│  └─ data/                literasi.json, prasyarat.json, bank-soal.json
└─ docs/                   dokumen perencanaan
```

## Pengujian

```bash
cd backend
pip install -r requirements-dev.txt
pytest                                   # unit, konten, API, sintaks JS, paritas JS↔Python
uvicorn app.main:app --port 8765         # di terminal lain
python e2e/uji_e2e.py                    # butuh: pip install playwright (memakai Chrome terpasang)
```

## Dokumen

[PRD](docs/PRD.md) · [Analisis Kebutuhan](docs/analisis-kebutuhan.md) · [Desain Instruksional](docs/desain-instruksional.md) · [Konten Materi](docs/konten-materi.md) · [User Flow](docs/user-flow-dan-layar.md) · [UI/UX](docs/panduan-ui-ux.md) · [Arsitektur](docs/arsitektur-teknis.md) · [Data & API](docs/skema-data-dan-api.md) · [Privasi](docs/privasi-dan-keamanan.md) · [Roadmap](docs/roadmap.md) · [Pengujian](docs/rencana-pengujian-dan-evaluasi.md) · [Instalasi](docs/panduan-instalasi.md)
