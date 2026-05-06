@echo off
setlocal

echo Deteniendo procesos lanzados por los scripts...

call :kill_by_title "app-"
call :kill_by_title "service-"
call :kill_by_title "front-"
call :kill_by_title "ai-service"

echo.
echo Proceso de detencion finalizado.
exit /b 0

:kill_by_title
set "TITLE=%~1"
echo Cerrando ventanas con titulo %TITLE%*
taskkill /FI "IMAGENAME eq cmd.exe" /FI "WINDOWTITLE eq %TITLE%*" /T /F >nul 2>&1
exit /b 0
