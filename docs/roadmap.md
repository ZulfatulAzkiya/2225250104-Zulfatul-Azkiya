# Roadmap Pengembangan

## Status v1.0 (13 November 2026): aplikasi siswa selesai

| Milestone | Status | Hasil |
|---|---|---|
| M0 Persiapan | ✅ (teknis) | Struktur proyek, lingkungan Python, tes otomatis. ⏳ Wawancara 3–5 siswa tambahan + 1 guru masih perlu dilakukan |
| M1 Fondasi UI & Materi PLSV | ✅ | Design system, navigasi, kartu materi, timbangan interaktif, contoh bertahap, kuis prasyarat |
| M2 Simbol, PtLSV & Pembalikan Tanda | ✅ | Penjelajah simbol, garis bilangan, animasi cermin tanda |
| M3 Mesin Python & Latihan | ✅ | Parser aman, pemeriksa langkah + 11 kode kesalahan, generator 3 level, latihan langkah demi langkah, petunjuk 3 tingkat, nilai & pembahasan, bank soal offline |
| M3b Literasi Matematika | ✅ | Materi literasi + 8 misi kontekstual (Pahami → Rumuskan → Selesaikan → Tafsirkan → Cek) |
| M5 Distribusi tanpa toko aplikasi | ✅ | PWA terpasang dari browser, offline, Dockerfile + render.yaml, panduan APK opsional via PWABuilder |
| M4 Kelas & Dasbor Guru | ⏳ Berikutnya | Lihat [skema-data-dan-api.md](skema-data-dan-api.md) §3 |
| M6 Validasi & Uji Coba | ⏳ Berikutnya | Validasi ahli materi & media, uji coba perorangan → kelompok kecil → lapangan |

## Langkah Berikutnya yang Disarankan

1. **Terbitkan online** (Render) dan uji di 2–3 HP Android nyata, terutama HP kelas bawah.
2. **Validasi ahli materi**: periksa naskah kartu di `js/konten/materi.js` dan 8 misi di `data/literasi.json`.
3. **Uji perorangan** dengan 3 siswa (*think-aloud*), lalu revisi.
4. Putuskan perlu-tidaknya **dasbor guru** untuk penelitian. Alternatif ringan: tombol "Ekspor nilai" (CSV) di halaman Progres yang dikirim siswa ke guru.
5. Tambah misi literasi dari konteks lokal sekolah mitra.

## Definition of Done (setiap fitur)

- [ ] Memenuhi acceptance criteria di [PRD.md](PRD.md)
- [ ] Lolos checklist layar di [panduan-ui-ux.md](panduan-ui-ux.md) §8
- [ ] `pytest` lulus (termasuk paritas JS↔Python dan konten)
- [ ] `e2e/uji_e2e.py` lulus; tangkapan layar diperiksa di lebar 390 px dan desktop
- [ ] File frontend baru terdaftar di `sw.js`; `VERSI` dinaikkan saat rilis
- [ ] Dokumen terkait diperbarui
