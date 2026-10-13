@echo off
cd /d "%~dp0"
where code >nul 2>nul
if errorlevel 1 (
  echo Visual Studio Code nao foi encontrado no PATH.
  echo Abra o VS Code, escolha Arquivo ^> Abrir Workspace e selecione MyWay.code-workspace.
  pause
  exit /b 1
)
start "" code "MyWay.code-workspace"
