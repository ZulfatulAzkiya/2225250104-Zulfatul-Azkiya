import random

import pytest

from app.services.pemeriksa import (
    PESAN,
    periksa_langkah,
    periksa_operasi,
    petunjuk,
    pilihan_operasi,
    selesaikan,
)


@pytest.mark.parametrize(
    "sebelum,op,jawaban,kode",
    [
        # benar
        ("2x + 3 = 11", "sub:3", "2x = 8", "OK"),
        ("2x + 3 = 11", "sub:3", "8 = 2x", "OK"),
        ("-2x > 4", "div:-2", "x < -2", "OK"),
        ("-2x > 4", "div:-2", "-2 > x", "OK"),
        ("2(x − 3) = 10", "simplify", "2x - 6 = 10", "OK"),
        ("2x + 3 = 11", "sub:3", "x = 4", "OK_CARA_LAIN"),
        # setiap kode kesalahan pada katalog docs/konten-materi.md §5
        ("-2x > 4", "div:-2", "x > -2", "E_TANDA_TIDAK_DIBALIK"),
        ("x - 3 > 5", "add:3", "x < 8", "E_TANDA_DIBALIK_SALAH"),
        ("x - 3 > 5", "add:3", "x ≥ 8", "E_TANDA_TERTUKAR"),
        ("2x + 3 = 11", "sub:3", "2x = 11", "E_SATU_RUAS"),
        ("x + 5 = 9", "sub:5", "x = 14", "E_PINDAH_RUAS"),
        ("2x = 8", "div:2", "x = 16", "E_PINDAH_RUAS"),
        ("-3x - 2 >= 10", "add:2", "-3x >= -12", "E_HITUNG_NEGATIF"),
        ("2(x − 3) = 10", "simplify", "2x - 3 = 10", "E_DISTRIBUTIF"),
        ("2x + 3 = 11", "sub:3", "2x = 9", "E_HITUNG"),
        ("2x + 3 = 11", "sub:3", "2x + 3 = 11", "E_BELUM_DIOPERASIKAN"),
        ("2(x − 3) = 10", "simplify", "2(x - 3) = 10", "E_BELUM_SEDERHANA"),
        ("2x + 3 = 11", "sub:3", "4x + 6 = 22", "E_TIDAK_MAJU"),
        ("2x + 3 = 11", "sub:3", "2x = ", "E_FORMAT"),
    ],
)
def test_periksa_langkah(sebelum, op, jawaban, kode):
    hasil = periksa_langkah(sebelum, op, jawaban)
    assert hasil["kode"] == kode
    assert hasil["ok"] == kode.startswith("OK")
    assert hasil["pesan"].startswith(PESAN[kode])


def test_langkah_akhir_ditandai_selesai():
    assert periksa_langkah("-2x > 4", "div:-2", "x < -2")["selesai"] is True
    assert periksa_langkah("2x + 3 = 11", "sub:3", "2x = 8")["selesai"] is False


@pytest.mark.parametrize(
    "sebelum,op,ok",
    [
        ("2x + 3 = 11", "sub:3", True),
        ("2x + 3 = 11", "add:3", False),
        ("2x + 3 = 11", "div:2", False),  # muncul pecahan, belum maju
        ("2x = 8", "div:2", True),
        ("2x = 8", "sub:2", False),
        ("-2x > 4", "div:2", False),  # masih −x
        ("-2x > 4", "div:-2", True),
        ("2(x - 3) = 10", "simplify", True),
        ("2(x - 3) = 10", "div:2", True),  # cara lain yang sah
        ("2(x - 3) = 10", "sub:1", False),
        ("3x - 5 = x + 7", "subx:1", True),
        ("x/2 + 1 < 4", "mul:2", True),
    ],
)
def test_periksa_operasi(sebelum, op, ok):
    assert periksa_operasi(sebelum, op)["ok"] is ok


def test_peringatan_bilangan_negatif_saat_memilih_operasi():
    assert "negatif" in periksa_operasi("-2x > 4", "div:-2")["pesan"]


@pytest.mark.parametrize("soal", ["2x + 3 = 11", "-2x + 3 > 7", "2(x - 3) = 10", "10 + 5x < 8x", "x/3 - 1 >= 2"])
def test_pilihan_operasi_tepat_satu_yang_disarankan(soal):
    pilihan = pilihan_operasi(soal, random.Random(0))
    assert len(pilihan) == 3 and len(set(pilihan)) == 3
    assert sum(periksa_operasi(soal, p)["ok"] for p in pilihan) == 1


def test_petunjuk_bertingkat():
    assert "Perhatikan tanda" in petunjuk("-2x > 4", 1)
    assert "÷(−2)" in petunjuk("-2x > 4", 2)
    assert petunjuk("-2x > 4", 3).endswith("x < −2")


@pytest.mark.parametrize(
    "soal,jawaban,banyak,balik",
    [
        ("2x + 3 = 11", "x = 4", 2, False),
        ("3x − 5 = x + 7", "x = 6", 3, False),
        ("7 − 3x = 19", "x = −4", 2, False),
        ("2(x − 3) = 10", "x = 8", 3, False),
        ("3x − 4 ≤ 11", "x ≤ 5", 2, False),
        ("−2x + 3 > 7", "x < −2", 2, True),
        ("5 − 3x ≥ 2x − 10", "x ≤ 3", 3, True),
        ("x/2 + 1 < 4", "x < 6", 2, False),
        ("4000x + 6000 ≤ 50000", "x ≤ 11", 2, False),
    ],
)
def test_contoh_soal_dokumen(soal, jawaban, banyak, balik):
    """Contoh di docs/konten-materi.md §3 diselesaikan dengan benar."""
    hasil = selesaikan(soal)
    assert hasil["jawaban"] == jawaban
    assert len(hasil["langkah"]) == banyak
    assert any(lk["balik"] for lk in hasil["langkah"]) is balik


def test_setiap_langkah_kanonik_lolos_pemeriksa():
    for soal in ["5 − 3x ≥ 2x − 10", "(70 + 80 + 68 + x)/4 ≥ 75", "−x/3 + 2 < 5"]:
        for lk in selesaikan(soal)["langkah"]:
            assert periksa_operasi(lk["sebelum"], lk["operasi"])["ok"]
            assert periksa_langkah(lk["sebelum"], lk["operasi"], lk["hasil"])["kode"] == "OK"
