"""Server ULFALINE: API matematika (FastAPI) + penyaji aplikasi web (PWA).

Jalankan dari folder backend:
    uvicorn app.main:app --reload --port 8000
lalu buka http://localhost:8000
"""

from __future__ import annotations

import mimetypes
import os
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, Query, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field

from .services.aljabar import GalatBentuk
from .services.generator import buat_paket
from .services.pemeriksa import (
    periksa_langkah,
    periksa_operasi,
    pilihan_operasi,
    selesaikan,
)

# Di Windows, registry kadang memetakan .js ke text/plain sehingga modul JS ditolak browser.
mimetypes.add_type("text/javascript", ".js")
mimetypes.add_type("application/manifest+json", ".webmanifest")
mimetypes.add_type("image/svg+xml", ".svg")

FOLDER_FRONTEND = Path(os.environ.get("ULFALINE_FRONTEND", Path(__file__).resolve().parents[2] / "frontend"))

app = FastAPI(title="ULFALINE API", version="1.0.0", docs_url="/api/docs", openapi_url="/api/openapi.json")

_origins = [o.strip() for o in os.environ.get("ALLOWED_ORIGINS", "").split(",") if o.strip()]
if _origins:
    app.add_middleware(CORSMiddleware, allow_origins=_origins, allow_methods=["*"], allow_headers=["*"])


@app.middleware("http")
async def header_cache(request: Request, call_next):
    respons = await call_next(request)
    # File aplikasi selalu divalidasi ulang; mode offline ditangani service worker.
    respons.headers.setdefault("Cache-Control", "no-cache")
    respons.headers.setdefault("X-Content-Type-Options", "nosniff")
    return respons


@app.exception_handler(GalatBentuk)
async def galat_bentuk(_: Request, galat: GalatBentuk) -> JSONResponse:
    return JSONResponse(status_code=422, content={"detail": {"kode": "INVALID_EXPR", "pesan": str(galat)}})


Teks = Field(min_length=1, max_length=120)


class PermintaanOperasi(BaseModel):
    sebelum: str = Teks
    operasi: str = Field(min_length=1, max_length=30)


class PermintaanLangkah(PermintaanOperasi):
    jawaban: str = Teks


class PermintaanSelesaikan(BaseModel):
    soal: str = Teks


@app.get("/api/kesehatan")
def kesehatan() -> dict:
    return {"status": "ok", "aplikasi": "ULFALINE"}


@app.get("/api/soal")
def soal(
    topik: Literal["plsv", "ptlsv"],
    level: Literal["dasar", "menengah", "tantangan"],
    jumlah: int = Query(5, ge=1, le=20),
) -> dict:
    return {"soal": buat_paket(topik, level, jumlah)}


@app.get("/api/pilihan-operasi")
def api_pilihan_operasi(sebelum: str = Query(min_length=1, max_length=120)) -> dict:
    return {"pilihan": pilihan_operasi(sebelum)}


@app.post("/api/periksa-operasi")
def api_periksa_operasi(p: PermintaanOperasi) -> dict:
    return periksa_operasi(p.sebelum, p.operasi)


@app.post("/api/periksa-langkah")
def api_periksa_langkah(p: PermintaanLangkah) -> dict:
    return periksa_langkah(p.sebelum, p.operasi, p.jawaban)


@app.post("/api/selesaikan")
def api_selesaikan(p: PermintaanSelesaikan) -> dict:
    return selesaikan(p.soal)


# Aplikasi web (harus didaftarkan PALING AKHIR agar tidak menutupi /api).
if FOLDER_FRONTEND.is_dir():
    app.mount("/", StaticFiles(directory=FOLDER_FRONTEND, html=True), name="frontend")
