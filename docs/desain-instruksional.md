# Desain Instruksional

## 1. Acuan Kurikulum

**Kurikulum Merdeka, Matematika Fase D (SMP kelas VII–IX), elemen Aljabar.**
Ringkasan capaian yang relevan: di akhir Fase D, peserta didik dapat menyatakan situasi ke dalam bentuk aljabar, memahami sifat-sifat operasi pada bentuk aljabar, serta **menyelesaikan persamaan dan pertidaksamaan linear satu variabel**.

> ⚠️ Sebelum finalisasi, cocokkan rumusan CP dengan dokumen resmi terbaru (Keputusan Kepala BSKAP tentang Capaian Pembelajaran yang berlaku) dan buku siswa/LKS yang dipakai sekolah mitra.

## 2. Tujuan Pembelajaran (TP)

| Kode | Tujuan pembelajaran | Topik aplikasi |
|---|---|---|
| TP-0 | Menghitung operasi penjumlahan, pengurangan, perkalian, dan pembagian bilangan bulat termasuk bilangan negatif | Prasyarat |
| TP-0b | Menyederhanakan bentuk aljabar sederhana (suku sejenis, sifat distributif) | Prasyarat |
| TP-1 | Membedakan kalimat terbuka, pernyataan, dan persamaan | PLSV |
| TP-2 | Menyelesaikan PLSV dengan operasi yang sama pada kedua ruas (prinsip timbangan) | PLSV |
| TP-3 | Membaca, menuliskan, dan menggambarkan simbol `<`, `>`, `≤`, `≥` pada garis bilangan | Simbol |
| TP-4 | Menyelesaikan PtLSV dengan koefisien positif | PtLSV |
| TP-5 | Menjelaskan alasan dan menerapkan pembalikan tanda ketika kedua ruas dikali/dibagi bilangan negatif | Pembalikan tanda |
| TP-6 | Memodelkan dan menyelesaikan masalah kontekstual yang berkaitan dengan PLSV/PtLSV | Soal cerita |
| TP-7 | Menafsirkan penyelesaian dalam konteks dan menilai kewajarannya (mis. membulatkan sesuai konteks, batas nilai yang mungkin) | Misi Literasi |

### Literasi matematika
Mengacu pada siklus literasi matematika PISA (*formulate, employ, interpret/evaluate*) dan konteks Asesmen Kompetensi Minimum (AKM) numerasi (personal, sosial budaya, saintifik). Setiap Misi Literasi memecah proses ini menjadi lima layar terpisah (segmenting), sehingga siswa tidak harus memahami cerita, membuat model, menghitung, dan menafsirkan sekaligus. Cara ini mengurangi beban intrinsik soal cerita yang panjang (IL02).

## 3. Prinsip Cognitive Load Theory yang Diterapkan

| Prinsip | Penerapan di aplikasi | Temuan |
|---|---|---|
| **Pre-training** | Prasyarat dan makna simbol diajarkan sebelum prosedur | IL04, EL03 |
| **Segmenting** | 1 konsep per layar, 1 langkah per klik | EL01, EL02, DS05 |
| **Learner-paced** | Tidak ada autoplay atau timer di mode belajar; tombol Lanjut/Kembali | EL04 |
| **Signaling** | Operasi yang dilakukan ditandai warna dan label ("−3 di kedua ruas"); angka yang berubah disorot | EL02 |
| **Coherence** | Tidak ada dekorasi, musik, atau animasi hiasan; animasi hanya untuk konsep | DS04, DS05 |
| **Spatial contiguity** | Penjelasan diletakkan tepat di samping atau bawah baris persamaan yang dijelaskan, bukan di bagian bawah halaman | EL02 |
| **Worked example effect** | Contoh lengkap sebelum latihan | GL01, GL03 |
| **Fading** | Contoh bertahap dihilangkan langkahnya (worked → faded → mandiri) | GL03, GL04 |
| **Self-explanation** | Pertanyaan "Kenapa langkah ini benar?" | GL05 |
| **Simple-to-complex sequencing** | Level Dasar → Menengah → Tantangan | GL04 |
| **Immediate, elaborated feedback** | Umpan balik per langkah yang menyebut jenis kesalahan dan cara memperbaikinya | DS03, IL05 |

