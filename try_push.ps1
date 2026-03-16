Write-Host "🚀 旅游网站GitHub部署助手" -ForegroundColor Green
Write-Host "=" * 50
Write-Host "GitHub用户名: RevivalZS" -ForegroundColor Cyan
Write-Host "仓库名称: revival" -ForegroundColor Cyan
Write-Host "网站地址: https://revivalzs.github.io/revival/" -ForegroundColor Cyan
Write-Host "=" * 50
Write-Host ""

# 检查当前状态
Write-Host "检查Git状态..." -ForegroundColor Yellow
git status
Write-Host ""

Write-Host "检查远程仓库..." -ForegroundColor Yellow
git remote -v
Write-Host ""

Write-Host "检查提交历史..." -ForegroundColor Yellow
git log --oneline -3
Write-Host ""

Write-Host "尝试推送到GitHub..." -ForegroundColor Yellow
Write-Host "提示：" -ForegroundColor White
Write-Host "1. 如果要求用户名，输入: RevivalZS" -ForegroundColor White
Write-Host "2. 如果要求密码，使用GitHub访问令牌（不是密码）" -ForegroundColor White
Write-Host "3. 访问令牌生成: https://github.com/settings/tokens" -ForegroundColor White
Write-Host ""

$response = Read-Host "按 Enter 开始推送，或输入 'skip' 跳过"
if ($response -ne 'skip') {
    git push -u origin main
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host ""
        Write-Host "✅ 推送成功！" -ForegroundColor Green
        Write-Host ""
        Write-Host "下一步：" -ForegroundColor Yellow
        Write-Host "1. 打开 https://github.com/RevivalZS/revival/settings/pages" -ForegroundColor White
        Write-Host "2. 选择 'Deploy from a branch'" -ForegroundColor White
        Write-Host "3. Branch: main, Folder: / (root)" -ForegroundColor White
        Write-Host "4. 点击 Save" -ForegroundColor White
        Write-Host "5. 等待1-2分钟，访问 https://revivalzs.github.io/revival/" -ForegroundColor White
    } else {
        Write-Host ""
        Write-Host "❌ 推送失败" -ForegroundColor Red
        Write-Host ""
        Write-Host "可能的原因：" -ForegroundColor Yellow
        Write-Host "• 需要GitHub访问令牌（生成: https://github.com/settings/tokens）" -ForegroundColor White
        Write-Host "• 仓库不存在（创建: https://github.com/new）" -ForegroundColor White
        Write-Host "• 网络问题" -ForegroundColor White
        Write-Host ""
        Write-Host "手动命令：" -ForegroundColor Gray
        Write-Host "git push -u origin main" -ForegroundColor Gray
    }
} else {
    Write-Host "跳过推送" -ForegroundColor Gray
}

Write-Host ""
Write-Host "📋 总结信息：" -ForegroundColor Yellow
Write-Host "• GitHub仓库: https://github.com/RevivalZS/revival" -ForegroundColor White
Write-Host "• 网站地址: https://revivalzs.github.io/revival/" -ForegroundColor White
Write-Host "• 本地目录: $PWD" -ForegroundColor White
Write-Host "• 主要文件: index.html, style.css, script.js" -ForegroundColor White

Write-Host ""
Write-Host "按 Enter 退出..."
Read-Host