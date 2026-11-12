# User Flow dan Rancangan Layar

> **Implementasi v1.0:** navigasi bawah berisi **Beranda · Belajar · Latihan · Literasi**; Progres (📊) dan Akun (⚙️) ada di header. Siswa masuk cukup dengan nama panggilan (tanpa kode kelas/PIN). Alur guru (§3, §4.9) adalah rancangan tahap berikutnya. Rute: `#/`, `#/belajar`, `#/belajar/<topik>/<kartu>`, `#/prasyarat`, `#/latihan`, `#/latihan/<plsv|ptlsv>/<level>`, `#/literasi`, `#/literasi/<misi>`, `#/progres`, `#/akun`.
>
> **Misi Literasi:** Cerita → Pahami (pilihan ganda) → Rumuskan (pilih model, dengan "Misalkan x = …") → Selesaikan (pengerja langkah) → Tafsirkan (arti jawaban dalam konteks) → Cek (substitusi & kewajaran) → Hasil per tahap.

## 1. Peta Navigasi

```
                    ┌──────────────┐
                    │  Splash/Intro │
                    └──────┬───────┘
                ┌──────────┴──────────┐
         ┌──────▼──────┐       ┌──────▼──────┐
         │ Masuk Siswa │       │  Masuk Guru │
         └──────┬──────┘       └──────┬──────┘
   (pertama kali)│                     │
   ┌─────────────▼───┐          ┌──────▼──────────┐
   │ Pemanasan       │          │  Dasbor Guru    │
   │ Prasyarat (FR-01)│         │  ├ Kelas Saya   │
   └─────────┬───────┘          │  ├ Progres Kelas│
             │                  │  └ Kesalahan    │
   ┌─────────▼─────────────────────────────────┐  Terbanyak
   │ BERANDA SISWA: navigasi bawah (4 menu)     │
   │ [Belajar] [Latihan] [Progres] [Akun]       │
   └───┬──────────┬───────────┬───────────┬────┘
       │          │           │           │
  Peta Materi  Pilih Topik  Progres     Pengaturan
       │        & Level     Pribadi     (ukuran teks,
  Kartu Materi    │                     kurangi gerakan)
       │       Latihan Langkah
  Animasi         demi Langkah
  Langkah          │
       │        Hasil & Nilai
  Coba Bareng      │
  (faded)       Pembahasan
```

Navigasi siswa dibatasi **4 menu utama** (DS04). Semua layar belajar memakai pola tombol yang sama: **Kembali** (kiri bawah) dan **Lanjut** (kanan bawah).

## 2. Alur Utama Siswa (Happy Path)

1. Siswa memasukkan **kode kelas**, memilih **nama panggilan** dari daftar, dan memasukkan **PIN 4 digit**.
2. Pertama kali masuk: **Pemanasan Prasyarat** (8 soal, ±5 menit), lalu hasil dan rekomendasi.
3. Beranda menampilkan kartu "**Lanjutkan belajar**": topik berikutnya di peta materi.
4. Siswa mempelajari topik: Ingat Dulu → Pahami → Lihat Contoh → Coba Bareng → Latihan → Cek Diri.
5. Setelah Cek Diri: **nilai + pembahasan**; topik ditandai "dikuasai" jika ≥ 80%.
6. Data progres disinkronkan ke Firestore dan muncul di dasbor guru.

## 3. Alur Guru

1. Daftar/masuk dengan email.
2. **Buat Kelas** (nama kelas, misalnya "IX-A"), lalu sistem membuat kode 6 karakter (misalnya `K7QM2P`).
3. **Tambah Siswa**: tempel daftar nama panggilan; PIN dibuat otomatis lalu dicetak/dibagikan.
4. Pantau **Progres Kelas** dan **Kesalahan Terbanyak**.

## 4. Wireframe Layar

### 4.1 Masuk Siswa
```
┌────────────────────────────┐
│        LinierKu            │
│                            │
│  Kode kelas                │
│  [ K7QM2P            ]     │
│                            │
│  Nama panggilan            │
│  [ Sari            ▼ ]     │
│                            │
│  PIN                       │
│  [ • • • • ]               │
│                            │
│  [        Masuk        ]   │
│                            │
│  Saya guru →               │
└────────────────────────────┘
```

### 4.2 Beranda Siswa
```
┌────────────────────────────┐
│ Halo, Sari 👋               │
│                            │
│ ┌────────────────────────┐ │
│ │ Lanjutkan belajar      │ │
│ │ 4. Kenapa Tandanya     │ │
│ │    Dibalik?            │ │
│ │ ▓▓▓▓▓▓░░░░  60%        │ │
│ │          [ Lanjut → ]  │ │
│ └────────────────────────┘ │
│                            │
│ Latihan hari ini           │
│ [ PtLSV · Level Menengah ] │
│                            │
├────────────────────────────┤
│ 📘Belajar 📝Latihan 📊Progres 👤Akun │
└────────────────────────────┘
```

