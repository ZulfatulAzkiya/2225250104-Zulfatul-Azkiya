# Konten Materi

> Semua rumus ditulis dalam LaTeX dan dirender dengan KaTeX di aplikasi.
> Setiap kartu memuat **satu konsep** dan teks **≤ ~40 kata** (EL05, DS05).
> Konten ini harus divalidasi ahli materi sebelum rilis uji coba.

## 1. Peta Materi

```
[0] Pemanasan Prasyarat
     ├─ 0.1 Operasi bilangan bulat negatif
     └─ 0.2 Bentuk aljabar (suku, koefisien, suku sejenis, distributif)
[1] Persamaan Linear Satu Variabel (PLSV)
     ├─ 1.1 Kalimat terbuka & persamaan
     ├─ 1.2 Prinsip timbangan (operasi sama di kedua ruas)
     └─ 1.3 Menyelesaikan PLSV (bertahap)
[2] Mengenal Simbol Pertidaksamaan
     ├─ 2.1 Arti <, >, ≤, ≥
     └─ 2.2 Menggambar di garis bilangan
[3] Pertidaksamaan Linear Satu Variabel (PtLSV)
     ├─ 3.1 PLSV vs PtLSV: apa yang sama, apa yang beda
     └─ 3.2 Menyelesaikan PtLSV (koefisien positif)
[4] Kenapa Tandanya Dibalik?
     ├─ 4.1 Animasi garis bilangan cermin
     └─ 4.2 Menyelesaikan PtLSV dengan koefisien negatif
[5] Soal Cerita PLSV & PtLSV
```

Urutan ini mengikuti temuan K03 (PLSV lebih dikuasai, jadi dipakai sebagai jembatan) dan IL01/IL03 (simbol dan pembalikan tanda dipisah menjadi topik sendiri).

## 2. Naskah Kartu Materi (contoh)

### 0.1 Bilangan negatif
| Kartu | Isi |
|---|---|
| 0.1-a | **Tanda sama → positif, tanda beda → negatif** (untuk perkalian & pembagian). $(-3)\times(-2)=6$, $(-3)\times 2=-6$. |
| 0.1-b | **Mengurangi = menambah lawannya.** $5-(-2)=5+2=7$. |
| 0.1-c | Di garis bilangan, **makin ke kiri makin kecil**. $-5<-2$ karena $-5$ ada di kiri $-2$. |

### 1.2 Prinsip timbangan
| Kartu | Isi |
|---|---|
| 1.2-a | Persamaan seperti **timbangan seimbang**. Ruas kiri = ruas kanan. |
| 1.2-b | Apa pun yang kamu lakukan di satu ruas, **lakukan juga di ruas lain**, supaya tetap seimbang. |
| 1.2-c | Tujuan kita: **x sendirian** di satu ruas. |

### 2.1 Arti simbol (Kartu Makna Simbol, FR-05)
| Simbol | Dibaca | Contoh | Garis bilangan |
|---|---|---|---|
| $<$ | kurang dari | $x<3$ | bulatan **kosong** di 3, arsir ke **kiri** |
| $>$ | lebih dari | $x>3$ | bulatan **kosong** di 3, arsir ke **kanan** |
| $\le$ | kurang dari atau sama dengan | $x\le 3$ | bulatan **penuh** di 3, arsir ke **kiri** |
| $\ge$ | lebih dari atau sama dengan | $x\ge 3$ | bulatan **penuh** di 3, arsir ke **kanan** |

Jembatan keledai (opsional): *"Ujung runcing menunjuk ke bilangan yang lebih kecil."* Pada $2<5$, ujung runcing menunjuk 2.

### 4.1 Kenapa tandanya dibalik? (FR-06), naskah animasi 5 langkah
1. Tampilkan garis bilangan dengan titik **2** dan **5**. Teks: "$2<5$ karena 2 ada di kiri 5."
2. Tombol "Kalikan dengan −1". Titik bergerak dan **dicerminkan terhadap 0**: 2 → −2, 5 → −5.
3. Teks: "Sekarang −5 ada di **kiri** −2."
4. Teks: "Jadi $-2>-5$. **Urutannya terbalik**, maka tandanya juga dibalik."
5. Cek pemahaman: "Jika $3<7$, maka $-3\ \square\ -7$?" (jawaban: $>$)

