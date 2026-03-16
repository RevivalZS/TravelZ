Write-Host "========================================" -ForegroundColor Cyan
Write-Host "TRAVEL WEBSITE DEPLOYMENT" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "GitHub: RevivalZS/revival" -ForegroundColor White
Write-Host "Website: https://revivalzs.github.io/revival/" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Step 1: Check current status
Write-Host "1. Checking Git status..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "2. Checking remote repository..." -ForegroundColor Yellow
git remote -v
Write-Host ""

Write-Host "3. Checking commits..." -ForegroundColor Yellow
git log --oneline -3
Write-Host ""

# Step 2: Ask for action
Write-Host "4. Ready to deploy!" -ForegroundColor Green
Write-Host "   Before pushing, make sure:" -ForegroundColor White
Write-Host "   - Repository exists: https://github.com/RevivalZS/revival" -ForegroundColor White
Write-Host "   - If not, create it: https://github.com/new" -ForegroundColor White
Write-Host "   - Name: revival, Public, NO README initialization" -ForegroundColor White
Write-Host ""

$choice = Read-Host "Press Enter to push to GitHub, or type 'skip' to skip"

if ($choice -ne 'skip') {
    # Step 3: Push to GitHub
    Write-Host "Pushing to GitHub..." -ForegroundColor Yellow
    Write-Host "If asked for username: RevivalZS" -ForegroundColor White
    Write-Host "If asked for password: Use GitHub Personal Access Token" -ForegroundColor White
    Write-Host "Generate token: https://github.com/settings/tokens" -ForegroundColor White
    Write-Host ""
    
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "SUCCESS! Code pushed to GitHub." -ForegroundColor Green
        Write-Host ""
        Write-Host "Next steps:" -ForegroundColor Yellow
        Write-Host "1. Enable GitHub Pages:" -ForegroundColor White
        Write-Host "   https://github.com/RevivalZS/revival/settings/pages" -ForegroundColor White
        Write-Host "2. Select: Branch: main, Folder: / (root)" -ForegroundColor White
        Write-Host "3. Click Save" -ForegroundColor White
        Write-Host "4. Wait 1-2 minutes" -ForegroundColor White
        Write-Host "5. Visit: https://revivalzs.github.io/revival/" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "ERROR: Push failed" -ForegroundColor Red
        Write-Host ""
        Write-Host "Common issues:" -ForegroundColor Yellow
        Write-Host "1. Repository doesn't exist" -ForegroundColor White
        Write-Host "   Fix: Create at https://github.com/new" -ForegroundColor White
        Write-Host "2. Need access token (not password)" -ForegroundColor White
        Write-Host "   Fix: Generate at https://github.com/settings/tokens" -ForegroundColor White
        Write-Host "3. Network problem" -ForegroundColor White
        Write-Host "   Fix: Check internet connection" -ForegroundColor White
    }
} else {
    Write-Host "Skipping push." -ForegroundColor Gray
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "SUMMARY" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Repository: https://github.com/RevivalZS/revival" -ForegroundColor White
Write-Host "Website:    https://revivalzs.github.io/revival/" -ForegroundColor White
Write-Host "Local:      $PWD" -ForegroundColor White
Write-Host "========================================" -ForegroundColor Cyan

Write-Host ""
Write-Host "Press Enter to exit..."
Read-Host