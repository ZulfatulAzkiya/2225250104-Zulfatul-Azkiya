"""Pemeriksa operasi & langkah siswa, klasifikasi kesalahan, petunjuk, dan penyelesaian.

Kode kesalahan (E_*) sesuai katalog di docs/konten-materi.md §5.
"""

from __future__ import annotations

import random
from fractions import Fraction

from .aljabar import (
    CERMIN,
    Bentuk,
    GalatBentuk,
    format_bentuk,
    format_bilangan,
    format_himpunan,
    himpunan,
    urai_kalimat,
)
from .operasi import (
    Operasi,
    jarak,
    jelaskan_operasi,
    label_operasi,
    membalik,
    rencana,
    selesai,
    terapkan,
)

PESAN = {
    "OK": "Tepat!",
    "OK_CARA_LAIN": "Benar! Kamu memakai cara yang sedikit berbeda, dan itu boleh.",
    "E_FORMAT": "Tulisanmu belum bisa dibaca. Contoh penulisan: 2x + 3",
    "E_TANDA_TIDAK_DIBALIK": (
        "Kamu mengali/membagi dengan bilangan NEGATIF. Tanda pertidaksamaannya perlu dibalik."
    ),
    "E_TANDA_DIBALIK_SALAH": (
        "Tandanya tidak perlu dibalik. Tanda hanya dibalik saat dikali/dibagi bilangan negatif."
    ),
    "E_TANDA_TERTUKAR": (
        "Ruasnya sudah tepat, tetapi tandanya belum. Ingat: < kurang dari, > lebih dari, "
        "≤ dan ≥ termasuk sama dengan."
    ),
    "E_SATU_RUAS": (
        "Operasinya baru dilakukan di satu ruas. Ingat timbangan: lakukan di KEDUA ruas."
    ),
    "E_PINDAH_RUAS": (
        "Di salah satu ruas kamu memakai operasi kebalikannya. "
        "Lakukan operasi yang sama persis di kedua ruas."
    ),
    "E_HITUNG_NEGATIF": (
        "Hampir tepat! Ada tanda positif/negatif yang tertukar. Cek lagi hitungan bilangan negatifnya."
    ),
    "E_DISTRIBUTIF": (
        "Saat menjabarkan, kalikan bilangan di depan kurung ke SETIAP suku di dalam kurung."
    ),
    "E_HITUNG": "Hasilnya belum tepat. Cek lagi perhitungannya pelan-pelan.",
    "E_BELUM_DIOPERASIKAN": "Bentuknya masih sama seperti sebelumnya. Terapkan dulu operasinya.",
    "E_BELUM_SEDERHANA": "Masih ada tanda kurung atau suku sejenis. Sederhanakan dulu.",
    "E_TIDAK_MAJU": "Bentuknya setara, tetapi belum lebih sederhana. Coba lagi.",
}

LABEL_KESALAHAN = {
    "E_TANDA_TIDAK_DIBALIK": "Lupa membalik tanda",
    "E_TANDA_DIBALIK_SALAH": "Membalik tanda padahal tidak perlu",
    "E_TANDA_TERTUKAR": "Simbol pertidaksamaan tertukar",
    "E_SATU_RUAS": "Operasi hanya di satu ruas",
    "E_PINDAH_RUAS": "Operasi berlawanan di salah satu ruas",
    "E_HITUNG_NEGATIF": "Salah tanda bilangan negatif",
    "E_DISTRIBUTIF": "Penjabaran kurung belum lengkap",
    "E_HITUNG": "Salah hitung",
    "E_FORMAT": "Penulisan belum tepat",
    "E_BELUM_DIOPERASIKAN": "Operasi belum diterapkan",
    "E_BELUM_SEDERHANA": "Belum disederhanakan",
    "E_TIDAK_MAJU": "Langkah belum maju",
    "E_OPERASI_KURANG_TEPAT": "Pilihan operasi kurang tepat",
}


def _orientasi(s: Bentuk, e: Bentuk) -> str | None:
    if s.l == e.l and s.r == e.r:
        return "lurus"
    if s.l == e.r and s.r == e.l:
        return "tukar"
    return None


def cocok_struktur(s: Bentuk, e: Bentuk) -> bool:
    o = _orientasi(s, e)
    if o == "lurus":
        return s.rel == e.rel
    if o == "tukar":
        return CERMIN[s.rel] == e.rel
    return False


def _sama_mutlak(p, q) -> bool:
    return abs(p.a) == abs(q.a) and abs(p.b) == abs(q.b)


