@echo off
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0PUBLICAR-NO-GITHUB.ps1"
pause
