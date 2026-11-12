@echo off
REM Menjalankan ULFALINE di komputer ini. Klik dua kali file ini.
cd /d "%~dp0backend"
if not exist .venv (
  echo Menyiapkan lingkungan Python untuk pertama kali...
  python -m venv .venv || goto gagal
  .venv\Scripts\python -m pip install -q -r requirements.txt || goto gagal
)
echo.
echo  ULFALINE berjalan di http://localhost:8000
echo  Tutup jendela ini untuk menghentikan aplikasi.
echo.
start "" http://localhost:8000
.venv\Scripts\python -m uvicorn app.main:app --port 8000
goto :eof
:gagal
echo Gagal menyiapkan Python. Pastikan Python 3.10+ sudah terpasang.
pause
