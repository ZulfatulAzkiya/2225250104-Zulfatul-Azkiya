"""Kebenaran matematika semua konten (literasi, prasyarat, bank soal)."""

import json
from pathlib import Path

import pytest
import sympy as sp

from app.services.aljabar import format_himpunan, himpunan, urai_ekspresi, urai_kalimat
from app.services.pemeriksa import selesaikan

DATA = Path(__file__).resolve().parents[2] / "frontend" / "data"


def _muat(nama):
    return json.loads((DATA / nama).read_text(encoding="utf-8"))


MISI = _muat("literasi.json")["misi"]
PRASYARAT = _muat("prasyarat.json")


@pytest.mark.parametrize("misi", MISI, ids=lambda m: m["id"])
def test_model_literasi_benar(misi):
    model = urai_kalimat(misi["model"])
    # Pilihan "benar" pada tahap Rumuskan setara dengan model yang diselesaikan.
    dipilih = urai_kalimat(misi["rumuskan"]["pilihan"][misi["rumuskan"]["benar"]])
    assert dipilih.bentuk == model.bentuk
    # Solusi yang ditampilkan sama dengan hasil mesin.
    assert format_himpunan(himpunan(model.bentuk)) == misi["solusi"]
    assert selesaikan(misi["model"])["jawaban"] == misi["solusi"]
    # Pilihan pengecoh merumuskan model yang BERBEDA.
    for i, p in enumerate(misi["rumuskan"]["pilihan"]):
        if i == misi["rumuskan"]["benar"]:
            continue
        try:
            assert urai_kalimat(p).bentuk != model.bentuk
        except ValueError:
            pass  # mis. x(x + 3): bukan linear, jelas berbeda
    assert (model.bentuk.rel == "=") is (misi["jenis"] == "plsv")


@pytest.mark.parametrize("misi", MISI, ids=lambda m: m["id"])
def test_struktur_misi(misi):
    for tahap in ("pahami", "rumuskan", "tafsirkan", "cek"):
        q = misi[tahap]
        assert 2 <= len(q["pilihan"]) <= 4 and 0 <= q["benar"] < len(q["pilihan"])
        assert len(set(q["pilihan"])) == len(q["pilihan"])
    assert len(misi["rumuskan"]["umpan"]) == len(misi["rumuskan"]["pilihan"])
    assert len(misi["cerita"].split()) <= 60, "cerita terlalu panjang (beban ekstrinsik)"


@pytest.mark.parametrize("q", [q for q in PRASYARAT["soal"] if "cek" in q], ids=lambda q: q["tanya"])
def test_kunci_prasyarat(q):
    kunci = q["pilihan"][q["benar"]]
    assert urai_ekspresi(q["cek"]).lin == urai_ekspresi(kunci).lin
    for i, p in enumerate(q["pilihan"]):
        if i != q["benar"]:
            assert urai_ekspresi(p).lin != urai_ekspresi(kunci).lin


def test_prasyarat_topik_valid():
    assert all(q["topik"] in PRASYARAT["topik"] for q in PRASYARAT["soal"])


def test_bank_soal_lengkap_dan_benar():
    bank = _muat("bank-soal.json")["soal"]
    assert len(bank) >= 300
    x = sp.Symbol("x", real=True)
    for p in bank[::7]:
        assert selesaikan(p["soal"])["jawaban"] == p["jawaban"]
    hitung = {}
    for p in bank:
        hitung[(p["topik"], p["level"])] = hitung.get((p["topik"], p["level"]), 0) + 1
    assert len(hitung) == 6 and min(hitung.values()) >= 50
    assert x  # sympy tersedia untuk pengujian lain