Ringkasan kartu: **Dikali atau dibagi bilangan negatif → tanda dibalik.** Ditambah atau dikurangi bilangan apa pun → tanda **tetap**.

## 3. Contoh Soal Bertahap (Worked Examples)

Format tiap langkah: `persamaan | operasi (label berwarna) | penjelasan singkat`.

### PLSV
**Contoh 1 (Dasar):** $2x+3=11$
| Langkah | Bentuk | Operasi |
|---|---|---|
| 1 | $2x+3=11$ | — |
| 2 | $2x=8$ | kedua ruas $-3$ |
| 3 | $x=4$ | kedua ruas $\div 2$ |
Cek: $2(4)+3=11$ ✓

**Contoh 2 (Menengah):** $3x-5=x+7$
| Langkah | Bentuk | Operasi |
|---|---|---|
| 1 | $3x-5=x+7$ | — |
| 2 | $2x-5=7$ | kedua ruas $-x$ |
| 3 | $2x=12$ | kedua ruas $+5$ |
| 4 | $x=6$ | kedua ruas $\div 2$ |
Cek: $3(6)-5=13$ dan $6+7=13$ ✓

**Contoh 3 (Menengah, bilangan negatif):** $7-3x=19$
| Langkah | Bentuk | Operasi |
|---|---|---|
| 1 | $7-3x=19$ | — |
| 2 | $-3x=12$ | kedua ruas $-7$ |
| 3 | $x=-4$ | kedua ruas $\div(-3)$ |
Cek: $7-3(-4)=7+12=19$ ✓. Catatan: pada **persamaan**, membagi dengan bilangan negatif **tidak** mengubah tanda "=".

**Contoh 4 (Tantangan, distributif):** $2(x-3)=10$, lalu $2x-6=10$, lalu $2x=16$, sehingga $x=8$.

### PtLSV
**Contoh 5 (Dasar):** $3x-4\le 11$, lalu $3x\le 15$ (kedua ruas $+4$), sehingga $x\le 5$ (kedua ruas $\div 3$, positif, tanda tetap).

**Contoh 6 (Menengah, pembalikan tanda):** $-2x+3>7$
| Langkah | Bentuk | Operasi |
|---|---|---|
| 1 | $-2x+3>7$ | — |
| 2 | $-2x>4$ | kedua ruas $-3$ (tanda **tetap**) |
| 3 | $x<-2$ | kedua ruas $\div(-2)$ → tanda **dibalik** ⚠️ |
Cek dengan $x=-3$: $-2(-3)+3=9>7$ ✓

**Contoh 7 (Tantangan):** $5-3x\ge 2x-10$, lalu $-5x\ge -15$ (kedua ruas $-2x$ dan $-5$), sehingga $x\le 3$ (kedua ruas $\div(-5)$, tanda dibalik).
Cek dengan $x=3$: $5-9=-4$ dan $6-10=-4$ (sama, sehingga $\ge$ terpenuhi) ✓

**Contoh 8 (Tantangan, pecahan):** $\frac{x}{2}+1<4$, lalu $\frac{x}{2}<3$, sehingga $x<6$.

### Soal cerita
**Contoh 9 (PLSV):** Panjang sebuah persegi panjang 5 cm lebih dari lebarnya. Kelilingnya 50 cm. Misalkan lebar $=x$, maka $2(x+5+x)=50$, lalu $4x+10=50$, sehingga $x=10$. Lebar 10 cm, panjang 15 cm.

**Contoh 10 (PtLSV):** Rina punya Rp50.000. Ia perlu Rp6.000 untuk ongkos pulang dan ingin membeli pulpen seharga Rp4.000 per buah. Paling banyak berapa pulpen yang dapat dibeli?
$4000x+6000\le 50000$, lalu $4000x\le 44000$, sehingga $x\le 11$. Paling banyak **11 pulpen**.

