@echo off
REM Menerbitkan ulang ULFALINE ke GitHub Pages (isi folder frontend -> cabang gh-pages).
REM Jalankan setelah perubahan di-commit dan di-push ke cabang main.
cd /d "%~dp0"
echo Menyiapkan isi folder frontend...
for /f %%i in ('git subtree split --prefix=frontend HEAD') do set SPLIT=%%i
if "%SPLIT%"=="" goto gagal
git push --force origin %SPLIT%:refs/heads/gh-pages || goto gagal
echo.
echo  Selesai! Dalam 1-2 menit situs diperbarui:
echo  https://zulfatulazkiya.github.io/2225250104-Zulfatul-Azkiya/
echo  Ingat: naikkan VERSI di frontend\sw.js agar HP siswa ikut memperbarui cache.
pause
goto :eof
:gagal
echo Gagal menerbitkan. Pastikan sudah login GitHub dan perubahan sudah di-commit.
pause
