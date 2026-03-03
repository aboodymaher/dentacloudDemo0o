@echo off
echo ===============================
echo   Starting DentaCloud System
echo ===============================

REM تشغيل السيرفر
start cmd /k "cd backend && run-server.bat"

REM تشغيل الفرونت
start cmd /k "run-frontend.bat"

echo System is running...
