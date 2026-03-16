@echo off
chcp 65001 > nul
echo.
echo ========================================
echo        OPEN ALL DEPLOYMENT PAGES
echo ========================================
echo.
echo Opening all necessary pages for deployment...
echo.

echo 1. Opening GitHub Pages settings...
start "" "https://github.com/RevivalZS/revival/settings/pages"

echo 2. Opening GitHub repository...
start "" "https://github.com/RevivalZS/revival"

echo 3. Opening your website (after enabling Pages)...
start "" "https://revivalzs.github.io/revival/"

echo 4. Opening local preview...
start "" "index.html"

echo 5. Opening deployment guide...
start "" "AUTO_OPEN_PAGES.html"

echo.
echo ========================================
echo        DEPLOYMENT INSTRUCTIONS
echo ========================================
echo.
echo PLEASE FOLLOW THESE STEPS:
echo.
echo 1. In the GitHub Pages settings page (first tab):
echo    - Source: Select "Deploy from a branch"
echo    - Branch: Select "main"
echo    - Folder: Select "/ (root)"
echo    - Click "Save"
echo.
echo 2. Wait 1-2 minutes for deployment
echo.
echo 3. Check your website (third tab)
echo.
echo 4. Test all features:
echo    - Browse 6 travel destinations
echo    - Filter by tags (Nature/History/City/Food)
echo    - Add your own travel spots
echo    - Check responsive design
echo.
echo ========================================
echo        IMPORTANT LINKS
echo ========================================
echo.
echo GitHub Pages:    https://github.com/RevivalZS/revival/settings/pages
echo Repository:      https://github.com/RevivalZS/revival
echo Website:         https://revivalzs.github.io/revival/
echo Local:           %CD%
echo.
echo ========================================
echo        STATUS
echo ========================================
echo.
echo Code push:       SUCCESS (using your token)
echo Pages enabled:   PENDING (you need to do this)
echo Website online:  PENDING (after enabling Pages)
echo.
echo Press any key to exit...
pause > nul