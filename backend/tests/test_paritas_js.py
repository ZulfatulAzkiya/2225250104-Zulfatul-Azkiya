"""Mesin JavaScript (frontend/js/mesin.js) harus memberi hasil yang SAMA dengan Python.

Dijalankan di mesin V8 lewat paket `mini-racer` (tanpa Node.js).
"""

import json
import random
import re
from pathlib import Path

import pytest

from app.services.generator import LEVEL, TOPIK, buat_paket
from app.services.pemeriksa import periksa_langkah, periksa_operasi, pilihan_operasi, selesaikan

mini_racer = pytest.importorskip("py_mini_racer")

MESIN_JS = Path(__file__).resolve().parents[2] / "frontend" / "js" / "mesin.js"


@pytest.fixture(scope="module")
def js():
    kode = MESIN_JS.read_text(encoding="utf-8")
    kode = re.sub(r"^export\s+", "", kode, flags=re.M)
    ctx = mini_racer.MiniRacer()
    ctx.eval(kode)
    return ctx


def _panggil(js, fungsi: str, *argumen):
    return json.loads(js.eval(f"JSON.stringify({fungsi}(...{json.dumps(argumen)}))"))


def _kasus():
    """Soal dari generator + contoh dokumen, beserta variasi jawaban benar & salah."""
    soal = ["(70 + 80 + 68 + x)/4 ≥ 75", "10 + 5x < 8x", "2(x + x + 3) = 46", "70 + 25x ≤ 800", "−x/3 + 2 < 5"]
    for t in TOPIK:
        for lv in LEVEL:
            soal += [p["soal"] for p in buat_paket(t, lv, 12, seed=42)]
    return soal


def _variasi(hasil: str, acak: random.Random) -> list[str]:
    v = [hasil, hasil.replace("<", ">") if "<" in hasil else hasil.replace(">", "<"),
         hasil.replace("−", ""), hasil.replace("=", "≤"), hasil + " + 1", "x = ", "2(x"]
    angka = re.findall(r"\d+", hasil)
    if angka:
        n = acak.choice(angka)
        v.append(hasil.replace(n, str(int(n) + 1), 1))
    return v


def test_selesaikan_sama(js):
    for s in _kasus():
        assert _panggil(js, "selesaikan", s) == selesaikan(s), s


def test_periksa_operasi_dan_langkah_sama(js):
    acak = random.Random(1)
    jumlah = 0
    for s in _kasus():
        for lk in selesaikan(s)["langkah"]:
            sebelum = lk["sebelum"]
            for op in set(pilihan_operasi(sebelum, acak)) | {lk["operasi"]}:
                assert _panggil(js, "periksaOperasi", sebelum, op) == periksa_operasi(sebelum, op)
            for jawab in _variasi(lk["hasil"], acak):
                py = periksa_langkah(sebelum, lk["operasi"], jawab)
                assert _panggil(js, "periksaLangkah", sebelum, lk["operasi"], jawab) == py, (sebelum, jawab)
                jumlah += 1
    assert jumlah > 500


def test_pilihan_operasi_js_berisi_satu_jawaban(js):
    for s in _kasus()[:40]:
        pilihan = _panggil(js, "pilihanOperasi", s)
        assert len(pilihan) == 3
        assert sorted(pilihan) == sorted(pilihan_operasi(s))
