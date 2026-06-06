@echo off
cd /d "D:\znnvvv\Khan Chapan Web Site\Khan Chapan Web Site"

REM Delete stale lock file if present
if exist .git\config.lock del /f /q .git\config.lock

REM Re-initialize git (safe on existing repo)
git init

REM Configure identity for this repo
git config user.email "jahongirmurodov43@gmail.com"
git config user.name "Khan Chapan"

REM Stage everything
git add .

REM Commit
git commit -m "chore: project scaffold"

echo.
echo === DONE ===
pause
