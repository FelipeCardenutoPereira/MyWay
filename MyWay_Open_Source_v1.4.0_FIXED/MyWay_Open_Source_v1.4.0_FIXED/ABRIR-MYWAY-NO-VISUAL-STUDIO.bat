@echo off
setlocal
cd /d "%~dp0"
set "DEVENV="
set "VSWHERE=%ProgramFiles(x86)%\Microsoft Visual Studio\Installer\vswhere.exe"
if exist "%VSWHERE%" (
  for /f "usebackq tokens=*" %%i in (`"%VSWHERE%" -latest -products * -find Common7\IDE\devenv.exe`) do set "DEVENV=%%i"
)
if defined DEVENV (
  start "" "%DEVENV%" "%~dp0MyWay.VisualStudio.sln"
) else (
  echo Visual Studio nao foi localizado automaticamente.
  echo Abra MyWay.VisualStudio.sln manualmente no Visual Studio 2022.
  start "" "%~dp0"
)
where node >nul 2>nul
if errorlevel 1 exit /b 0
start "MyWay DEV" /min cmd /c "cd /d "%~dp0" && node tools\dev-server.mjs"
