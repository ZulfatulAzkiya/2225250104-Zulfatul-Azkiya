# Skema Data dan API

## 1. Data di Perangkat (localStorage, kunci `ulfaline:v1`)

```json
{
  "versi": 1,
  "profil": { "nama": "Sari", "kelas": "IX-A" },
  "pengaturan": { "teks": "normal | besar", "gerak": "normal | kurang", "tema": "otomatis | terang | gelap" },
  "prasyarat": { "skor": 75, "lemah": ["bilangan"], "waktu": 1794000000000 },
  "topik": { "plsv": { "kartu": 8, "dipelajari": true } },
  "latihan": { "ptlsv-menengah": { "terbaik": 80, "dikuasai": true, "kali": 2 } },
  "literasi": { "lift": { "terbaik": 100, "kali": 1 } },
  "sesi": [
    { "waktu": 1794000000000, "jenis": "latihan", "topik": "ptlsv", "level": "menengah",
      "skor": 80, "benar": 4, "total": 5, "kesalahan": { "E_TANDA_TIDAK_DIBALIK": 1 } }
  ]
}
```
- `sesi` menyimpan 100 sesi terakhir; dipakai untuk "Fokus perbaikan" dan halaman Progres.
- Level **dikuasai** jika nilai sesi ≥ 80. Level berikutnya terbuka setelah level sebelumnya dikuasai, atau bisa dibuka lebih awal dengan konfirmasi.
- Nilai latihan = persentase soal yang selesai **tanpa kesalahan langkah dan tanpa petunjuk tingkat 3**.
- Nilai misi literasi = 5 tahap × 20 (Pahami, Rumuskan, Selesaikan, Tafsirkan, Cek; benar pada percobaan pertama).

## 2. API Server (FastAPI)

Dokumentasi interaktif: `/api/docs`. Notasi operasi: `add:n`, `sub:n`, `mul:n`, `div:n`, `addx:k`, `subx:k`, `simplify` (n dan k bilangan bulat atau pecahan, mis. `-2`, `1/2`). Ekspresi boleh memakai `−`, `≤`, `≥`, atau ASCII.

| Metode & jalur | Isi | Hasil |
|---|---|---|
| `GET /api/kesehatan` | — | `{"status": "ok", "aplikasi": "ULFALINE"}` |
| `GET /api/soal?topik=ptlsv&level=menengah&jumlah=5` | `topik`: plsv/ptlsv; `level`: dasar/menengah/tantangan; `jumlah` 1–20 | `{"soal": [{"id","topik","level","soal","jawaban","perlu_balik","banyak_langkah"}]}` |
| `GET /api/pilihan-operasi?sebelum=2x+3=11` | — | `{"pilihan": ["sub:3","add:3","div:2"]}` (diacak) |
| `POST /api/periksa-operasi` | `{"sebelum","operasi"}` | `{"ok","kode","pesan"}` |
| `POST /api/periksa-langkah` | `{"sebelum","operasi","jawaban"}` | `{"ok","kode","pesan","harapan","selesai","cara_lain"}` |
| `POST /api/selesaikan` | `{"soal"}` | `{"soal","langkah":[{"sebelum","operasi","label","penjelasan","hasil","balik"}],"jawaban"}` |

Contoh:
```json
POST /api/periksa-langkah
{ "sebelum": "-2x > 4", "operasi": "div:-2", "jawaban": "x > -2" }
→ { "ok": false, "kode": "E_TANDA_TIDAK_DIBALIK", "harapan": "x < −2",
    "pesan": "Kamu mengali/membagi dengan bilangan NEGATIF. Tanda pertidaksamaannya perlu dibalik.",
    "selesai": false, "cara_lain": false }
```
Input yang tidak bisa dibaca menghasilkan `422` dengan `{"detail": {"kode": "INVALID_EXPR", "pesan": "…"}}`.

### Kode hasil
`OK`, `OK_CARA_LAIN`, `E_FORMAT`, `E_TANDA_TIDAK_DIBALIK`, `E_TANDA_DIBALIK_SALAH`, `E_TANDA_TERTUKAR`, `E_SATU_RUAS`, `E_PINDAH_RUAS`, `E_HITUNG_NEGATIF`, `E_DISTRIBUTIF`, `E_HITUNG`, `E_BELUM_DIOPERASIKAN`, `E_BELUM_SEDERHANA`, `E_TIDAK_MAJU`, `E_OPERASI_KURANG_TEPAT`, `SUDAH_SELESAI`.

## 3. Rancangan Tahap Berikutnya: Kelas & Dasbor Guru

Belum diimplementasikan di v1.0. Rancangan awal dengan Firebase:

- `users/{uid}`: `role` (guru/siswa), `displayName`, `classId`
- `classes/{classId}`: `name`, `code` (6 karakter), `teacherUid`
- `classes/{classId}/students/{id}`: `displayName`, `pinHash` (ditulis server saja)
- `progress/{uid}` dan `attempts/{id}`: salinan dari struktur §1, **ditulis oleh server Python** setelah memverifikasi langkah dengan `periksa_langkah`, sehingga nilai tidak bisa dipalsukan dari klien.
- Login siswa: kode kelas + nama panggilan + PIN → server membuat Firebase custom token.
- Aturan akses: siswa hanya membaca datanya sendiri; guru hanya membaca kelasnya sendiri.
