# ==============================================================================
#  GenZ Time - 1-Click Ultra-Fast Production Deployment Pipeline
# ==============================================================================
param(
    [string] = Update GenZ Time production build
)

Continue = Stop
 = Get-Date

Write-Host ==================================================================== -ForegroundColor Cyan
Write-Host  GenZ Time - Automated Production Deployment Pipeline  -ForegroundColor Yellow
Write-Host ==================================================================== -ForegroundColor Cyan

# 1. Local Production Build
Write-Host 
[1/5] Building Next.js production bundle... -ForegroundColor Green
 = & npm.cmd run build
if ( -ne 0) {
    Write-Host Build failed! Deployment aborted. -ForegroundColor Red
    exit 1
}
Write-Host  - Build completed successfully! -ForegroundColor Green

# 2. Git Commit & Push
Write-Host 
[2/5] Committing and pushing to GitHub repository... -ForegroundColor Green
git add -A
 = git status --porcelain
if () {
    git commit -m  - 2026-09-12 04:38:27
}
git push origin main
Write-Host  - Git repository synchronized! -ForegroundColor Green

# 3. Package Server & Static Files
Write-Host 
[3/5] Packaging build artifacts... -ForegroundColor Green
 = next_dist.tar.gz
if (Test-Path ) { Remove-Item -Force  }
tar.exe -czf  -C .next server static BUILD_ID prerender-manifest.json routes-manifest.json app-build-manifest.json app-path-routes-manifest.json build-manifest.json required-server-files.json
 = [math]::Round(((Get-Item ).Length / 1MB), 2)
Write-Host  - Packaged ( MB) -ForegroundColor Green

# 4. Upload & Extract on Live Server
Write-Host 
[4/5] Deploying build to Hostinger live server... -ForegroundColor Green
 = 93.127.208.60
 = 65002
 = u185228347
 = C:\Users\wilso/.ssh/id_rsa
 = /home/u185228347/domains/genztime.com/hbuilds/current/nodejs

# Upload tarball
& scp -P  -i   @:/

# Extract, reload Passenger, and cleanup
 = tar -xzf / -C /.next/ && rm -f / && touch /tmp/restart.txt
& ssh -p  -i  @ 

# Clean local tarball
Remove-Item -Force  -ErrorAction SilentlyContinue
Write-Host  - Build extracted and Phusion Passenger reloaded! -ForegroundColor Green

# 5. Live Health Check
Write-Host 
[5/5] Performing live production health check... -ForegroundColor Green
Start-Sleep -Seconds 2
 = & curl.exe -I -s --resolve genztime.com:443:93.127.208.60 https://genztime.com/
if ( -match 200 OK) {
    Write-Host  - Health Check PASSED: HTTP/1.1 200 OK -ForegroundColor Green
} else {
    Write-Host  - Warning: Expected HTTP 200 OK, got: -ForegroundColor Yellow
    Write-Host 
}

 = [math]::Round(((Get-Date) - ).TotalSeconds, 1)
Write-Host 
==================================================================== -ForegroundColor Cyan
Write-Host  DEPLOYMENT COMPLETE! Live at https://genztime.com in seconds -ForegroundColor Yellow
Write-Host ==================================================================== -ForegroundColor Cyan
