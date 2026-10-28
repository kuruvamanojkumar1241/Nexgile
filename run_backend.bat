@echo off
title Nexgile-MediOracle Django Backend (Port 8000)
cd /d "%~dp0backend"
echo ====================================================
echo Starting Nexgile-MediOracle Django REST Backend...
echo ====================================================
python manage.py migrate
python manage.py runserver 8000
pause