## 4. Alur Belajar Setiap Sub-Bab

Setiap topik mengikuti pola tetap supaya siswa tidak perlu mempelajari ulang navigasi (mengurangi beban ekstrinsik):

```
1. Ingat Dulu    → 1 kartu pengingat prasyarat (opsional, bisa dilewati)
2. Pahami        → 2–4 kartu konsep (1 konsep per kartu)
3. Lihat Contoh  → Animasi Langkah (worked example), 1 contoh per layar
4. Coba Bareng   → Faded example: sebagian langkah diisi siswa
5. Latihan       → Latihan langkah demi langkah, 3 level
6. Cek Diri      → 3–5 soal kuis, nilai + pembahasan
```

### Aturan fading
| Tahap | Langkah yang diisi siswa | Petunjuk |
|---|---|---|
| Worked example | 0 (siswa hanya menekan "Lanjut") | — |
| Faded 1 | Langkah terakhir saja | Selalu terlihat |
| Faded 2 | Separuh langkah terakhir | Bisa dibuka |
| Mandiri | Semua langkah | Bisa dibuka (memengaruhi skor bonus, bukan nilai utama) |

### Aturan penguasaan (mastery)
- Level dianggap **dikuasai** jika ≥ 80% dari 5 soal terakhir benar **tanpa** petunjuk tingkat 3.
- Level berikutnya terbuka setelah level sebelumnya dikuasai. Siswa boleh melompat dengan konfirmasi ("Yakin? Level ini mungkin terasa sulit").
- Jika siswa salah 2 kali berturut-turut dengan jenis kesalahan yang sama, sistem menawarkan kembali ke animasi atau kartu terkait.

## 5. Strategi Umpan Balik

| Waktu | Bentuk | Contoh |
|---|---|---|
| Saat langkah benar | Centang hijau singkat, tanpa animasi berlebihan | "✓ Tepat." |
| Saat langkah salah | Pesan spesifik sesuai jenis kesalahan + tombol petunjuk | "Kamu membagi kedua ruas dengan **−2**. Ingat: membagi dengan bilangan negatif → tanda **dibalik**." |
| Akhir sesi | Nilai, jumlah benar, jenis kesalahan terbanyak, saran topik | "Kesalahan terbanyakmu: lupa membalik tanda (2×). Ulangi animasi *Kenapa tandanya dibalik?*" |
| Pembahasan | Langkah siswa ↔ langkah benar, langkah salah ditandai | Lihat [user-flow-dan-layar.md](user-flow-dan-layar.md) |

Bahasa umpan balik: **tidak menyalahkan**, fokus pada langkah ("Langkah ke-2 perlu dicek") dan bukan pada siswa ("Kamu salah").

## 6. Representasi Visual Utama

1. **Timbangan (PLSV):** kedua ruas persamaan sebagai lengan timbangan. Operasi yang sama pada kedua ruas menjaga timbangan tetap seimbang. Hanya dipakai di konsep awal PLSV, lalu diganti notasi simbolik (fading representasi).
2. **Garis bilangan (simbol & PtLSV):** himpunan penyelesaian digambar dengan bulatan kosong (`<`, `>`) atau penuh (`≤`, `≥`) dan arsiran arah.
3. **Garis bilangan cermin (pembalikan tanda):** mengalikan dengan −1 = mencerminkan titik terhadap 0, sehingga urutan titik terbalik.

## 7. Aktivitas Self-Explanation (FR-13)

Contoh pertanyaan pilihan ganda setelah sebuah langkah:

> Dari −2x > 4 menjadi x < −2. Kenapa tandanya berubah?
> - (A) Karena 4 dipindah ke kanan
> - (B) **Karena kedua ruas dibagi bilangan negatif, sehingga urutan bilangan terbalik** ✓
> - (C) Karena hasilnya negatif
> - (D) Karena x harus di kiri

Pilihan pengecoh disusun dari miskonsepsi umum (lihat [konten-materi.md](konten-materi.md) §5).
