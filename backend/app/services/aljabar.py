"""Parser dan representasi bentuk linear satu variabel (x).

Input siswa TIDAK pernah dievaluasi dengan eval/sympify. Teks dinormalisasi,
dicek dengan whitelist karakter, lalu diurai oleh parser rekursif kecil.

Logika di file ini dicerminkan 1:1 oleh frontend/js/mesin.js
(diuji kesetaraannya oleh tests/test_paritas_js.py).
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from fractions import Fraction
from math import lcm

MAKS_PANJANG = 120
RELASI = ("<=", ">=", "<", ">", "=")
# Menukar ruas ATAU mengali dengan bilangan negatif sama-sama membalik arah relasi.
CERMIN = {"=": "=", "<": ">", ">": "<", "<=": ">=", ">=": "<="}
SIMBOL = {"=": "=", "<": "<", ">": ">", "<=": "≤", ">=": "≥"}

# Pola suku yang dianggap "sudah sederhana".
# N = bilangan, x = variabel, / = pembagian. Contoh: 3x -> "Nx", 2x/3 -> "Nx/N".
_POLA_SEDERHANA = {"N", "x", "Nx", "x/N", "Nx/N", "N/N"}

_GANTI = [
    ("−", "-"), ("–", "-"), ("≤", "<="), ("≥", ">="), ("×", "*"), ("·", "*"),
    ("÷", "/"), (":", "/"), (",", "."), ("X", "x"), ("=<", "<="), ("=>", ">="),
]
_TOKEN = re.compile(r"\d+(?:\.\d+)?|<=|>=|[x+\-*/()<>=]")
_IZIN = re.compile(r"[0-9x+\-*/().<>=]+")


class GalatBentuk(ValueError):
    """Teks tidak dapat dibaca sebagai bentuk linear satu variabel."""


@dataclass(frozen=True)
class Linear:
    """Bentuk a·x + b dengan koefisien pecahan eksak."""

    a: Fraction
    b: Fraction

    def __add__(self, o: Linear) -> Linear:
        return Linear(self.a + o.a, self.b + o.b)

    def __sub__(self, o: Linear) -> Linear:
        return Linear(self.a - o.a, self.b - o.b)

    def kali(self, k: Fraction) -> Linear:
        return Linear(self.a * k, self.b * k)


@dataclass(frozen=True)
class Bentuk:
    """Kalimat matematika yang sudah dinormalisasi: l rel r."""

    l: Linear
    rel: str
    r: Linear


@dataclass(frozen=True)
class Kalimat:
    """Hasil parsing teks: bentuk normal + apakah tulisan aslinya sudah sederhana."""

    bentuk: Bentuk
    sederhana: bool


@dataclass(frozen=True)
class Ruas:
    lin: Linear
    sederhana: bool
    ada_kurung: bool


def normalisasi(teks: str) -> str:
    if len(teks) > MAKS_PANJANG:
        raise GalatBentuk("Tulisan terlalu panjang.")
    s = teks
    for lama, baru in _GANTI:
        s = s.replace(lama, baru)
    s = re.sub(r"\s+", "", s)
    if not s:
        raise GalatBentuk("Jawaban masih kosong.")
    if not _IZIN.fullmatch(s):
        raise GalatBentuk("Ada karakter yang tidak dikenal.")
    return s


def tokenisasi(s: str) -> list[str]:
    tokens = _TOKEN.findall(s)
    if "".join(tokens) != s:
        raise GalatBentuk("Penulisan bilangan tidak dikenal.")
    return tokens


def _bilangan(tok: str) -> Fraction:
    return Fraction(tok)  # "29.2" -> 146/5 (eksak)


class _Pengurai:
    def __init__(self, tokens: list[str]) -> None:
        self.t = tokens
        self.i = 0
        self.ada_kurung = False

    def lihat(self) -> str | None:
        return self.t[self.i] if self.i < len(self.t) else None

    def ambil(self) -> str:
        tok = self.lihat()
        if tok is None:
            raise GalatBentuk("Tulisan belum lengkap.")
        self.i += 1
        return tok

    # ekspresi := suku (('+'|'-') suku)*
    def ekspresi(self) -> tuple[Linear, list[tuple[str, int, bool]]]:
        lin, info = self.suku()
        daftar = [info]
        while self.lihat() in ("+", "-"):
            op = self.ambil()
            kanan, info = self.suku()
            lin = lin + kanan if op == "+" else lin - kanan
            daftar.append(info)
        return lin, daftar

    # suku := unary (('*'|'/'|implisit) unary)*
    def suku(self) -> tuple[Linear, tuple[str, int, bool]]:
        lin, pola, tanda = self.unary()
        while True:
            tok = self.lihat()
            if tok == "*":
                self.ambil()
                kanan, p, t = self.unary()
                lin, pola, tanda = _kali(lin, kanan), pola + p, tanda + t
            elif tok == "/":
                self.ambil()
                kanan, p, t = self.unary()
                lin, pola, tanda = _bagi(lin, kanan), pola + "/" + p, tanda + t
            elif tok is not None and (tok == "x" or tok == "(" or tok[0].isdigit()):
                kanan, p = self.primer()
                lin, pola = _kali(lin, kanan), pola + p
            else:
                break
        return lin, (pola, tanda, "x" in pola)

    def unary(self) -> tuple[Linear, str, int]:
        tanda = 0
        negatif = False
        while self.lihat() in ("+", "-"):
            tanda += 1
            if self.ambil() == "-":
                negatif = not negatif
        lin, pola = self.primer()
        return (lin.kali(Fraction(-1)) if negatif else lin), pola, tanda

    def primer(self) -> tuple[Linear, str]:
        tok = self.ambil()
        if tok == "x":
            return Linear(Fraction(1), Fraction(0)), "x"
        if tok == "(":
            self.ada_kurung = True
            lin, _ = self.ekspresi()
            if self.ambil() != ")":
                raise GalatBentuk("Tanda kurung belum ditutup.")
            return lin, "P"
        if tok[0].isdigit():
            return Linear(Fraction(0), _bilangan(tok)), "N"
        raise GalatBentuk("Penulisan belum tepat.")


def _kali(p: Linear, q: Linear) -> Linear:
    if p.a != 0 and q.a != 0:
        raise GalatBentuk("x dikali x bukan bentuk linear.")
    return q.kali(p.b) if p.a == 0 else p.kali(q.b)


def _bagi(p: Linear, q: Linear) -> Linear:
    if q.a != 0:
        raise GalatBentuk("Pembagian oleh x bukan bentuk linear.")
    if q.b == 0:
        raise GalatBentuk("Tidak boleh membagi dengan nol.")
    return p.kali(1 / q.b)


def _urai_ruas(tokens: list[str]) -> Ruas:
    if not tokens:
        raise GalatBentuk("Salah satu ruas masih kosong.")
    p = _Pengurai(tokens)
    lin, daftar = p.ekspresi()
    if p.lihat() is not None:
        raise GalatBentuk("Penulisan belum tepat.")
    suku_x = sum(1 for _, _, ada_x in daftar if ada_x)
    suku_k = len(daftar) - suku_x
    sederhana = (
        not p.ada_kurung
        and suku_x <= 1
        and suku_k <= 1
        and all(pola in _POLA_SEDERHANA and tanda <= 1 for pola, tanda, _ in daftar)
    )
    return Ruas(lin, sederhana, p.ada_kurung)


def urai_ekspresi(teks: str) -> Ruas:
    tokens = tokenisasi(normalisasi(teks))
    if any(t in RELASI for t in tokens):
        raise GalatBentuk("Ruas tidak boleh berisi tanda = atau pertidaksamaan.")
    return _urai_ruas(tokens)


def urai_kalimat(teks: str) -> Kalimat:
    tokens = tokenisasi(normalisasi(teks))
    posisi = [i for i, t in enumerate(tokens) if t in RELASI]
    if len(posisi) != 1:
        raise GalatBentuk("Harus ada tepat satu tanda =, <, >, ≤, atau ≥.")
    i = posisi[0]
    kiri, kanan = _urai_ruas(tokens[:i]), _urai_ruas(tokens[i + 1 :])
    return Kalimat(Bentuk(kiri.lin, tokens[i], kanan.lin), kiri.sederhana and kanan.sederhana)


def ada_kurung(teks: str) -> bool:
    return "(" in teks


# ---------------------------------------------------------------- penyelesaian


def _banding(p: Fraction, rel: str, q: Fraction) -> bool:
    return {
        "=": p == q, "<": p < q, ">": p > q, "<=": p <= q, ">=": p >= q,
    }[rel]


def himpunan(b: Bentuk) -> tuple:
    """Himpunan penyelesaian kanonik: ("x", rel, batas) | ("semua",) | ("kosong",)."""
    a = b.l.a - b.r.a
    c = b.r.b - b.l.b
    if a == 0:
        return ("semua",) if _banding(Fraction(0), b.rel, c) else ("kosong",)
    rel = b.rel if a > 0 else CERMIN[b.rel]
    return ("x", rel, c / a)


def penyebut_kpk(b: Bentuk) -> int:
    return lcm(b.l.a.denominator, b.l.b.denominator, b.r.a.denominator, b.r.b.denominator)


# -------------------------------------------------------------------- format


def format_bilangan(q: Fraction) -> str:
    """-3 -> "−3", 146/5 -> "29,2", 10/3 -> "10/3"."""
    tanda = "−" if q < 0 else ""
    q = abs(q)
    if q.denominator == 1:
        return f"{tanda}{q.numerator}"
    for k in range(1, 4):
        if (10**k) % q.denominator == 0:
            v = q.numerator * (10**k) // q.denominator
            bulat, pecahan = divmod(v, 10**k)
            return f"{tanda}{bulat},{str(pecahan).zfill(k).rstrip('0')}"
    return f"{tanda}{q.numerator}/{q.denominator}"


def format_suku_x(m: Fraction) -> str:
    """Suku x dengan koefisien positif m: 1 -> x, 3 -> 3x, 1/2 -> x/2, 2/3 -> 2x/3."""
    if m == 1:
        return "x"
    if m.denominator == 1:
        return f"{m.numerator}x"
    if m.numerator == 1:
        return f"x/{m.denominator}"
    return f"{m.numerator}x/{m.denominator}"


def format_suku(daftar: list[tuple[Fraction, str]]) -> str:
    """Menulis deretan suku [(nilai, 'x'|'1')] sesuai urutan, mis. 5 − 3x."""
    teks = ""
    for i, (v, jenis) in enumerate(daftar):
        v = Fraction(v)
        m = abs(v)
        isi = format_suku_x(m) if jenis == "x" else format_bilangan(m)
        if i == 0:
            teks = ("−" if v < 0 else "") + isi
        else:
            teks += (" − " if v < 0 else " + ") + isi
    return teks


def format_linear(lin: Linear) -> str:
    daftar: list[tuple[Fraction, str]] = []
    if lin.a != 0:
        daftar.append((lin.a, "x"))
    if lin.b != 0 or not daftar:
        daftar.append((lin.b, "1"))
    return format_suku(daftar)


def format_bentuk(b: Bentuk) -> str:
    return f"{format_linear(b.l)} {SIMBOL[b.rel]} {format_linear(b.r)}"


def format_himpunan(h: tuple) -> str:
    if h[0] == "semua":
        return "semua bilangan memenuhi"
    if h[0] == "kosong":
        return "tidak ada penyelesaian"
    return f"x {SIMBOL[h[1]]} {format_bilangan(h[2])}"
