"""Operasi pada kedua ruas, rencana langkah, dan ukuran "jarak" ke bentuk akhir.

Notasi operasi (string): add:n, sub:n, mul:n, div:n, addx:k, subx:k, simplify
n dan k ditulis sebagai bilangan bulat atau pecahan, mis. "3", "-2", "1/2".
"""

from __future__ import annotations

import re
from dataclasses import dataclass
from fractions import Fraction

from .aljabar import (
    CERMIN,
    Bentuk,
    GalatBentuk,
    Kalimat,
    Linear,
    format_bilangan,
    format_suku_x,
    penyebut_kpk,
)

JENIS = ("add", "sub", "mul", "div", "addx", "subx", "simplify")
_POLA_OP = re.compile(r"(add|sub|mul|div|addx|subx):(-?\d+(?:/\d+)?)")
_INVERS = {"add": "sub", "sub": "add", "mul": "div", "div": "mul", "addx": "subx", "subx": "addx"}


@dataclass(frozen=True)
class Operasi:
    jenis: str
    nilai: Fraction = Fraction(0)

    @staticmethod
    def dari_teks(teks: str) -> Operasi:
        if teks == "simplify":
            return Operasi("simplify")
        m = _POLA_OP.fullmatch(teks)
        if not m:
            raise GalatBentuk("Operasi tidak dikenal.")
        nilai = Fraction(m.group(2))
        if m.group(1) in ("mul", "div") and nilai == 0:
            raise GalatBentuk("Tidak boleh mengali atau membagi dengan nol.")
        return Operasi(m.group(1), nilai)

    def teks(self) -> str:
        return "simplify" if self.jenis == "simplify" else f"{self.jenis}:{self.nilai}"

    def invers(self) -> Operasi:
        return Operasi(_INVERS[self.jenis], self.nilai)


def membalik(op: Operasi, rel: str) -> bool:
    """Apakah operasi ini membalik tanda pertidaksamaan?"""
    return rel != "=" and op.jenis in ("mul", "div") and op.nilai < 0


def terapkan(b: Bentuk, op: Operasi) -> Bentuk:
    j, n = op.jenis, op.nilai
    if j == "simplify":
        return b
    if j in ("add", "sub", "addx", "subx"):
        tanda = 1 if j in ("add", "addx") else -1
        d = Linear(n * tanda, Fraction(0)) if j.endswith("x") else Linear(Fraction(0), n * tanda)
        return Bentuk(b.l + d, b.rel, b.r + d)
    k = n if j == "mul" else 1 / n
    rel = CERMIN[b.rel] if membalik(op, b.rel) else b.rel
    return Bentuk(b.l.kali(k), rel, b.r.kali(k))


def selesai(b: Bentuk) -> bool:
    """x sudah sendirian (koefisien 1) di satu ruas, ruas lain hanya bilangan."""
    kiri = b.l.a == 1 and b.l.b == 0 and b.r.a == 0
    kanan = b.r.a == 1 and b.r.b == 0 and b.l.a == 0
    return kiri or kanan


def jarak(b: Bentuk, sederhana: bool) -> int:
    """Banyak "hal yang masih perlu dibereskan" sebelum x sendirian."""
    if sederhana and selesai(b):
        return 0
    d = 0
    if penyebut_kpk(b) > 1:
        d += 1
    if not sederhana:
        d += 1
    if b.l.a != 0 and b.r.a != 0:
        d += 1
        d += int(b.l.b != 0) + int(b.l.a - b.r.a != 1)
    elif b.l.a != 0:
        d += int(b.l.b != 0) + int(b.l.a != 1)
    elif b.r.a != 0:
        d += int(b.r.b != 0) + int(b.r.a != 1)
    return d


def _tambah_kurang(jenis_x: bool, nilai: Fraction) -> Operasi:
    """Operasi untuk menghilangkan suku bernilai `nilai` (selalu dengan bilangan positif)."""
    if jenis_x:
        return Operasi("subx", nilai) if nilai > 0 else Operasi("addx", -nilai)
    return Operasi("sub", nilai) if nilai > 0 else Operasi("add", -nilai)


def rencana(k: Kalimat) -> Operasi | None:
    """Operasi berikutnya yang paling disarankan, atau None jika sudah selesai."""
    b = k.bentuk
    if k.sederhana and selesai(b):
        return None
    kpk = penyebut_kpk(b)
    if kpk > 1:
        return Operasi("mul", Fraction(kpk))
    if not k.sederhana:
        return Operasi("simplify")
    if b.l.a != 0 and b.r.a != 0:
        return _tambah_kurang(True, b.r.a)
    if b.l.a != 0:
        sisi = b.l
    elif b.r.a != 0:
        sisi = b.r
    else:
        return None
    if sisi.b != 0:
        return _tambah_kurang(False, sisi.b)
    if sisi.a != 1:
        return Operasi("div", sisi.a)
    return None


# ------------------------------------------------------------------- label


def _bil_dalam_kurung(n: Fraction) -> str:
    s = format_bilangan(n)
    return f"({s})" if n < 0 else s


def label_operasi(op: Operasi) -> str:
    """Label singkat untuk tombol, mis. "−3 di kedua ruas"."""
    j, n = op.jenis, op.nilai
    if j == "simplify":
        return "Sederhanakan"
    if j == "add":
        isi = f"+{_bil_dalam_kurung(n)}"
    elif j == "sub":
        isi = f"−{_bil_dalam_kurung(n)}"
    elif j == "mul":
        isi = f"×{_bil_dalam_kurung(n)}"
    elif j == "div":
        isi = f"÷{_bil_dalam_kurung(n)}"
    elif j == "addx":
        isi = f"+{format_suku_x(n)}" if n > 0 else f"+(−{format_suku_x(-n)})"
    else:
        isi = f"−{format_suku_x(n)}" if n > 0 else f"−(−{format_suku_x(-n)})"
    return f"{isi} di kedua ruas"


def jelaskan_operasi(op: Operasi, rel: str) -> str:
    """Kalimat penjelasan untuk contoh soal dan pembahasan."""
    j, n = op.jenis, op.nilai
    b = format_bilangan(n)
    if j == "simplify":
        return "Sederhanakan dulu: jabarkan tanda kurung dan gabungkan suku sejenis."
    teks = {
        "add": f"Tambahkan {b} pada kedua ruas.",
        "sub": f"Kurangi kedua ruas dengan {b}.",
        "mul": f"Kalikan kedua ruas dengan {b}.",
        "div": f"Bagi kedua ruas dengan {b}.",
        "addx": f"Tambahkan {format_suku_x(abs(n))} pada kedua ruas.",
        "subx": f"Kurangi kedua ruas dengan {format_suku_x(abs(n))}.",
    }[j]
    if membalik(op, rel):
        teks += " Karena dikali/dibagi bilangan negatif, tanda pertidaksamaan DIBALIK."
    elif rel != "=" and j in ("mul", "div"):
        teks += " Bilangannya positif, jadi tanda tetap."
    return teks