### 4.3 Peta Materi
```
┌────────────────────────────┐
│ ← Peta Materi              │
│                            │
│  ✅ 0 Pemanasan Prasyarat   │
│  │                         │
│  ✅ 1 Persamaan Linear      │
│  │                         │
│  ✅ 2 Simbol Pertidaksamaan │
│  │                         │
│  🔵 3 Pertidaksamaan Linear │  ← sedang
│  │                         │
│  🔒 4 Kenapa Tanda Dibalik? │
│  │                         │
│  🔒 5 Soal Cerita           │
└────────────────────────────┘
```

### 4.4 Kartu Materi (1 konsep per layar)
```
┌────────────────────────────┐
│ ← 2. Simbol      ● ● ○ ○   │  (indikator kartu 2/4)
│                            │
│         x  >  3            │
│     "x lebih dari 3"       │
│                            │
│   ──┼──┼──┼──○━━━━━━━▶     │
│     0  1  2  3  4  5       │
│                            │
│  Bulatan kosong: 3 tidak   │
│  termasuk. Arsir ke kanan. │
│                            │
│ [ ← Kembali ]  [ Lanjut → ]│
└────────────────────────────┘
```

### 4.5 Animasi Langkah (worked example)
```
┌────────────────────────────┐
│ ← Lihat Contoh   Langkah 2/3│
│                            │
│      −2x + 3  >  7         │
│      ┌──────────────┐      │
│      │ kedua ruas −3 │      │  ← label warna oranye
│      └──────────────┘      │
│      −2x      >  4         │
│                            │
│  (langkah 3 belum muncul)  │
│                            │
│ [ ← Kembali ]  [ Lanjut → ]│
└────────────────────────────┘
```

### 4.6 Latihan Langkah demi Langkah
```
┌────────────────────────────┐
│ ← Latihan · Menengah  3/5  │
│                            │
│  Soal:  −3x − 2 ≥ 10       │
│  ───────────────────────── │
│  −3x ≥ 12     ✓            │
│                            │
│  Langkah berikutnya?       │
│  [ ÷ (−3) ] [ ÷ 3 ] [ −12 ]│
│                            │
│  Hasil: x [ ≤ ▼ ] [ −4  ]  │
│                            │
│  💡 Petunjuk   📖 Contoh    │
│              [ Periksa ]   │
└────────────────────────────┘
```
Jika siswa memilih `÷ (−3)` dan tanda `≥`, muncul **pengingat kontekstual** (FR-09):
```
│ ⚠️ Kamu membagi dengan −3   │
│ (negatif). Tandanya perlu  │
│ dibalik.  [Lihat kenapa]   │
```

### 4.7 Hasil dan Pembahasan
```
┌────────────────────────────┐
│ Hasil Latihan              │
│                            │
│         80                 │
│     4 dari 5 benar         │
│                            │
│ Perlu diperhatikan:        │
│ • Lupa membalik tanda (1×) │
│                            │
│ Soal 3  ✗  [Lihat bahasan] │
│ ┌───────────┬────────────┐ │
│ │ Jawabanmu │ Seharusnya │ │
│ │ −3x ≥ 12  │ −3x ≥ 12   │ │
│ │ x ≥ −4 ✗  │ x ≤ −4     │ │
│ └───────────┴────────────┘ │
│ [Ulangi]   [Topik berikut] │
└────────────────────────────┘
```

### 4.8 Progres Pribadi
```
┌────────────────────────────┐
│ Progres Saya               │
│ Topik dikuasai: 3 / 6      │
│ ▓▓▓▓▓▓▓▓░░░░░░░            │
│                            │
│ PLSV        ✅  Terbaik 100 │
│ Simbol      ✅  Terbaik 90  │
│ PtLSV       🔵  Terbaik 60  │
│ Tanda dibalik 🔒            │
│                            │
│ Latihan selesai: 14 sesi   │
└────────────────────────────┘
```

### 4.9 Dasbor Guru (web, tampilan lebar)
```
┌───────────────────────────────────────────────────────┐
│ Kelas IX-A (K7QM2P)   28 siswa   [+ Tambah siswa]     │
├───────────────────────────────────────────────────────┤
│ Siswa   │Prasyarat│ PLSV │Simbol│PtLSV│Tanda│Cerita│Rata│
│ Sari    │   ✅    │  ✅  │  ✅  │ 🔵  │ ·   │  ·   │ 78 │
│ Budi    │   ✅    │  🔵  │  ·   │  ·  │ ·   │  ·   │ 55 │
│ ...                                                    │
├───────────────────────────────────────────────────────┤
│ Kesalahan terbanyak di kelas                           │
│ Lupa membalik tanda      ████████████  34              │
│ Hitung bilangan negatif  ███████       19              │
│ Tanda < > tertukar       █████         13              │
└───────────────────────────────────────────────────────┘
```

## 5. Status Kosong dan Error

| Situasi | Pesan |
|---|---|
| Kode kelas salah | "Kode kelas tidak ditemukan. Tanyakan ke gurumu ya." |
| PIN salah 5× | Kunci 5 menit, lalu "Minta guru mengatur ulang PIN." |
| Server soal tidak terjangkau | Otomatis memakai bank soal cadangan tanpa mengganggu siswa; tampilkan ikon awan kecil "akan disinkronkan" |
| Belum ada data (guru) | "Belum ada siswa yang belajar. Bagikan kode kelas **K7QM2P** ke siswa." |
