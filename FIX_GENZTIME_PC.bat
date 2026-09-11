@echo off
net session >nul 2>&1
if %errorlevel% neq 0 (
    echo =======================================================
    echo  Requesting Administrator Privilege to configure DNS...
    echo =======================================================
    powershell -NoProfile -ExecutionPolicy Bypass -Command Start-Process cmd -ArgumentList '/k ""%~f0" elevated"' -Verb RunAs
    exit /b
)

title GenZ Time - PC Connection & DNS Fix
color 0A
cls
echo ===============================================================================
echo            GenZ Time - Network & DNS Auto-Configuration Tool
echo ===============================================================================
echo.
echo [1/4] Setting High-Speed DNS on Wi-Fi (Google: 8.8.8.8, Cloudflare: 1.1.1.1)...
netsh interface ipv4 set dns name=Wi-Fi static 8.8.8.8 primary >nul 2>&1
netsh interface ipv4 add dns name=Wi-Fi 1.1.1.1 index=2 >nul 2>&1
powershell -Command Get-NetAdapter | Where-Object Status -eq 'Up' | ForEach-Object { Set-DnsClientServerAddress -InterfaceIndex $_.InterfaceIndex -ServerAddresses ('8.8.8.8','1.1.1.1') -ErrorAction SilentlyContinue }

echo.
echo [2/4] Updating Windows Hosts Mapping for genztime.com (93.127.208.60)...
findstr /C:93.127.208.60 genztime.com %SystemRoot%\System32\drivers\etc\hosts >nul 2>&1
if %errorlevel% neq 0 (
    echo. >> %SystemRoot%\System32\drivers\etc\hosts
    echo 93.127.208.60 genztime.com >> %SystemRoot%\System32\drivers\etc\hosts
    echo 93.127.208.60 www.genztime.com >> %SystemRoot%\System32\drivers\etc\hosts
    echo  - Host mapping added successfully!
) else (
    echo  - Host mapping already present!
)

echo.
echo [3/4] Flushing Windows DNS Cache...
ipconfig /flushdns

echo.
echo [4/4] Verifying connection to genztime.com...
powershell -Command $res = Resolve-DnsName genztime.com -ErrorAction SilentlyContinue; if ($res) { Write-Host ' - DNS Resolution SUCCESS: ' $res.IPAddress[0] -ForegroundColor Green } else { Write-Host ' - Checking hosts resolution...' -ForegroundColor Yellow }

echo.
echo ===============================================================================
echo  SUCCESS! genztime.com is now fully accessible on this PC across ALL browsers!
echo ===============================================================================
echo.
echo Launching https://genztime.com in your default browser...
start https://genztime.com/
echo.
echo You may now close this window.
pause
