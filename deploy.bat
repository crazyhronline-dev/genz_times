@echo off
title GenZ Time - Deploy to Live Production
color 0B
echo ====================================================================
echo             GenZ Time - 1-Click Production Deployer
echo ====================================================================
echo.
powershell -NoProfile -ExecutionPolicy Bypass -File %~dp0deploy.ps1 %*
echo.
pause
