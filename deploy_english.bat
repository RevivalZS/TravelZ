@echo off
echo ========================================
echo TRAVEL WEBSITE DEPLOYMENT TOOL
echo ========================================
echo GitHub Username: RevivalZS
echo Repository: revival
echo Website: https://revivalzs.github.io/revival/
echo ========================================
echo.

echo Step 1: Check Git status
git status
echo.

echo Step 2: Check remote repository
git remote -v
echo.

echo Step 3: Try to push to GitHub
echo Note: You may need GitHub Personal Access Token
echo Generate token: https://github.com/settings/tokens
echo Select scope: repo (all repository permissions)
echo.
echo Press any key to start push...
pause > nul

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS: Push completed!
    echo.
    echo Next steps:
    echo 1. Open https://github.com/RevivalZS/revival/settings/pages
    echo 2. Select Branch: main, Folder: / (root)
    echo 3. Click Save
    echo 4. Wait 2 minutes, visit https://revivalzs.github.io/revival/
    echo.
) else (
    echo.
    echo ERROR: Push failed
    echo.
    echo Possible reasons:
    echo 1. Need GitHub Personal Access Token (not password)
    echo 2. Repository does not exist
    echo 3. Network issue
    echo.
    echo Solutions:
    echo 1. Create repository first: https://github.com/new
    echo    - Name: revival
    echo    - Public repository
    echo    - DO NOT initialize README
    echo 2. Generate access token: https://github.com/settings/tokens
    echo 3. Run this script again
    echo.
)

echo Press any key to open deployment guide...
pause > nul

start DEPLOY_NOW.md

echo.
echo Press any key to exit...
pause > nul