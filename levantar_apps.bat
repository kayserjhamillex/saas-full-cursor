@echo off
setlocal

set "ROOT=%~dp0"
echo Iniciando apps desde: %ROOT%

call :start_app "api-gateway"
call :start_app "assets-service"
call :start_app "auth-service"
call :start_app "clinical-service"
call :start_app "core-service"
call :start_app "financial-service"
call :start_app "hr-service"
call :start_app "inventory-service"
call :start_app "scheduling-service"

echo Apps lanzadas.
exit /b 0

:start_app
set "APP_NAME=%~1"
set "APP_PATH=%ROOT%apps\%APP_NAME%"

if not exist "%APP_PATH%\package.json" (
  echo [WARN] No existe package.json en %APP_PATH%
  exit /b 0
)

if /I "%APP_NAME%"=="api-gateway" (
  for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
    echo Liberando puerto 3000 PID %%P para api-gateway...
    taskkill /PID %%P /T /F >nul 2>&1
  )
)

if /I "%APP_NAME%"=="assets-service" (
  for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":3007" ^| findstr "LISTENING"') do (
    echo Liberando puerto 3007 PID %%P para assets-service...
    taskkill /PID %%P /T /F >nul 2>&1
  )
)

if /I "%APP_NAME%"=="scheduling-service" (
  for /f "tokens=5" %%P in ('netstat -ano ^| findstr ":3008" ^| findstr "LISTENING"') do (
    echo Liberando puerto 3008 PID %%P para scheduling-service...
    taskkill /PID %%P /T /F >nul 2>&1
  )
)

start "app-%APP_NAME%" /D "%APP_PATH%" cmd /k "npm run start:dev"
exit /b 0
