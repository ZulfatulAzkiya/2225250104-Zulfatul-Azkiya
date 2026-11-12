"""Generator diuji silang dengan SymPy (sumber kebenaran independen)."""

from fractions import Fraction

import pytest
import sympy as sp

from app.services.aljabar import himpunan, urai_kalimat
from app.services.generator import LEVEL, TOPIK, buat_paket
from app.services.pemeriksa import periksa_langkah, selesaikan

X = sp.Symbol("x", real=True)
_REL = {"=": sp.Eq, "<": sp.Lt, ">": sp.Gt, "<=": sp.Le, ">=": sp.Ge}


def _sympy_himpunan(teks: str):
    """Ubah soal ke SymPy lewat bentuk normal kita, lalu selesaikan dengan solveset."""
    b = urai_kalimat(teks).bentuk
    kiri = sp.Rational(b.l.a.numerator, b.l.a.denominator) * X + sp.Rational(b.l.b.numerator, b.l.b.denominator)
    kanan = sp.Rational(b.r.a.numerator, b.r.a.denominator) * X + sp.Rational(b.r.b.numerator, b.r.b.denominator)
    return sp.solveset(_REL[b.rel](kiri, kanan), X, domain=sp.S.Reals)


def _ke_sympy(h):
    rel, batas = h[1], sp.Rational(h[2].numerator, h[2].denominator)
    return sp.solveset(_REL[rel](X, batas), X, domain=sp.S.Reals)


@pytest.mark.parametrize("topik", TOPIK)
@pytest.mark.parametrize("level", LEVEL)
def test_soal_valid_dan_cocok_dengan_sympy(topik, level):
    for soal in buat_paket(topik, level, jumlah=40, seed=123):
        h = himpunan(urai_kalimat(soal["soal"]).bentuk)
        assert h[0] == "x" and h[2].denominator == 1 and abs(h[2]) <= 20
        assert _sympy_himpunan(soal["soal"]) == _ke_sympy(h)
        assert (h[1] == "=") is (topik == "plsv")
        # setiap langkah kanonik diterima oleh pemeriksa
        for lk in selesaikan(soal["soal"])["langkah"]:
            assert periksa_langkah(lk["sebelum"], lk["operasi"], lk["hasil"])["ok"]


def test_ptlsv_menengah_minimal_separuh_perlu_balik():
    for seed in range(20):
        paket = buat_paket("ptlsv", "menengah", 6, seed=seed)
        assert sum(p["perlu_balik"] for p in paket) >= 3


def test_dasar_tidak_perlu_membalik_tanda():
    assert not any(p["perlu_balik"] for p in buat_paket("ptlsv", "dasar", 30, seed=5))


def test_paket_tidak_ada_soal_kembar():
    paket = buat_paket("plsv", "dasar", 15, seed=9)
    assert len({p["soal"] for p in paket}) == 15


def test_seed_sama_hasil_sama():
    assert buat_paket("ptlsv", "tantangan", 5, seed=7) == buat_paket("ptlsv", "tantangan", 5, seed=7)


def test_level_dasar_solusi_tidak_negatif():
    for p in buat_paket("plsv", "dasar", 30, seed=2):
        assert himpunan(urai_kalimat(p["soal"]).bentuk)[2] >= Fraction(0)
