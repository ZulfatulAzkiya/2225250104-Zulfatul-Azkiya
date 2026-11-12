"""Generator soal PLSV & PtLSV bertingkat (Dasar → Menengah → Tantangan).

Setiap soal dibuat dari penyelesaian bulat yang dipilih lebih dulu, lalu
diverifikasi: dapat diurai, himpunan penyelesaiannya tepat, dan dapat
diselesaikan langkah demi langkah.
"""

from __future__ import annotations

import hashlib
import random
from fractions import Fraction
from typing import Callable

from .aljabar import SIMBOL, format_bilangan, format_suku, himpunan, urai_kalimat
from .pemeriksa import selesaikan

TOPIK = ("plsv", "ptlsv")
LEVEL = ("dasar", "menengah", "tantangan")
REL_PTLSV = ("<", ">", "<=", ">=")

Templat = Callable[[random.Random, str], tuple[str, int]]


def _bukan_nol(r: random.Random, lo: int, hi: int) -> int:
    while True:
        v = r.randint(lo, hi)
        if v != 0:
            return v


def _s(*suku: tuple[int | Fraction, str]) -> str:
    return format_suku([(Fraction(v), j) for v, j in suku])


def _kurung(k: int, isi: str) -> str:
    depan = "" if k == 1 else ("−" if k == -1 else format_bilangan(Fraction(k)))
    return f"{depan}({isi})"


def _kalimat(kiri: str, rel: str, kanan: str) -> str:
    return f"{kiri} {SIMBOL[rel]} {kanan}"


# ------------------------------------------------------------------ dasar
def _t_tambah(r: random.Random, rel: str) -> tuple[str, int]:
    s, a = r.randint(0, 15), r.randint(1, 20)
    return _kalimat(_s((1, "x"), (a, "1")), rel, str(s + a)), s


def _t_kali(r: random.Random, rel: str) -> tuple[str, int]:
    a, s = r.randint(2, 9), r.randint(1, 12)
    return _kalimat(_s((a, "x")), rel, str(a * s)), s


def _t_kali_tambah(r: random.Random, rel: str) -> tuple[str, int]:
    a, s = r.randint(2, 9), r.randint(0, 10)
    b = r.choice([r.randint(1, 15), -r.randint(1, max(1, a * s))]) if s else r.randint(1, 15)
    return _kalimat(_s((a, "x"), (b, "1")), rel, str(a * s + b)), s


# --------------------------------------------------------------- menengah
def _t_dua_ruas(r: random.Random, rel: str) -> tuple[str, int]:
    a = r.randint(1, 9)
    c = r.choice([v for v in range(1, 10) if v != a])
    s, b = r.randint(-10, 10), _bukan_nol(r, -15, 15)
    d = (a - c) * s + b
    return _kalimat(_s((a, "x"), (b, "1")), rel, _s((c, "x"), (d, "1"))), s


def _t_konstanta_dulu(r: random.Random, rel: str) -> tuple[str, int]:
    a, s, b = r.randint(2, 9), r.randint(-10, 10), r.randint(1, 20)
    c = b - a * s
    return _kalimat(_s((b, "1"), (-a, "x")), rel, format_bilangan(Fraction(c))), s


def _t_koef_negatif(r: random.Random, rel: str) -> tuple[str, int]:
    a, s, b = r.randint(2, 9), r.randint(-10, 10), _bukan_nol(r, -15, 15)
    c = -a * s + b
    return _kalimat(_s((-a, "x"), (b, "1")), rel, format_bilangan(Fraction(c))), s


# -------------------------------------------------------------- tantangan
def _t_kurung(r: random.Random, rel: str) -> tuple[str, int]:
    a = _bukan_nol(r, -6, 6) if rel != "=" else r.randint(2, 6)
    if abs(a) == 1:
        a = 2 * a
    b, s = _bukan_nol(r, -9, 9), r.randint(-10, 10)
    return _kalimat(_kurung(a, _s((1, "x"), (b, "1"))), rel, format_bilangan(Fraction(a * (s + b)))), s


