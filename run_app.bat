@echo off
title Nexgile-MediOracle Healthcare Portal Launcher
echo ==========================================================
echo   Launching Nexgile-MediOracle Healthcare Portal
echo   Backend: Python Django REST Framework (Port 8000)
echo   Frontend: React + Vite (Port 5173)
echo ==========================================================

start "MediOracle Backend (Django)" "%~dp0run_backend.bat"
timeout /t 3 /nobreak >nul

start "MediOracle Frontend (React)" "%~dp0run_frontend.bat"
timeout /t 3 /nobreak >nul

echo Opening browser at http://localhost:5173 ...
start http://localhost:5173
echo.
echo Application is running! Keep the backend and frontend command windows open.
pause
