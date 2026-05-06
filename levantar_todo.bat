@echo off
setlocal

set "ROOT=%~dp0"
echo Ejecutando arranque completo desde: %ROOT%

if exist "%ROOT%ai-service\venv\Scripts\activate.bat" (
  start "ai-service" /D "%ROOT%ai-service" cmd /k "call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"
) else (
  echo [WARN] No se encontro el virtualenv en ai-service\venv\Scripts\activate.bat
)

call "%ROOT%levantar_apps.bat"
call "%ROOT%levantar_servicios.bat"
call "%ROOT%levantar_frontend.bat"

echo Todo lanzado.
exit /b 0
