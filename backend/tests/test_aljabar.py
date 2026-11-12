from fractions import Fraction as F

import pytest

from app.services.aljabar import (
    GalatBentuk,
    Linear,
    format_bentuk,
    format_bilangan,
    format_linear,
    himpunan,
    urai_ekspresi,
    urai_kalimat,
)


@pytest.mark.parametrize(
    "teks,a,b",
    [
        ("2x + 3", 2, 3),
        ("−3x − 2", -3, -2),
        ("2(x − 3)", 2, -6),
        ("x/2 + 1", F(1, 2), 1),
        ("−x/3", F(-1, 3), 0),
        ("(70 + 80 + 68 + x)/4", F(1, 4), F(218, 4)),
        ("2(x + x + 3)", 4, 6),
        ("29,2", 0, F(146, 5)),
        ("3 * 2x", 6, 0),
        ("5 − 3x + 2x", -1, 5),
    ],
)
def test_urai_ekspresi(teks, a, b):
    assert urai_ekspresi(teks).lin == Linear(F(a), F(b))


@pytest.mark.parametrize(
    "teks,sederhana",
    [("2x + 3", True), ("x/2 + 1", True), ("2x/3", True), ("−x", True),
     ("2(x − 3)", False), ("x + x", False), ("3 + 2 + x", False), ("3*2x", False), ("--x", False)],
)
def test_sederhana(teks, sederhana):
    assert urai_ekspresi(teks).sederhana is sederhana


@pytest.mark.parametrize(
    "teks",
    ["", "x*x", "2/x", "3/0", "x + ", "(x + 1", "x = = 2", "2x", "__import__('os')", "x" * 200, "x ≤ 2 ≤ 3", "3."],
)
def test_input_tidak_valid_ditolak(teks):
    with pytest.raises(GalatBentuk):
        urai_kalimat(teks)


def test_relasi_unicode_dan_ascii_setara():
    assert urai_kalimat("x ≥ 2").bentuk == urai_kalimat("x>=2").bentuk == urai_kalimat("x => 2").bentuk


@pytest.mark.parametrize(
    "teks,harapan",
    [
        ("-2x + 3 > 7", ("x", "<", F(-2))),
        ("5 − 3x ≥ 2x − 10", ("x", "<=", F(3))),
        ("8 > 2x", ("x", "<", F(4))),
        ("x + 1 = x + 1", ("semua",)),
        ("x + 1 < x", ("kosong",)),
    ],
)
def test_himpunan(teks, harapan):
    assert himpunan(urai_kalimat(teks).bentuk) == harapan


@pytest.mark.parametrize(
    "q,teks", [(F(-3), "−3"), (F(146, 5), "29,2"), (F(10, 3), "10/3"), (F(-1, 4), "−0,25"), (F(1, 8), "0,125")]
)
def test_format_bilangan(q, teks):
    assert format_bilangan(q) == teks


def test_format_linear_dan_bentuk():
    assert format_linear(Linear(F(-1), F(5))) == "−x + 5"
    assert format_linear(Linear(F(1, 2), F(0))) == "x/2"
    assert format_linear(Linear(F(0), F(0))) == "0"
    assert format_bentuk(urai_kalimat("-2x+3>=7").bentuk) == "−2x + 3 ≥ 7"