def _klasifikasi(k: Bentuk, op: Operasi, e: Bentuk, s: Bentuk, ada_kurung: bool) -> str:
    o = _orientasi(s, e)
    if o:
        rel_s = s.rel if o == "lurus" else CERMIN[s.rel]
        if e.rel != "=":
            if membalik(op, k.rel) and rel_s == k.rel:
                return "E_TANDA_TIDAK_DIBALIK"
            if not membalik(op, k.rel) and rel_s == CERMIN[e.rel]:
                return "E_TANDA_DIBALIK_SALAH"
        return "E_TANDA_TERTUKAR"
    if op.jenis != "simplify":
        if (s.l == e.l and s.r == k.r) or (s.l == k.l and s.r == e.r):
            return "E_SATU_RUAS"
        b = terapkan(k, op.invers())
        if (s.l == e.l and s.r == b.r) or (s.l == b.l and s.r == e.r):
            return "E_PINDAH_RUAS"
    if (_sama_mutlak(s.l, e.l) and _sama_mutlak(s.r, e.r)) or (
        _sama_mutlak(s.l, e.r) and _sama_mutlak(s.r, e.l)
    ):
        return "E_HITUNG_NEGATIF"
    if op.jenis == "simplify" and ada_kurung:
        return "E_DISTRIBUTIF"
    return "E_HITUNG"


def periksa_operasi(sebelum: str, op_teks: str) -> dict:
    """Apakah operasi yang dipilih membawa soal lebih dekat ke x sendirian?"""
    k = urai_kalimat(sebelum)
    op = Operasi.dari_teks(op_teks)
    saran = rencana(k)
    if saran is None:
        return {"ok": False, "kode": "SUDAH_SELESAI", "pesan": "x sudah sendirian. Soal selesai!"}
    if op.jenis == "simplify":
        maju = not k.sederhana
    else:
        # Operasi selain "sederhanakan" tidak menghapus kurung, jadi status sederhana tetap.
        maju = jarak(terapkan(k.bentuk, op), k.sederhana) < jarak(k.bentuk, k.sederhana)
    if maju:
        pesan = PESAN["OK"]
        if membalik(op, k.bentuk.rel):
            pesan = "Tepat! Hati-hati: kamu akan mengali/membagi dengan bilangan negatif."
        return {"ok": True, "kode": "OK", "pesan": pesan}
    return {"ok": False, "kode": "E_OPERASI_KURANG_TEPAT", "pesan": _pesan_operasi(k, op, saran)}


def _pesan_operasi(k, op: Operasi, saran: Operasi) -> str:
    js = saran.jenis
    if js == "mul":
        return "Ada pecahan. Hilangkan dulu pecahannya dengan mengalikan penyebutnya."
    if js == "simplify":
        return "Sederhanakan dulu: jabarkan tanda kurung dan gabungkan suku sejenis."
    if js in ("addx", "subx"):
        return "x masih ada di kedua ruas. Kumpulkan dulu suku x di satu ruas."
    if js in ("add", "sub"):
        if op.jenis in ("mul", "div"):
            return "Boleh saja, tetapi nanti muncul pecahan. Lebih mudah hilangkan konstantanya dulu."
        return (
            "Operasi ini belum menghilangkan bilangan di ruas x. "
            "Gunakan kebalikan dari bilangan tersebut."
        )
    # saran div
    if op.jenis == "div" and op.nilai == -saran.nilai:
        return f"Masih tersisa −x. Bagi dengan koefisien x beserta tandanya ({format_bilangan(saran.nilai)})."
    if op.jenis == "mul" and op.nilai == saran.nilai:
        return f"x sedang dikali {format_bilangan(saran.nilai)}. Kebalikan dari perkalian adalah pembagian."
    return "Pilih operasi yang membuat koefisien x menjadi 1."


def periksa_langkah(sebelum: str, op_teks: str, jawaban: str) -> dict:
    k = urai_kalimat(sebelum)
    op = Operasi.dari_teks(op_teks)
    e = terapkan(k.bentuk, op)
    hasil = {"harapan": format_bentuk(e), "selesai": False, "cara_lain": False}
    try:
        sk = urai_kalimat(jawaban)
    except GalatBentuk as g:
        return {**hasil, "ok": False, "kode": "E_FORMAT", "pesan": f"{PESAN['E_FORMAT']} ({g})"}
    s = sk.bentuk

    def benar(kode: str, cara_lain: bool = False) -> dict:
        return {**hasil, "ok": True, "kode": kode, "pesan": PESAN[kode],
                "selesai": selesai(s) and sk.sederhana, "cara_lain": cara_lain}

    if cocok_struktur(s, e):
        if op.jenis == "simplify" and not sk.sederhana:
            return {**hasil, "ok": False, "kode": "E_BELUM_SEDERHANA", "pesan": PESAN["E_BELUM_SEDERHANA"]}
        return benar("OK")
    if himpunan(s) == himpunan(k.bentuk):
        if cocok_struktur(s, k.bentuk):
            return {**hasil, "ok": False, "kode": "E_BELUM_DIOPERASIKAN",
                    "pesan": PESAN["E_BELUM_DIOPERASIKAN"]}
        if jarak(s, sk.sederhana) < jarak(k.bentuk, k.sederhana):
            return benar("OK_CARA_LAIN", True)
        return {**hasil, "ok": False, "kode": "E_TIDAK_MAJU", "pesan": PESAN["E_TIDAK_MAJU"]}
    kode = _klasifikasi(k.bentuk, op, e, s, "(" in sebelum)
    return {**hasil, "ok": False, "kode": kode, "pesan": PESAN[kode]}


