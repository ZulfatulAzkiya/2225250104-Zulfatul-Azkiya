# Privasi dan Keamanan Data

Pengguna utama aplikasi adalah **anak di bawah umur** (siswa SMP), sehingga prinsip yang dipakai adalah **data seminimal mungkin**. Acuan: UU No. 27 Tahun 2022 tentang Pelindungan Data Pribadi (PDP), yang mensyaratkan persetujuan orang tua/wali untuk pemrosesan data pribadi anak, serta etika penelitian pendidikan.

## 0. Kondisi v1.0 (sudah dibangun)

- Siswa hanya mengisi **nama panggilan** dan (opsional) **kelas**. Tidak ada email, nomor HP, atau kata sandi.
- Progres, nilai, dan riwayat disimpan **hanya di perangkat siswa** (`localStorage`). Server Python tidak menerima atau menyimpan data siswa; server hanya mengirim soal.
- Halaman Akun berisi penjelasan "Tentang data" dan tombol **"Hapus semua data saya"**.
- Tidak ada iklan, analitik, atau pelacak pihak ketiga.

Bagian 1–5 di bawah berlaku saat fitur kelas & dasbor guru (tahap berikutnya) dibangun.

## 1. Data yang Dikumpulkan (tahap kelas & dasbor guru)

| Data | Siswa | Guru | Tujuan |
|---|---|---|---|
| Nama panggilan | ✅ | ✅ | Identitas di kelas |
| Email | ❌ | ✅ (Firebase Auth) | Login guru |
| PIN (di-hash bcrypt) | ✅ | — | Login siswa |
| Kode kelas | ✅ | ✅ | Pengelompokan |
| Jawaban, langkah, nilai, jenis kesalahan | ✅ | — | Umpan balik & dasbor guru |
| Nama lengkap, NISN, foto, nomor HP, lokasi | ❌ **tidak dikumpulkan** | ❌ | — |

Tidak ada iklan, analitik pihak ketiga, atau pelacakan lintas aplikasi.

## 2. Persetujuan

- Akun siswa **dibuat oleh guru**, bukan oleh siswa sendiri.
- Sebelum uji coba: surat izin sekolah, persetujuan guru, dan **lembar persetujuan orang tua/wali** serta *assent* siswa (sejalan dengan prosedur wawancara sebelumnya yang meminta persetujuan siswa dan guru).
- Halaman "Tentang Data" singkat di aplikasi menjelaskan data apa yang disimpan dan siapa yang bisa melihatnya.

## 3. Kontrol Akses

| Peran | Bisa melihat | Bisa mengubah |
|---|---|---|
| Siswa | Progres & riwayat dirinya sendiri | Pengaturan dirinya; progres melalui backend |
| Guru | Progres & riwayat siswa **di kelasnya saja** | Kelas miliknya, daftar siswa, reset PIN |
| Backend (service account) | Semua | Semua (hanya untuk operasi yang didefinisikan API) |

Ditegakkan oleh Firestore Security Rules ([skema-data-dan-api.md](skema-data-dan-api.md) §2) dan verifikasi token di FastAPI.

## 4. Keamanan Teknis

- PIN disimpan sebagai **hash bcrypt**, tidak pernah dalam bentuk teks biasa; dikunci 5 menit setelah 5 kali salah.
- Rate limit untuk `/auth/siswa` dan `/kelas/{code}/nama` agar kode kelas tidak bisa ditebak secara massal.
- Kredensial service account hanya disimpan di variabel lingkungan server, **tidak** di repositori atau di aplikasi Android.
- `.env`, `serviceAccount*.json`, dan keystore Android masuk `.gitignore`.
- Parser ekspresi matematika memakai whitelist (tanpa `eval`/`sympify` mentah pada input pengguna).
- HTTPS di semua komunikasi.

## 5. Retensi dan Penghapusan

- Data uji coba disimpan sampai penelitian selesai (perkiraan: akhir semester), lalu **dihapus** atau **dianonimkan** (nama panggilan diganti kode S01, S02, …) untuk keperluan analisis skripsi/laporan.
- Guru dapat menghapus siswa atau kelas; penghapusan juga menghapus `progress` dan `attempts` terkait (lewat endpoint backend).

## 6. Pelaporan Penelitian

Dalam laporan, gunakan **kode siswa** (seperti pada laporan wawancara S02), bukan nama. Tangkapan layar dasbor untuk laporan harus memakai data dummy atau nama yang disamarkan.
