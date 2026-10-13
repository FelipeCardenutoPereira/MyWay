@echo off
cd /d "%~dp0"
call npm run sync
if errorlevel 1 goto :erro
call npm run check
if errorlevel 1 goto :erro
echo.
echo Tudo certo. A interface foi sincronizada com Windows e Android.
pause
exit /b 0
:erro
echo.
echo Houve um erro. Veja as mensagens acima.
pause
exit /b 1
