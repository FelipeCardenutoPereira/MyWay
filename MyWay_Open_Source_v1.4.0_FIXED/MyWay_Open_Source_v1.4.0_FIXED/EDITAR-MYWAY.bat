@echo off
setlocal
cd /d "%~dp0"
where code >nul 2>nul
if errorlevel 1 (
  echo Visual Studio Code nao foi encontrado no PATH.
  echo Abra o VS Code e selecione MyWay.code-workspace.
  pause
  exit /b 1
)
start "" code "MyWay.code-workspace"
where node >nul 2>nul
if errorlevel 1 exit /b 0
start "MyWay Preview" /min cmd /c "cd /d "%~dp0" && node tools\dev-server.mjs"
timeout /t 2 /nobreak >nul
start "" "http://127.0.0.1:5173/dev/editor.html"