## 4. Spesifikasi Generator Soal (Backend Python, FR-10)

Semua soal dibangkitkan dengan bilangan bulat acak, lalu **diverifikasi SymPy**. Solusi dibatasi bilangan bulat $-20\ldots 20$ (level Dasar: $0\ldots 15$).

| Topik | Level | Bentuk template | Batasan |
|---|---|---|---|
| PLSV | Dasar | $x+a=b$, $ax=b$, $ax+b=c$ | $a\in[2,9]$, solusi bulat ≥ 0 |
| PLSV | Menengah | $ax+b=cx+d$, $b-ax=c$ | koefisien boleh negatif, solusi bulat |
| PLSV | Tantangan | $a(x+b)=c$, $\frac{x}{a}+b=c$, $a(x+b)=c(x+d)$ | solusi bulat |
| PtLSV | Dasar | $x+a<b$, $ax\ge b$, $ax+b\le c$ | $a>0$ (tanpa pembalikan) |
| PtLSV | Menengah | $-ax+b>c$, $ax+b\le cx+d$ | ≥ 50% soal memerlukan pembalikan tanda |
| PtLSV | Tantangan | distributif, pecahan, kedua ruas bervariabel | campuran |
| Soal cerita | Tantangan | 6–10 template konteks (uang, umur, keliling, nilai ujian) | konteks dekat siswa |

Parameter tambahan:
- `domain`: `real` (default) atau `bulat`, sesuai buku. Untuk domain bulat, jawaban berupa himpunan.
- Setiap soal menyertakan **langkah kunci** (daftar operasi kanonik) untuk pembahasan; jalur penyelesaian lain yang setara tetap diterima (diperiksa dengan kesetaraan himpunan penyelesaian, bukan kecocokan teks).

## 5. Katalog Miskonsepsi dan Pesan Umpan Balik (FR-09)

| Kode | Miskonsepsi | Contoh salah | Pesan umpan balik | Temuan |
|---|---|---|---|---|
| `E_TANDA_TIDAK_DIBALIK` | Lupa membalik tanda saat ×/÷ negatif | $-2x>4 \Rightarrow x>-2$ | "Kamu membagi dengan bilangan **negatif**. Tandanya perlu **dibalik**. Mau lihat lagi kenapa?" | IL03, DS02 |
| `E_TANDA_DIBALIK_SALAH` | Membalik tanda padahal tidak perlu | $x-3>5 \Rightarrow x<8$ | "Menambah/mengurangi **tidak** membalik tanda. Hanya ×/÷ bilangan negatif." | IL03 |
| `E_TANDA_TERTUKAR` | Salah menulis atau membaca $<$ dan $>$ | menulis $x<4$ padahal $x>4$ | "Cek lagi simbolnya: **>** dibaca 'lebih dari'." | IL01, IL05 |
| `E_HITUNG_NEGATIF` | Salah aritmetika bilangan negatif | $-3\times -4=-12$ | "Negatif × negatif = **positif**." | IL04, IL05 |
| `E_SATU_RUAS` | Operasi hanya di satu ruas | $2x+3=11 \Rightarrow 2x=11$ | "Ingat timbangan: kurangi 3 di **kedua** ruas." | IL02 |
| `E_PINDAH_RUAS` | Memindahkan suku tanpa mengubah tanda | $x+5=9 \Rightarrow x=9+5$ | "Untuk menghilangkan $+5$, kurangi 5 di kedua ruas." | IL02, IL05 |
| `E_DISTRIBUTIF` | Distributif tidak lengkap | $2(x-3)=2x-3$ | "Kalikan 2 ke **setiap** suku di dalam kurung." | IL04 |
| `E_SUKU_SEJENIS` | Menggabung suku tidak sejenis | $3x+2=5x$ | "$3x$ dan $2$ bukan suku sejenis, jadi tidak bisa dijumlahkan." | IL04 |
| `E_OPERASI_SALAH` | Memilih operasi yang tidak mendekatkan ke "x sendirian" | $2x=8 \Rightarrow$ kedua ruas $-2$ | "Untuk menghilangkan **kali 2**, gunakan kebalikannya: **bagi 2**." | IL02 |
| `E_BULATAN` | Bulatan penuh/kosong tertukar | $x<3$ digambar penuh | "$<$ tidak termasuk 3, jadi bulatannya **kosong**." | IL01 |
| `E_ARAH_ARSIR` | Arah arsiran salah | $x>3$ diarsir ke kiri | "Lebih dari 3 berarti bilangan di **kanan** 3." | IL01 |

