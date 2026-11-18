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


PETUALANGAN = _muat("petualangan.json")
TEKA = [(p["id"], t) for p in PETUALANGAN["pos"] for t in p["teka"]]


def test_petualangan_skor_mengikuti_rubrik_pretest_posttest():
    """4 indikator literasi, masing-masing maksimal 6 (total 24), sama seperti rubrik pretest-posttest."""
    total = {}
    for _, t in TEKA:
        for k, v in t.get("skor", {}).items():
            total[k] = total.get(k, 0) + v
    assert total == {"R": 6, "F": 6, "E": 6, "I": 6}
    assert set(PETUALANGAN["indikator"]) == {"R", "F", "E", "I"}
    assert len(PETUALANGAN["pos"]) == 7


@pytest.mark.parametrize("pos,t", TEKA, ids=lambda x: x if isinstance(x, str) else x.get("jenis"))
def test_teka_teki_benar(pos, t):
    if t["jenis"] == "langkah":
        assert selesaikan(t["soal"])["jawaban"] == t["jawaban"]
    elif t["jenis"] == "pilihan":
        assert 0 <= t["benar"] < len(t["pilihan"]) and len(set(t["pilihan"])) == len(t["pilihan"])
        if "umpan" in t:
            assert len(t["umpan"]) == len(t["pilihan"])
        if "setara" in t:
            model = urai_kalimat(t["setara"]).bentuk
            assert urai_kalimat(t["pilihan"][t["benar"]]).bentuk == model
            for i, p in enumerate(t["pilihan"]):
                if i != t["benar"]:
                    assert urai_kalimat(p).bentuk != model
        if "cek" in t:
            assert urai_ekspresi(t["cek"]).lin == urai_ekspresi(t["pilihan"][t["benar"]]).lin
    elif t["jenis"] == "batu":
        aman = [n for n in t["batu"] if {"<": n < t["nilai"], ">": n > t["nilai"], "<=": n <= t["nilai"], ">=": n >= t["nilai"]}[t["rel"]]]
        assert 0 < len(aman) < len(t["batu"])
    else:
        pytest.fail(f"jenis tidak dikenal: {t['jenis']}")


def test_petualangan_tidak_menyalin_soal_pretest_posttest():
    """Model di petualangan setara struktur, tetapi bilangannya berbeda dari soal tes."""
    soal_tes = ["1500x <= 18000", "3x - 7 = 2x + 9", "18 + 2x <= 24", "2000x <= 20000", "4x + 6 = 2x + 18", "210 + 30x <= 450",
                "8000x + 6000 <= 38000", "7500x + 5000 <= 50000"]
    tes = {urai_kalimat(s).bentuk for s in soal_tes}
    for _, t in TEKA:
        for teks in [t.get("soal"), t.get("setara")]:
            if teks:
                assert urai_kalimat(teks).bentuk not in tes, teks


def test_narasi_singkat():
    baris = PETUALANGAN["pembuka"] + PETUALANGAN["penutup"] + [b for p in PETUALANGAN["pos"] for b in p["narasi"]]
    for b in baris:
        assert b["siapa"] in {"ulfa", "lino"}
        assert len(b["teks"].split()) <= 40, b["teks"]


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
