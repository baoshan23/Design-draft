@echo off
setlocal

rem Use PORT=8080 by default; do NOT hardcode encryption secrets here.
if "%PORT%"=="" set PORT=8080
if "%ENCRYPTION_SECRET%"=="" (
	echo WARNING: ENCRYPTION_SECRET is not set. Set it in your environment before running the backend for secure operation.
)

start "GCSS Backend" /D "%~dp0..\backend" cmd /k "set "PORT=%PORT%" && go run ./cmd/server"
start "GCSS Frontend" /D "%~dp0" cmd /k "npm run dev"

echo Backend:  http://localhost:%PORT%
echo Frontend: http://localhost:3000/en/
endlocal
