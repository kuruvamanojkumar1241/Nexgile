@echo off
echo ==============================================
echo Deploying MediOracle Frontend to Vercel
echo ==============================================

:: Ensure AppData npm directory exists to prevent npm ENOENT bug on Windows
if not exist "%APPDATA%\npm" mkdir "%APPDATA%\npm"

cd /d "%~dp0frontend"

echo.
echo Running Vercel CLI...
echo If prompted to login, select GitHub/Email and complete it in your browser.
echo.

call npx vercel

echo.
echo Deploying to Production (--prod)...
call npx vercel --prod

pause