Kode tambahan yang dipakai pemeriksa v1.0: `E_FORMAT` (tulisan tak terbaca, tidak dihitung sebagai kesalahan), `E_BELUM_DIOPERASIKAN`, `E_BELUM_SEDERHANA`, `E_TIDAK_MAJU`, dan `E_OPERASI_KURANG_TEPAT` (pilihan operasi tidak mendekatkan ke x sendirian). Daftar lengkap dan teks pesannya ada di `backend/app/services/pemeriksa.py` (sama dengan `frontend/js/mesin.js`).

## 5b. Misi Literasi Matematika (FR-19)

Setiap misi (`frontend/data/literasi.json`) melatih proses literasi: **merumuskan** situasi menjadi model, **menerapkan** prosedur, **menafsirkan** hasil dalam konteks, dan **mengevaluasi** kewajarannya.

| Misi | Konteks AKM | Level | Model | Hasil hitung → tafsiran |
|---|---|---|---|---|
| Kuota Internet Dina | Personal | Dasar | 6 + 2x ≤ 30 | x ≤ 12 → paling lama 12 hari |
| Ongkos Ojek Online | Sosial budaya | Dasar | 4x + 2 ≤ 30 | x ≤ 7 → paling jauh 7 km |
| Menabung untuk Sepatu | Personal | Dasar | 50 + 15x = 230 | x = 12 → 12 minggu (≈ 3 bulan) |
| Nilai Rata-rata Sari | Personal | Menengah | (70 + 80 + 68 + x)/4 ≥ 75 | x ≥ 82 → 82 sampai 100 (nilai maksimal 100) |
| Kapasitas Lift Barang | Saintifik | Menengah | 70 + 25x ≤ 800 | x ≤ 29,2 → **29 kotak** (bukan 29,2 atau 30) |
| Pagar Kebun Sayur | Sosial budaya | Menengah | 2(x + x + 3) = 46 | x = 10 → 10 m × 13 m, luas 130 m² |
| Sewa Sepeda di Taman | Sosial budaya | Tantangan | 10 + 5x < 8x | x > 10/3 → mulai 4 jam (perlu balik tanda) |
| Air di Tandon Rumah | Saintifik | Tantangan | 120 − 8x < 40 | x > 10 → setelah lebih dari 10 jam (perlu balik tanda) |

Pengecoh di tahap Rumuskan disusun dari kesalahan khas: salah memilih bilangan yang dikali x, salah arah tanda (≤ vs ≥), dan rumus yang tidak sesuai (luas vs keliling). Setiap pengecoh punya umpan balik sendiri.

## 6. Kuis Pemanasan Prasyarat (FR-01), contoh 8 butir

1. $-7+4=\ ?$ ($-3$)
2. $5-(-3)=\ ?$ ($8$)
3. $(-6)\times 3=\ ?$ ($-18$)
4. $(-12)\div(-4)=\ ?$ ($3$)
5. Mana yang lebih kecil: $-5$ atau $-2$? ($-5$)
6. Sederhanakan $3x+2x-4$ ($5x-4$)
7. Jabarkan $3(x-2)$ ($3x-6$)
8. Koefisien $x$ pada $7-4x$ adalah … ($-4$)

Aturan rekomendasi: salah ≥ 2 di butir 1–5 → sarankan kartu 0.1; salah ≥ 1 di butir 6–8 → sarankan kartu 0.2.
