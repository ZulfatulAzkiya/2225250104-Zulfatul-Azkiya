# Panduan Menjalankan, Menerbitkan, dan Memasang ULFALINE

ULFALINE adalah **Progressive Web App (PWA)**: dibuka di browser, lalu bisa **dipasang (install) langsung dari browser**, tanpa Play Store atau App Store. Setelah terpasang, ULFALINE muncul di layar utama HP seperti aplikasi biasa dan tetap bisa dipakai saat offline.

## Ringkas: pilih cara mendapatkan link

| Kebutuhan | Cara | Link | Bisa dipasang di HP? |
|---|---|---|---|
| Mencoba di laptop sendiri | Klik dua kali `jalankan.bat` | `http://localhost:8000` (hanya di laptop itu) | Hanya di laptop |
| Demo/uji coba hari ini, tanpa akun | Klik dua kali `link-online.bat` | `https://….trycloudflare.com` (berubah setiap kali dijalankan; aktif selama laptop menyala) | ✅ |
| **Link permanen gratis (disarankan)** | Netlify Drop: seret folder `frontend` | `https://nama-anda.netlify.app` | ✅ |
| Link permanen + server Python | Render.com (bagian 2) | `https://ulfaline.onrender.com` | ✅ |

**Netlify Drop, langkah demi langkah (±5 menit):**
1. Buka **https://app.netlify.com/drop** di laptop.
2. Masuk/daftar gratis (bisa pakai akun Google atau email).
3. Seret **folder `frontend`** (bukan seluruh proyek) ke kotak di halaman itu.
4. Tunggu beberapa detik, lalu Netlify memberi link HTTPS. Ganti namanya di *Site configuration → Change site name*, misalnya `ulfaline-smp`, sehingga link menjadi `https://ulfaline-smp.netlify.app`.
5. Bagikan link ke siswa. Di HP, buka link lalu ketuk **📲 Pasang Aplikasi**.

Di hosting statis seperti ini, soal latihan diambil dari **bank 900 soal** yang dibuat program Python (`scripts/ekspor_bank_soal.py`). Untuk memperbarui, perbarui file di `frontend`, lalu seret ulang folder di menu *Deploys* situs tersebut.

## 1. Menjalankan di Komputer Sendiri (untuk pengembangan/uji)

Syarat: **Python 3.10 atau lebih baru**.

**Cara termudah (Windows):** klik dua kali `jalankan.bat`. Browser akan terbuka di `http://localhost:8000`.

**Cara manual:**
```bash
cd backend
python -m venv .venv
.venv\Scripts\activate            # Windows  (Linux/Mac: source .venv/bin/activate)
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```
Buka `http://localhost:8000`. Dokumentasi API otomatis tersedia di `http://localhost:8000/api/docs`.

> Di `localhost`, aplikasi sudah bisa dipasang di komputer yang sama (Chrome/Edge: ikon ⊕ di bilah alamat).

## 2. Menerbitkan Online (agar bisa dibuka & dipasang di HP siswa)

Browser hanya mengizinkan pemasangan PWA dari alamat **HTTPS**. Membuka lewat IP jaringan lokal (mis. `http://192.168.1.5:8000`) tetap bisa untuk dicoba, tetapi **tidak bisa dipasang**.

### Pilihan A: Render.com (gratis, disarankan)
1. Unggah folder proyek ke repositori GitHub.
2. Masuk ke [render.com](https://render.com), pilih **New → Blueprint**, lalu pilih repositori tersebut. File `render.yaml` dan `Dockerfile` sudah disiapkan.
3. Setelah selesai, Render memberi alamat seperti `https://ulfaline.onrender.com`.

Catatan paket gratis: server "tertidur" setelah tidak dipakai beberapa menit, sehingga pembukaan pertama bisa lambat (±30–60 detik). Selama itu latihan tetap berjalan karena aplikasi memakai **bank 360 soal di perangkat**.

### Pilihan B: layanan lain yang mendukung Docker atau Python
Contohnya Google Cloud Run, Railway, Fly.io, atau VPS. Jalankan container dari `Dockerfile`, atau perintah:
`uvicorn app.main:app --host 0.0.0.0 --port $PORT` dari folder `backend`.

## 3. Memasang di Perangkat Siswa

| Perangkat | Langkah |
|---|---|
| **Android (Chrome)** | Buka alamat ULFALINE → ketuk **"📲 Pasang Aplikasi"** di Beranda/Akun, atau menu ⋮ → **Instal aplikasi**. |
| **iPhone/iPad (Safari)** | Buka alamat ULFALINE di Safari → tombol **Bagikan** → **Tambahkan ke Layar Utama**. |
| **Laptop (Chrome/Edge)** | Ikon ⊕ / "Instal ULFALINE" di bilah alamat. |

Setelah dibuka sekali saat online, materi, latihan, dan misi literasi bisa dipakai **offline**.

## 4. (Opsional) File APK tanpa Play Store
Jika sekolah membutuhkan file `.apk` untuk dibagikan langsung:
1. Terbitkan ULFALINE secara online (bagian 2).
2. Buka [pwabuilder.com](https://www.pwabuilder.com), masukkan alamat ULFALINE, pilih **Package for stores → Android**, lalu unduh paketnya.
3. Bagikan file APK. Penerima perlu mengizinkan "Instal dari sumber tidak dikenal".

Tidak perlu Node.js atau Android Studio, karena APK tersebut membungkus aplikasi web yang sama.

## 5. Memperbarui Aplikasi
- Ubah file di `frontend/` atau `backend/`, lalu terbitkan ulang.
- Naikkan `VERSI` di `frontend/sw.js` (mis. `ulfaline-v1.0.1`) agar cache offline di HP siswa ikut diperbarui.
- Jika file frontend baru ditambahkan, daftarkan juga di `BERKAS` dalam `sw.js`. Tes `test_frontend.py` akan gagal jika lupa.