def pilihan_operasi(sebelum: str, acak: random.Random | None = None) -> list[str]:
    """Tiga pilihan operasi: satu yang disarankan + dua pengecoh yang tidak membuat maju."""
    k = urai_kalimat(sebelum)
    saran = rencana(k)
    if saran is None:
        return []
    b = k.bentuk
    sisi = b.l if b.l.a != 0 else b.r
    a = sisi.a
    calon: list[Operasi] = []
    n = saran.nilai
    if saran.jenis in ("add", "sub"):
        calon += [Operasi("sub" if saran.jenis == "add" else "add", n)]
        if a not in (0, 1, -1):
            calon += [Operasi("div", a), Operasi("mul", abs(a))]
    elif saran.jenis == "div":
        calon += [Operasi("mul", n)]
        if abs(n) != 1:
            calon += [Operasi("div", -n)]
        calon += [Operasi("sub", abs(n))]
    elif saran.jenis in ("addx", "subx"):
        calon += [Operasi("subx" if saran.jenis == "addx" else "addx", n), Operasi("sub", n)]
    elif saran.jenis == "mul":
        calon += [Operasi("div", n), Operasi("add", n)]
    calon += [Operasi("mul", Fraction(-1)), Operasi("add", Fraction(1)), Operasi("mul", Fraction(2))]

    pilihan = [saran.teks()]
    for c in calon:
        t = c.teks()
        if t in pilihan:
            continue
        if not periksa_operasi(sebelum, t)["ok"]:
            pilihan.append(t)
        if len(pilihan) == 3:
            break
    (acak or random).shuffle(pilihan)
    return pilihan


def petunjuk(sebelum: str, tingkat: int) -> str:
    """Petunjuk bertingkat: 1 = arah umum, 2 = operasi, 3 = hasil langkah."""
    k = urai_kalimat(sebelum)
    saran = rencana(k)
    if saran is None:
        return "x sudah sendirian. Soal selesai!"
    if tingkat >= 3:
        return f"Hasil langkah ini: {format_bentuk(terapkan(k.bentuk, saran))}"
    if tingkat == 2:
        return f"Gunakan operasi: {label_operasi(saran)}. {jelaskan_operasi(saran, k.bentuk.rel)}"
    umum = {
        "mul": "Ada pecahan. Bagaimana cara menghilangkan penyebutnya?",
        "simplify": "Ada tanda kurung atau suku sejenis. Rapikan dulu bentuknya.",
        "addx": "x ada di kedua ruas. Kumpulkan suku x di satu ruas.",
        "subx": "x ada di kedua ruas. Kumpulkan suku x di satu ruas.",
        "add": "Tujuanmu: x sendirian. Bilangan apa yang masih menempel di ruas x?",
        "sub": "Tujuanmu: x sendirian. Bilangan apa yang masih menempel di ruas x?",
        "div": "x masih dikali sebuah bilangan. Apa kebalikan dari perkalian?",
    }[saran.jenis]
    if membalik(saran, k.bentuk.rel):
        umum += " Perhatikan tanda bilangannya!"
    return umum


def selesaikan(soal: str) -> dict:
    """Langkah-langkah penyelesaian kanonik untuk contoh soal & pembahasan."""
    k = urai_kalimat(soal)
    langkah = []
    sekarang = soal
    for _ in range(10):
        op = rencana(k)
        if op is None:
            break
        e = terapkan(k.bentuk, op)
        berikut = format_bentuk(e)
        langkah.append({
            "sebelum": sekarang,
            "operasi": op.teks(),
            "label": label_operasi(op),
            "penjelasan": jelaskan_operasi(op, k.bentuk.rel),
            "hasil": berikut,
            "balik": membalik(op, k.bentuk.rel),
        })
        sekarang = berikut
        k = urai_kalimat(berikut)
    else:  # pragma: no cover - pengaman, rencana selalu berhenti
        raise RuntimeError("Penyelesaian tidak berhenti")
    return {"soal": soal, "langkah": langkah, "jawaban": format_himpunan(himpunan(k.bentuk))}
