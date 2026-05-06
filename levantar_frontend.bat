@echo off
setlocal

set "ROOT=%~dp0"
echo Iniciando frontends desde: %ROOT%

call :start_front "angular-app" "start"
call :start_front "react-app" "dev"
call :start_front "demo-app" "dev"

echo Frontends lanzados.
exit /b 0

:start_front
set "FRONT_NAME=%~1"
set "FRONT_SCRIPT=%~2"
set "FRONT_PATH=%ROOT%frontend\%FRONT_NAME%"

if not exist "%FRONT_PATH%\package.json" (
  echo [WARN] No existe package.json en %FRONT_PATH%
  exit /b 0
)

start "front-%FRONT_NAME%" /D "%FRONT_PATH%" cmd /k "npm run %FRONT_SCRIPT%"
exit /b 0