def _t_pecahan(r: random.Random, rel: str) -> tuple[str, int]:
    a = r.randint(2, 5) * (r.choice([1, -1]) if rel != "=" else 1)
    m, b = r.randint(-6, 6), _bukan_nol(r, -9, 9)
    s = a * m
    return _kalimat(_s((Fraction(1, a), "x"), (b, "1")), rel, format_bilangan(Fraction(m + b))), s


def _t_kurung_dua(r: random.Random, rel: str) -> tuple[str, int]:
    for _ in range(200):
        a = r.randint(2, 6)
        c = r.choice([v for v in range(2, 7) if v != a])
        b, s = _bukan_nol(r, -6, 6), r.randint(-10, 10)
        sisa = a * (s + b) - c * s
        if sisa % c == 0 and sisa != 0 and abs(sisa // c) <= 12:
            d = sisa // c
            kiri = _kurung(a, _s((1, "x"), (b, "1")))
            kanan = _kurung(c, _s((1, "x"), (d, "1")))
            return _kalimat(kiri, rel, kanan), s
    return _t_kurung(r, rel)


def _t_konstanta_dua_ruas(r: random.Random, rel: str) -> tuple[str, int]:
    a, c = r.randint(1, 6), r.randint(1, 6)
    s, b = r.randint(-8, 8), r.randint(1, 20)
    d = b - (a + c) * s
    return _kalimat(_s((b, "1"), (-a, "x")), rel, _s((c, "x"), (d, "1"))), s


TEMPLAT: dict[tuple[str, str], list[Templat]] = {
    ("plsv", "dasar"): [_t_tambah, _t_kali, _t_kali_tambah],
    ("plsv", "menengah"): [_t_dua_ruas, _t_konstanta_dulu, _t_koef_negatif],
    ("plsv", "tantangan"): [_t_kurung, _t_pecahan, _t_kurung_dua],
    ("ptlsv", "dasar"): [_t_tambah, _t_kali, _t_kali_tambah],
    # dua dari tiga templat menengah PASTI memerlukan pembalikan tanda
    ("ptlsv", "menengah"): [_t_konstanta_dulu, _t_koef_negatif, _t_dua_ruas],
    ("ptlsv", "tantangan"): [_t_kurung, _t_pecahan, _t_konstanta_dua_ruas],
}


def buat_soal(topik: str, level: str, acak: random.Random) -> dict:
    if (topik, level) not in TEMPLAT:
        raise ValueError("Topik atau level tidak dikenal.")
    for _ in range(100):
        templat = acak.choice(TEMPLAT[(topik, level)])
        rel = "=" if topik == "plsv" else acak.choice(REL_PTLSV)
        teks, s = templat(acak, rel)
        k = urai_kalimat(teks)
        h = himpunan(k.bentuk)
        # Arah relasi boleh berbalik (koefisien x negatif); batasnya harus tepat s.
        if h[0] != "x" or h[2] != Fraction(s) or abs(s) > 20:
            continue
        hasil = selesaikan(teks)
        if not hasil["langkah"]:
            continue
        return {
            "id": hashlib.sha1(teks.encode()).hexdigest()[:10],
            "topik": topik,
            "level": level,
            "soal": teks,
            "jawaban": hasil["jawaban"],
            "perlu_balik": any(lk["balik"] for lk in hasil["langkah"]),
            "banyak_langkah": len(hasil["langkah"]),
        }
    raise RuntimeError("Gagal membuat soal")  # pragma: no cover


def buat_paket(topik: str, level: str, jumlah: int = 5, seed: int | None = None) -> list[dict]:
    acak = random.Random(seed)
    paket: list[dict] = []
    terpakai: set[str] = set()
    # PtLSV menengah: minimal separuh soal melatih pembalikan tanda (temuan IL03, DS02).
    maks_tanpa_balik = jumlah // 2 if (topik, level) == ("ptlsv", "menengah") else jumlah
    while len(paket) < jumlah:
        soal = buat_soal(topik, level, acak)
        if soal["soal"] in terpakai:
            continue
        tanpa_balik = sum(1 for p in paket if not p["perlu_balik"])
        if not soal["perlu_balik"] and tanpa_balik >= maks_tanpa_balik:
            continue
        terpakai.add(soal["soal"])
        paket.append(soal)
    return paket
