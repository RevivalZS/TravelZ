@echo off
chcp 65001 > nul
echo.
echo ========================================
echo        GUIDED DEPLOYMENT WIZARD
echo ========================================
echo.
echo This wizard will guide you through deploying
echo your travel website to GitHub.
echo.
echo Press any key to continue...
pause > nul
cls

:STEP1
echo ========================================
echo STEP 1: CHECK GITHUB REPOSITORY
echo ========================================
echo.
echo Please open this URL in your browser:
echo.
echo   https://github.com/RevivalZS/revival
echo.
echo Does the repository exist? (y/n)
set /p repo_exists=
if /i "%repo_exists%"=="y" goto STEP2
if /i "%repo_exists%"=="n" goto CREATE_REPO

:CREATE_REPO
echo.
echo ========================================
echo CREATE REPOSITORY
echo ========================================
echo.
echo Please create the repository:
echo.
echo 1. Open: https://github.com/new
echo 2. Repository name: revival
echo 3. Description: Travel website
echo 4. Public: YES
echo 5. DO NOT initialize README, .gitignore, license
echo 6. Click "Create repository"
echo.
echo Press any key after creating the repository...
pause > nul
goto STEP2

:STEP2
cls
echo ========================================
echo STEP 2: GENERATE ACCESS TOKEN
echo ========================================
echo.
echo You need a GitHub Personal Access Token.
echo.
echo 1. Open: https://github.com/settings/tokens
echo 2. Click "Generate new token"
echo 3. Click "Generate new token (classic)"
echo 4. Note: Travel website
echo 5. Expiration: 90 days
echo 6. Select scopes: CHECK "repo" (all)
echo 7. Click "Generate token"
echo 8. COPY the token (only shown once)
echo.
echo IMPORTANT: Save the token somewhere safe!
echo.
echo Press any key after generating token...
pause > nul
goto STEP3

:STEP3
cls
echo ========================================
echo STEP 3: PUSH CODE TO GITHUB
echo ========================================
echo.
echo Now pushing your code to GitHub...
echo.
echo When asked for credentials:
echo   Username: RevivalZS
echo   Password: PASTE the token you copied
echo.
echo Press any key to start push...
pause > nul

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo SUCCESS! Code pushed to GitHub.
    goto STEP4
) else (
    echo.
    echo ERROR: Push failed.
    echo.
    echo Possible reasons:
    echo 1. Wrong token
    echo 2. Repository doesn't exist
    echo 3. Network problem
    echo.
    echo Press any key to retry...
    pause > nul
    goto STEP3
)

:STEP4
cls
echo ========================================
echo STEP 4: ENABLE GITHUB PAGES
echo ========================================
echo.
echo Now enable GitHub Pages:
echo.
echo 1. Open: https://github.com/RevivalZS/revival/settings/pages
echo 2. Source: Deploy from a branch
echo 3. Branch: main
echo 4. Folder: / (root)
echo 5. Click "Save"
echo.
echo Press any key after enabling Pages...
pause > nul
goto STEP5

:STEP5
cls
echo ========================================
echo STEP 5: VISIT YOUR WEBSITE
echo ========================================
echo.
echo CONGRATULATIONS! Your website is now live.
echo.
echo Please wait 1-2 minutes, then visit:
echo.
echo   https://revivalzs.github.io/revival/
echo.
echo Test these features:
echo 1. Browse 6 travel destinations
echo 2. Filter by tags (Nature/History/City/Food)
echo 3. Add your own travel spots
echo 4. Check responsive design
echo.
echo ========================================
echo DEPLOYMENT COMPLETE!
echo ========================================
echo.
echo Summary:
echo - Repository: https://github.com/RevivalZS/revival
echo - Website:    https://revivalzs.github.io/revival/
echo - Local:      %CD%
echo.
echo Press any key to exit...
pause > nul