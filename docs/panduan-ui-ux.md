# Panduan UI/UX

Panduan ini menerjemahkan temuan **EL** dan **DS** dari wawancara menjadi aturan desain yang **wajib** diikuti.

## 1. Aturan Emas (Wajib)

1. **Satu konsep per layar.** Jika perlu scroll untuk memahami satu konsep, pecah menjadi dua kartu. *(DS05, EL01)*
2. **Teks ≤ ~40 kata per kartu**, kalimat ≤ 15 kata, instruksi 1 kalimat. *(EL05, DS04)*
3. **Tanpa autoplay dan tanpa timer** di mode belajar. Siswa yang menekan "Lanjut". *(EL04)*
4. **Simbol dijelaskan sebelum dipakai.** Simbol baru selalu didampingi cara bacanya. *(EL03)*
5. **Animasi hanya untuk konsep** (timbangan, garis bilangan, perpindahan langkah). Tidak ada animasi dekoratif, maskot bergerak, atau confetti panjang. *(DS05)*
6. **Navigasi siswa maksimal 4 menu utama**, ikon + label teks (bukan ikon saja). *(DS04)*
7. **Pola tombol konsisten:** Kembali kiri, Lanjut/Periksa kanan, di posisi yang sama di semua layar.
8. **Penjelasan dekat dengan objeknya** (spatial contiguity): label operasi tepat di antara baris persamaan.

## 2. Warna

Gunakan token CSS (variabel) agar mudah diubah dan mendukung mode gelap.

| Token | Terang | Gelap | Fungsi |
|---|---|---|---|
| `--bg` | `#FAFAF7` | `#16181D` | Latar |
| `--surface` | `#FFFFFF` | `#1F2229` | Kartu |
| `--text` | `#1F2328` | `#E8EAED` | Teks utama |
| `--text-muted` | `#5B626B` | `#A6ADB7` | Teks sekunder |
| `--primary` | `#2F5BD3` | `#7FA2FF` | Tombol utama, progres |
| `--op` | `#C2570C` | `#FFA45C` | **Label operasi** ("kedua ruas −3") |
| `--var` | `#6D3FC0` | `#B897FF` | Variabel $x$ (opsional) |
| `--flip` | `#B42318` | `#FF8A80` | **Peringatan pembalikan tanda** |
| `--success` | `#1A7F37` | `#5FD07A` | Benar |
| `--error` | `#B42318` | `#FF8A80` | Salah |

Aturan:
- Semua pasangan teks/latar memenuhi kontras **WCAG AA (≥ 4,5 : 1)**.
- Warna **tidak boleh menjadi satu-satunya** penanda: benar/salah juga memakai ikon ✓/✗, dan peringatan memakai ikon ⚠️.
- Warna yang sama dipakai untuk makna yang sama di seluruh aplikasi (misalnya oranye selalu berarti "operasi yang dilakukan").

## 3. Tipografi

- Font: Nunito/Segoe UI (font sistem) untuk teks; font matematika serif (Cambria Math) dengan x miring berwarna untuk rumus.
- Ukuran: teks dasar **16–18 px**, persamaan utama **24–28 px**, judul 20–22 px.
- Tinggi baris 1,5; lebar baris maksimal ~60 karakter.
- Pengaturan "Ukuran teks" (Normal/Besar) di menu Akun (FR-18).

## 4. Tata Letak dan Interaksi

- Desain **mobile-first** untuk lebar 360 px; di desktop konten dibatasi lebar maksimal 720 px (kecuali dasbor guru).
- Margin samping 16 px; jarak antarelemen kelipatan 8 px.
- Target sentuh **≥ 48 × 48 dp**.
- Input jawaban: keyboard numerik bawaan + tombol khusus `−`, `x`, `<`, `>`, `≤`, `≥` (siswa tidak perlu mencari simbol di keyboard).
- Pemilih tanda pertidaksamaan berupa tombol besar, bukan dropdown kecil.

## 5. Animasi

| Boleh | Tidak boleh |
|---|---|
| Transisi langkah (fade/slide ≤ 300 ms) | Animasi berulang terus-menerus |
| Timbangan miring/seimbang | Maskot berbicara atau bergerak di setiap layar |
| Titik bercermin di garis bilangan | Efek suara otomatis |
| Sorotan singkat pada angka yang berubah | Confetti/kembang api > 1 detik |

- Hormati `prefers-reduced-motion` dan pengaturan "Kurangi gerakan": ganti animasi dengan perubahan statis bertahap.
- Gunakan SVG + transisi CSS; hindari video dan Lottie berat.

## 6. Bahasa dan Nada

- Sapaan "kamu", kalimat aktif, ramah, tidak menggurui.
- Umpan balik fokus pada **langkah**, bukan pada siswa: "Langkah ke-2 perlu dicek", bukan "Kamu salah lagi".
- Istilah konsisten dengan buku: *ruas kiri/kanan, koefisien, variabel, konstanta, himpunan penyelesaian*.
- Hindari singkatan di layar siswa (tulis "persamaan linear satu variabel" pada kemunculan pertama, lalu boleh "PLSV").

## 7. Aksesibilitas

- Semua tombol punya label yang terbaca screen reader (`aria-label`).
- Rumus KaTeX disertai teks alternatif (misalnya "minus dua x lebih dari empat").
- Fokus keyboard terlihat jelas di versi web.
- Tidak bergantung pada warna saja (lihat §2).

## 8. Checklist Review Layar

Sebelum sebuah layar dianggap selesai:
- [ ] Hanya 1 konsep?
- [ ] Teks ≤ 40 kata?
- [ ] Simbol baru sudah dijelaskan?
- [ ] Tidak ada autoplay atau animasi dekoratif?
- [ ] Tombol Kembali/Lanjut di posisi standar?
- [ ] Kontras AA dan target sentuh ≥ 48 dp?
- [ ] Berfungsi di lebar 360 px dan dengan "Kurangi gerakan" aktif?
