"""Membuat bank soal cadangan untuk mode offline: frontend/data/bank-soal.json.

Jalankan dari folder backend:
    python -m scripts.ekspor_bank_soal
"""

from __future__ import annotations

import json
from pathlib import Path

from app.services.generator import LEVEL, TOPIK, buat_paket

PER_LEVEL = 150  # 900 soal: cukup untuk hosting statis tanpa server Python
TUJUAN = Path(__file__).resolve().parents[2] / "frontend" / "data" / "bank-soal.json"


def main() -> None:
    soal = []
    for i, topik in enumerate(TOPIK):
        for j, level in enumerate(LEVEL):
            soal += buat_paket(topik, level, PER_LEVEL, seed=2026 + 10 * i + j)
    data = {"versi": 1, "catatan": "Dibuat otomatis oleh backend/scripts/ekspor_bank_soal.py", "soal": soal}
    TUJUAN.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
    print(f"{len(soal)} soal ditulis ke {TUJUAN}")


if __name__ == "__main__":
    main()
