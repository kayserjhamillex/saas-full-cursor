@echo off
setlocal

set "ROOT=%~dp0"
echo Iniciando servicios desde: %ROOT%

call :start_service "email-service"
call :start_service "file-service"
call :start_service "whatsapp-service"

echo Servicios lanzados.
exit /b 0

:start_service
set "SERVICE_NAME=%~1"
set "SERVICE_PATH=%ROOT%services\%SERVICE_NAME%"

if not exist "%SERVICE_PATH%\package.json" (
  echo [WARN] No existe package.json en %SERVICE_PATH%
  exit /b 0
)

start "service-%SERVICE_NAME%" /D "%SERVICE_PATH%" cmd /k "npm run start:dev"
exit /b 0
