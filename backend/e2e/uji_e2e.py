"""Uji end-to-end ULFALINE di Chrome sungguhan (Playwright).

Persiapan (sekali):  pip install playwright   (memakai Chrome yang sudah terpasang)
Jalankan server:     uvicorn app.main:app --port 8765
Lalu:                python e2e/uji_e2e.py [URL] [folder_tangkapan_layar]
"""

from __future__ import annotations

import json
import re
import sys
import tempfile
import urllib.request
from pathlib import Path

from playwright.sync_api import Page, expect, sync_playwright

URL = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8765/"
LAYAR = Path(sys.argv[2]) if len(sys.argv) > 2 else Path("e2e-layar")
LAYAR.mkdir(parents=True, exist_ok=True)
SIMBOL = ["≤", "≥", "<", ">", "="]


def foto(page: Page, nama: str) -> None:
    page.screenshot(path=str(LAYAR / f"{nama}.png"), full_page=True, animations="disabled")


def kerjakan_soal(page: Page, *, salah_tanda_dulu: bool = False) -> bool:
    """Menyelesaikan soal yang tampil dengan langkah kunci dari mesin.js. True jika ada langkah balik tanda."""
    soal = page.locator(".soal-kepala .mat-besar").inner_text().strip()
    langkah = page.evaluate("(s) => import('./js/mesin.js').then(m => m.selesaikan(s).langkah)", soal)
    ada_balik = False
    for lk in langkah:
        page.locator(".op-pilihan button").filter(has_text=re.compile(f"^{re.escape(lk['label'])}$")).first.click()
        rel = next(s for s in SIMBOL if f" {s} " in lk["hasil"])
        kiri, kanan = lk["hasil"].split(f" {rel} ")
        isian = page.locator(".isian input")
        if lk["balik"] and salah_tanda_dulu:
            # Sengaja lupa membalik tanda: harus muncul umpan balik spesifik (FR-09).
            lama = next(s for s in SIMBOL if f" {s} " in lk["sebelum"])
            isian.nth(0).fill(kiri)
            isian.nth(1).fill(kanan)
            page.get_by_role("button", name=f"tanda {lama}").click()
            page.get_by_role("button", name="Periksa").click()
            expect(page.locator(".umpan.salah")).to_contain_text("NEGATIF")
            expect(page.get_by_role("button", name="Lihat kenapa tandanya dibalik")).to_be_visible()
            foto(page, "05-umpan-lupa-balik")
            salah_tanda_dulu = False
        isian.nth(0).fill(kiri)
        isian.nth(1).fill(kanan)
        if rel != "=":
            page.get_by_role("button", name=f"tanda {rel}").click()
        page.get_by_role("button", name="Periksa").click()
        ada_balik = ada_balik or lk["balik"]
    expect(page.locator(".umpan.benar", has_text="Selesai")).to_be_visible()
    return ada_balik


def jawab_pilihan(page: Page, teks: str) -> None:
    page.locator(".pilihan button").filter(has_text=re.compile(f"^{re.escape(teks)}$")).first.click()
    expect(page.locator(".umpan.benar")).to_be_visible()


