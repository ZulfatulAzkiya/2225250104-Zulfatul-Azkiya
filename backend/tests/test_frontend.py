"""Pemeriksaan statis frontend: sintaks JS, daftar cache offline, manifest PWA, konten materi."""

import json
import re
from pathlib import Path

import pytest

from app.services.pemeriksa import selesaikan

FRONTEND = Path(__file__).resolve().parents[2] / "frontend"
BERKAS_APLIKASI = sorted(
    p.relative_to(FRONTEND).as_posix()
    for p in FRONTEND.rglob("*")
    if p.is_file() and p.suffix in {".html", ".css", ".js", ".json", ".png", ".svg", ".webmanifest"} and p.name != "sw.js"
)


def _daftar_sw():
    teks = (FRONTEND / "sw.js").read_text(encoding="utf-8")
    blok = re.search(r"const BERKAS = \[(.*?)\];", teks, re.S).group(1)
    return re.findall(r"'([^']+)'", blok)


def test_semua_berkas_masuk_cache_offline():
    daftar = set(_daftar_sw())
    assert set(BERKAS_APLIKASI) - daftar == set(), "tambahkan ke BERKAS di sw.js"
    assert {d for d in daftar if d != "./"} - set(BERKAS_APLIKASI) == set(), "berkas di sw.js tidak ada"


def test_manifest_layak_dipasang():
    m = json.loads((FRONTEND / "manifest.webmanifest").read_text(encoding="utf-8"))
    assert m["short_name"] == "ULFALINE" and m["display"] == "standalone" and m["start_url"]
    ukuran = {i["sizes"] for i in m["icons"]}
    assert {"192x192", "512x512"} <= ukuran
    assert any(i.get("purpose") == "maskable" for i in m["icons"])
    for i in m["icons"]:
        assert (FRONTEND / i["src"]).exists()


mini_racer = pytest.importorskip("py_mini_racer")


@pytest.mark.parametrize("berkas", [b for b in BERKAS_APLIKASI if b.endswith(".js")] + ["sw.js"])
def test_sintaks_javascript(berkas):
    kode = (FRONTEND / berkas).read_text(encoding="utf-8")
    kode = re.sub(r"^import\s[^;]+;", "", kode, flags=re.M | re.S)
    kode = re.sub(r"^export\s+", "", kode, flags=re.M)
    ctx = mini_racer.MiniRacer()
    # new Function hanya mem-parsing, tidak menjalankan kode.
    ctx.eval(f"new Function({json.dumps(kode)})")


def test_contoh_soal_materi_dapat_diselesaikan():
    teks = (FRONTEND / "js" / "konten" / "materi.js").read_text(encoding="utf-8")
    contoh = re.findall(r"jenis: 'contoh'.*?soal: '([^']+)'", teks)
    assert len(contoh) >= 6
    for soal in contoh:
        assert selesaikan(soal)["langkah"]


def test_tanpa_innerhtml():
    """Konten selalu dibuat lewat DOM, bukan innerHTML (mencegah XSS)."""
    for b in BERKAS_APLIKASI:
        if b.endswith(".js"):
            assert "innerHTML" not in (FRONTEND / b).read_text(encoding="utf-8").replace("Jangan memakai innerHTML", ""), b
