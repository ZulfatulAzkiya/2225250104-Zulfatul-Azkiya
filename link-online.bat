@echo off
REM Membuat link HTTPS sementara untuk ULFALINE (bisa dibuka & dipasang dari HP mana pun).
REM Link aktif selama laptop menyala dan jendela ini terbuka. Tanpa akun, gratis.
cd /d "%~dp0"
if not exist tools\cloudflared.exe (
  echo Mengunduh cloudflared dari GitHub resmi Cloudflare, hanya sekali...
  if not exist tools mkdir tools
  curl -L -o tools\cloudflared.exe https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-windows-amd64.exe || goto gagal
)
start "ULFALINE server" /min cmd /c "%~dp0jalankan.bat"
echo.
echo ================================================================
echo  Tunggu beberapa detik. Cari baris berisi alamat seperti
echo      https://xxxx-xxxx.trycloudflare.com
echo  Buka alamat itu di HP, lalu ketuk "Pasang Aplikasi".
echo  Tutup jendela ini untuk mematikan link.
echo ================================================================
echo.
tools\cloudflared.exe tunnel --no-autoupdate --url http://localhost:8000
goto :eof
:gagal
echo Gagal mengunduh cloudflared. Periksa koneksi internet.
pause