def main() -> None:
    galat: list[str] = []
    misi = json.loads(urllib.request.urlopen(URL + "data/literasi.json").read().decode())["misi"]
    with sync_playwright() as p:
        browser = p.chromium.launch(channel="chrome")
        ctx = browser.new_context(viewport={"width": 390, "height": 844}, device_scale_factor=2, is_mobile=True, has_touch=True)
        page = ctx.new_page()
        page.on("pageerror", lambda e: galat.append(f"pageerror: {e}"))
        page.on("console", lambda m: m.type == "error" and galat.append(f"console: {m.text}"))

        # 1. Masuk pertama kali
        page.goto(URL)
        expect(page).to_have_url(re.compile(r"#/masuk$"))
        foto(page, "01-masuk")
        page.get_by_label("Nama panggilan").fill("Sari")
        page.get_by_role("button", name="Mulai Belajar").click()
        page.get_by_role("link", name="Nanti saja").click()
        expect(page.get_by_role("heading", name="Halo, Sari! 👋")).to_be_visible()
        foto(page, "02-beranda")

        # 2. Kuis prasyarat
        page.goto(URL + "#/prasyarat")
        data = json.loads(urllib.request.urlopen(URL + "data/prasyarat.json").read().decode())
        for i, q in enumerate(data["soal"]):
            jawab_pilihan(page, q["pilihan"][q["benar"]])
            page.get_by_role("button", name=re.compile("Soal berikutnya|Lihat hasil")).click()
        expect(page.locator(".skor-besar")).to_have_text("100")

        # 3. Materi: timbangan & cermin tanda
        page.goto(URL + "#/belajar/plsv/2")
        for _ in range(3):
            page.get_by_role("button", name="Langkah berikutnya ▶").click()
        expect(page.locator(".panel-langkah")).to_contain_text("x = 4")
        foto(page, "03-timbangan")
        page.goto(URL + "#/belajar/tanda/1")
        for _ in range(3):
            page.get_by_role("button", name="Langkah berikutnya ▶").click()
        expect(page.locator(".panel-langkah")).to_contain_text("−2 > −5")
        page.get_by_role("button", name="Langkah berikutnya ▶").click()
        page.get_by_role("button", name="lebih dari").click()
        expect(page.locator(".panel-langkah .umpan.benar")).to_be_visible()
        foto(page, "04-cermin")
        page.goto(URL + "#/belajar/tanda/3")
        for _ in range(2):
            page.get_by_role("button", name=re.compile("Tampilkan langkah")).click()
        expect(page.locator(".chip-op.balik")).to_be_visible()

        # 4. Sesi latihan PtLSV menengah (≥ separuh soal perlu balik tanda)
        page.goto(URL + "#/latihan/ptlsv/menengah")
        sudah_uji_salah = False
        for i in range(5):
            expect(page.locator(".soal-kepala")).to_be_visible()
            # Tombol lanjut baru muncul setelah soal selesai.
            expect(page.get_by_role("button", name=re.compile("Soal berikutnya|Lihat hasil"))).to_be_hidden()
            balik = kerjakan_soal(page, salah_tanda_dulu=not sudah_uji_salah)
            sudah_uji_salah = sudah_uji_salah or balik
            page.get_by_role("button", name=re.compile("Soal berikutnya|Lihat hasil")).click()
        assert sudah_uji_salah, "tidak ada soal yang perlu membalik tanda"
        expect(page.locator(".skor-besar")).to_be_visible()
        skor = int(page.locator(".skor-besar").inner_text())
        assert skor == 80, f"satu soal sengaja salah, harusnya 80, dapat {skor}"
        expect(page.get_by_text("Lupa membalik tanda (1×)")).to_be_visible()
        page.locator("details summary").first.click()
        foto(page, "06-hasil-latihan")

        # 5. Petunjuk bertingkat & operasi kurang tepat
        page.goto(URL + "#/latihan/plsv/dasar")
        expect(page.locator(".umpan.info")).to_be_visible()  # petunjuk otomatis level dasar
        for t in (1, 2, 3):
            page.get_by_role("button", name="💡 Petunjuk").click()
            expect(page.locator(".umpan.info")).to_contain_text(f"Petunjuk {t}/3")
        foto(page, "07-latihan-dasar")

        # 6. Misi literasi (lift: x ≤ 29,2 → 29 kotak)
        m = next(x for x in misi if x["id"] == "lift")
        page.goto(URL + f"#/literasi/{m['id']}")
        foto(page, "08-literasi-cerita")
        page.get_by_role("button", name="Lanjut →").click()
        for tahap in ("pahami", "rumuskan"):
            jawab_pilihan(page, m[tahap]["pilihan"][m[tahap]["benar"]])
            page.get_by_role("button", name="Lanjut →").click()
        kerjakan_soal(page)
        page.get_by_role("button", name="Lanjut →").click()
        jawab_pilihan(page, m["tafsirkan"]["pilihan"][m["tafsirkan"]["benar"]])
        foto(page, "09-literasi-tafsir")
        page.get_by_role("button", name="Lanjut →").click()
        jawab_pilihan(page, m["cek"]["pilihan"][m["cek"]["benar"]])
        page.get_by_role("button", name="Lihat hasil misi").click()
        expect(page.locator(".skor-besar")).to_have_text("100")
        foto(page, "10-literasi-hasil")

        # 7. Progres & pengaturan
        page.goto(URL + "#/progres")
        expect(page.get_by_text("Misi lift")).to_be_visible()
        page.goto(URL + "#/akun")
        page.get_by_role("button", name="Gelap").click()
        assert page.evaluate("document.documentElement.dataset.tema") == "gelap"
        page.goto(URL + "#/belajar/simbol")
        foto(page, "11-simbol-gelap")
        page.goto(URL + "#/akun")
        page.get_by_role("button", name="Auto").click()

        # 8. Mode offline (service worker + bank soal di perangkat)
        page.goto(URL)
        page.evaluate("navigator.serviceWorker.ready.then(() => true)")
        page.reload()
        page.wait_for_timeout(500)
        ctx.set_offline(True)
        page.goto(URL + "#/latihan/plsv/menengah")
        page.reload()
        expect(page.locator(".soal-kepala")).to_be_visible()
        expect(page.get_by_text("📴 Offline")).to_be_visible()
        foto(page, "12-offline")
        ctx.set_offline(False)

        # 9. Lebar desktop
        page.set_viewport_size({"width": 1280, "height": 800})
        page.goto(URL + "#/")
        foto(page, "13-desktop")
        lebar = page.evaluate("document.documentElement.scrollWidth")
        assert lebar <= 1280, "ada scroll horizontal"
        browser.close()

        # 10. Siap dipasang dari browser (profil Chrome biasa, bukan penyamaran)
        with tempfile.TemporaryDirectory() as profil:
            pctx = p.chromium.launch_persistent_context(profil, channel="chrome")
            pg = pctx.new_page()
            pg.goto(URL + "#/masuk")
            pg.evaluate("navigator.serviceWorker.ready.then(() => true)")
            masalah = pctx.new_cdp_session(pg).send("Page.getInstallabilityErrors")["installabilityErrors"]
            pctx.close()
        assert masalah == [], f"belum bisa dipasang: {masalah}"

    galat = [g for g in galat if "ERR_INTERNET_DISCONNECTED" not in g and "Failed to fetch" not in g]
    if galat:
        print("GALAT BROWSER:\n" + "\n".join(galat))
        sys.exit(1)
    print("E2E LULUS: semua alur berhasil. Tangkapan layar di", LAYAR.resolve())


if __name__ == "__main__":
    main()
