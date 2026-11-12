from fastapi.testclient import TestClient

from app.main import app

klien = TestClient(app)


def test_kesehatan():
    assert klien.get("/api/kesehatan").json()["status"] == "ok"


def test_soal():
    r = klien.get("/api/soal", params={"topik": "ptlsv", "level": "menengah", "jumlah": 4})
    assert r.status_code == 200
    assert len(r.json()["soal"]) == 4


def test_soal_parameter_salah():
    assert klien.get("/api/soal", params={"topik": "kuadrat", "level": "dasar"}).status_code == 422
    assert klien.get("/api/soal", params={"topik": "plsv", "level": "dasar", "jumlah": 99}).status_code == 422


def test_periksa_langkah():
    r = klien.post("/api/periksa-langkah", json={"sebelum": "-2x > 4", "operasi": "div:-2", "jawaban": "x > -2"})
    assert r.json()["kode"] == "E_TANDA_TIDAK_DIBALIK"


def test_periksa_operasi_dan_pilihan():
    assert klien.post("/api/periksa-operasi", json={"sebelum": "2x = 8", "operasi": "div:2"}).json()["ok"]
    assert len(klien.get("/api/pilihan-operasi", params={"sebelum": "2x + 3 = 11"}).json()["pilihan"]) == 3


def test_selesaikan_dan_input_rusak():
    assert klien.post("/api/selesaikan", json={"soal": "2x + 3 = 11"}).json()["jawaban"] == "x = 4"
    r = klien.post("/api/selesaikan", json={"soal": "__import__('os')"})
    assert r.status_code == 422 and r.json()["detail"]["kode"] == "INVALID_EXPR"
    assert klien.post("/api/selesaikan", json={"soal": "x" * 500}).status_code == 422


def test_aplikasi_web_disajikan():
    r = klien.get("/")
    assert r.status_code == 200 and "ULFALINE" in r.text
    assert klien.get("/js/mesin.js").headers["content-type"].startswith("text/javascript")
    assert klien.get("/manifest.webmanifest").headers["content-type"].startswith("application/manifest+json")
    assert klien.get("/sw.js").status_code == 200
