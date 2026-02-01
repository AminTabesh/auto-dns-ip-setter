@echo off
node "%~dp0set-ip.js"
echo.
echo Closing in 5 seconds...
timeout /t 5 > nul
