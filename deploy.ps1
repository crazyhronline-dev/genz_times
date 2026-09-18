# ==============================================================================
#  GenZ Time - 1-Click Ultra-Fast Production Deployment Pipeline
# ==============================================================================
param(
    [string]$Msg = "Update GenZ Time production build"
)

$ErrorActionPreference = "Stop"
$StartTime = Get-Date

Write-Host "====================================================================" -ForegroundColor Cyan
Write-Host "         GenZ Time - Automated Production Deployment Pipeline       " -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan

# 1. Local Production Build
Write-Host "`n[1/5] Building Next.js production bundle..." -ForegroundColor Green
& npm.cmd run build
if ($LASTEXITCODE -ne 0) {
    Write-Host "Build failed! Deployment aborted." -ForegroundColor Red
    exit 1
}
Write-Host " - Build completed successfully!" -ForegroundColor Green

# 2. Git Commit & Push
Write-Host "`n[2/5] Committing and pushing to GitHub repository..." -ForegroundColor Green
git add -A
$st = git status --porcelain
if ($st) {
    $now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    git commit -m "$Msg - $now"
}
git push origin main
Write-Host " - Git repository synchronized!" -ForegroundColor Green

# 3. Package Server & Static Files
Write-Host "`n[3/5] Packaging build artifacts..." -ForegroundColor Green
$tarFile = "next_dist.tar.gz"
if (Test-Path $tarFile) { Remove-Item -Force $tarFile }
tar.exe -czf $tarFile -C .next server static BUILD_ID prerender-manifest.json routes-manifest.json app-build-manifest.json app-path-routes-manifest.json build-manifest.json required-server-files.json
$tarSize = [math]::Round(((Get-Item $tarFile).Length / 1MB), 2)
Write-Host " - Packaged $tarFile ($tarSize MB)" -ForegroundColor Green

# 4. Upload & Extract on Live Server
Write-Host "`n[4/5] Deploying build to Hostinger live server..." -ForegroundColor Green
$remoteHost = "93.127.208.60"
$remotePort = "65002"
$remoteUser = "u185228347"
$keyPath = "$env:USERPROFILE/.ssh/id_rsa"
$remoteBase = "/home/u185228347/domains/genztime.com/hbuilds/current/nodejs"

# Safeguard: Take immutable snapshot of production data before deployment
Write-Host " - Creating immutable snapshot of production posts and data..." -ForegroundColor Cyan
$backupCmd = "mkdir -p $remoteBase/data/backups && cp -p $remoteBase/data/posts.json $remoteBase/data/posts.backup.json 2>/dev/null; cp -p $remoteBase/data/posts.json $remoteBase/data/backups/posts-pre-deploy-`$(date +%Y-%m-%d-%H%M%S).json 2>/dev/null"
& ssh -p $remotePort -i $keyPath "$($remoteUser)@$($remoteHost)" $backupCmd

# Bidirectional non-destructive post sync: merge remote & local posts so no posts are ever lost
Write-Host " - Synchronizing and safeguarding articles and reviews..." -ForegroundColor Cyan
& scp -P $remotePort -i $keyPath "$($remoteUser)@$($remoteHost):$($remoteBase)/data/posts.json" scratch/remote_posts.json 2>$null
if (Test-Path scratch/remote_posts.json) {
    & node scripts/merge-posts.js
}
& scp -P $remotePort -i $keyPath data/posts.json "$($remoteUser)@$($remoteHost):$($remoteBase)/data/posts.json"
& scp -P $remotePort -i $keyPath data/posts.backup.json "$($remoteUser)@$($remoteHost):$($remoteBase)/data/posts.backup.json"

# Upload tarball
& scp -P $remotePort -i $keyPath $tarFile "$($remoteUser)@$($remoteHost):$($remoteBase)/$tarFile"

# Extract, reload Passenger, and cleanup
$remoteCmd = "tar -xzf $remoteBase/$tarFile -C $remoteBase/.next/ && rm -f $remoteBase/$tarFile && touch $remoteBase/tmp/restart.txt"
& ssh -p $remotePort -i $keyPath "$($remoteUser)@$($remoteHost)" $remoteCmd

# Clean local tarball
Remove-Item -Force $tarFile -ErrorAction SilentlyContinue
Write-Host " - Build extracted and Phusion Passenger reloaded!" -ForegroundColor Green

# 5. Live Health Check
Write-Host "`n[5/5] Performing live production health check..." -ForegroundColor Green
Start-Sleep -Seconds 2
$healthCheck = & curl.exe -I -s --resolve "genztime.com:443:93.127.208.60" "https://genztime.com/"
if ($healthCheck -match "200 OK") {
    Write-Host " - Health Check PASSED: HTTP/1.1 200 OK" -ForegroundColor Green
} else {
    Write-Host " - Warning: Expected HTTP 200 OK" -ForegroundColor Yellow
}

$TotalTime = [math]::Round(((Get-Date) - $StartTime).TotalSeconds, 1)
Write-Host "`n====================================================================" -ForegroundColor Cyan
Write-Host "  DEPLOYMENT COMPLETE! Live at https://genztime.com in $TotalTime seconds" -ForegroundColor Yellow
Write-Host "====================================================================" -ForegroundColor Cyan
