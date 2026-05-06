@echo off
setlocal

set "ROOT=%~dp0"

echo Reiniciando todo...
call "%ROOT%detener_todo.bat"

echo Esperando 2 segundos para liberar puertos...
timeout /t 2 /nobreak >nul

call "%ROOT%levantar_todo.bat"

echo Reinicio completado.
exit /b 0
