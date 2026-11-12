"""Merender ikon PNG aplikasi dari frontend/ikon/ikon.svg memakai Chrome/Edge headless.

Hanya perlu dijalankan jika desain ikon diubah:
    python -m scripts.buat_ikon
"""

from __future__ import annotations

import shutil
import subprocess
import tempfile
from pathlib import Path

FOLDER = Path(__file__).resolve().parents[2] / "frontend" / "ikon"
CALON_BROWSER = [
    r"C:\Program Files\Google\Chrome\Application\chrome.exe",
    r"C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe",
    "google-chrome", "chromium", "chromium-browser", "microsoft-edge",
]
# (nama berkas, ukuran, maskable?) — ikon maskable diberi latar penuh & isi di zona aman 80%.
UKURAN = [("ikon-192.png", 192, False), ("ikon-512.png", 512, False),
          ("ikon-maskable-512.png", 512, True), ("apple-touch-icon.png", 180, True)]


def cari_browser() -> str:
    for c in CALON_BROWSER:
        if Path(c).exists() or shutil.which(c):
            return c
    raise SystemExit("Chrome/Edge tidak ditemukan.")


def main() -> None:
    browser = cari_browser()
    svg = (FOLDER / "ikon.svg").read_text(encoding="utf-8")
    isi = svg.split(">", 1)[1].rsplit("</svg>", 1)[0]
    for nama, px, maskable in UKURAN:
        if maskable:
            isi_svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">'
                       f'<rect width="512" height="512" fill="#2f5bd3"/>'
                       f'<g transform="translate(51.2 51.2) scale(0.8)">{isi}</g></svg>')
        else:
            isi_svg = svg
        html = (f"<html><body style='margin:0;background:transparent'>"
                f"<div style='width:{px}px;height:{px}px'>{isi_svg.replace('<svg ', f'<svg width={px} height={px} ', 1)}</div>"
                f"</body></html>")
        with tempfile.TemporaryDirectory() as tmp:
            halaman = Path(tmp) / "ikon.html"
            halaman.write_text(html, encoding="utf-8")
            subprocess.run([browser, "--headless", "--disable-gpu", "--hide-scrollbars",
                            "--default-background-color=00000000", f"--window-size={px},{px}",
                            f"--screenshot={FOLDER / nama}", halaman.as_uri()], check=True, capture_output=True)
        print("dibuat", nama)


if __name__ == "__main__":
    main()
