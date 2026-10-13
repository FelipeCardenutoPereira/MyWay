@echo off
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Node.js nao foi encontrado. Instale Node.js LTS e execute novamente.
  pause
  exit /b 1
)
start "MyWay Dev Server" cmd /k "cd /d "%~dp0" && node tools\dev-server.mjs"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5173/dev/editor.html"
