@echo off
setlocal

set "ROOT=%~dp0"
set "AI_PATH=%ROOT%ai-service"

echo Iniciando ai-service desde: %AI_PATH%

if not exist "%AI_PATH%\venv\Scripts\activate.bat" (
  echo [WARN] No se encontro el virtualenv en %AI_PATH%\venv\Scripts\activate.bat
  exit /b 1
)

start "ai-service" /D "%AI_PATH%" cmd /k "call venv\Scripts\activate.bat && uvicorn app.main:app --reload --port 8000"

echo ai-service lanzado.
exit /b 0
