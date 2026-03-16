# 旅游网站GitHub部署脚本
Write-Host "🚀 开始部署旅游网站到GitHub" -ForegroundColor Green
Write-Host "=" * 50

# 检查当前目录
$currentDir = Get-Location
Write-Host "当前目录: $currentDir" -ForegroundColor Cyan

# 检查是否在正确目录
if (-not (Test-Path "index.html")) {
    Write-Host "❌ 错误：请在 travel-website 目录中运行此脚本" -ForegroundColor Red
    exit 1
}

# 1. 初始化Git仓库
Write-Host "1. 初始化Git仓库..." -ForegroundColor Yellow
if (Test-Path ".git") {
    Write-Host "   Git仓库已存在，跳过初始化" -ForegroundColor Gray
} else {
    git init
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ Git初始化失败" -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✅ Git仓库初始化成功" -ForegroundColor Green
}

# 2. 添加所有文件
Write-Host "2. 添加文件到Git..." -ForegroundColor Yellow
git add .
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ 添加文件失败" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ 文件添加成功" -ForegroundColor Green

# 3. 提交更改
Write-Host "3. 提交更改..." -ForegroundColor Yellow
git commit -m "Initial commit - Travel website by Claw"
if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ 提交失败" -ForegroundColor Red
    exit 1
}
Write-Host "   ✅ 更改提交成功" -ForegroundColor Green

# 4. 询问GitHub仓库信息
Write-Host "4. 配置GitHub仓库" -ForegroundColor Yellow
Write-Host "=" * 30

$githubUsername = Read-Host "请输入你的GitHub用户名"
$repoName = Read-Host "请输入仓库名称 (默认: travel-website)"
if ([string]::IsNullOrWhiteSpace($repoName)) {
    $repoName = "travel-website"
}

# 5. 创建GitHub仓库（需要用户手动操作）
Write-Host "`n5. 请在GitHub上创建仓库" -ForegroundColor Yellow
Write-Host "=" * 30
Write-Host "请按照以下步骤操作：" -ForegroundColor Cyan
Write-Host "1. 打开 https://github.com/new" -ForegroundColor White
Write-Host "2. 仓库名称: $repoName" -ForegroundColor White
Write-Host "3. 描述: 旅游景点分享网站" -ForegroundColor White
Write-Host "4. 选择: Public (公开)" -ForegroundColor White
Write-Host "5. 不要初始化README、.gitignore或license" -ForegroundColor White
Write-Host "6. 点击 'Create repository'" -ForegroundColor White

$continue = Read-Host "`n创建完成后按 Enter 继续"

# 6. 添加远程仓库并推送
Write-Host "6. 连接到GitHub并推送代码..." -ForegroundColor Yellow
$remoteUrl = "https://github.com/$githubUsername/$repoName.git"

# 检查是否已存在远程仓库
$remotes = git remote -v
if ($remotes -like "*$repoName*") {
    Write-Host "   远程仓库已存在，跳过添加" -ForegroundColor Gray
} else {
    git remote add origin $remoteUrl
    if ($LASTEXITCODE -ne 0) {
        Write-Host "   ❌ 添加远程仓库失败" -ForegroundColor Red
        exit 1
    }
    Write-Host "   ✅ 远程仓库添加成功" -ForegroundColor Green
}

# 重命名分支并推送
Write-Host "7. 推送代码到GitHub..." -ForegroundColor Yellow
git branch -M main
git push -u origin main

if ($LASTEXITCODE -ne 0) {
    Write-Host "   ❌ 推送失败，请检查网络和权限" -ForegroundColor Red
    Write-Host "   手动命令: git push -u origin main" -ForegroundColor Gray
    exit 1
}

Write-Host "   ✅ 代码推送成功！" -ForegroundColor Green

# 7. 启用GitHub Pages
Write-Host "`n8. 启用GitHub Pages" -ForegroundColor Yellow
Write-Host "=" * 30
Write-Host "请按照以下步骤启用GitHub Pages：" -ForegroundColor Cyan
Write-Host "1. 打开 https://github.com/$githubUsername/$repoName/settings/pages" -ForegroundColor White
Write-Host "2. 在 'Source' 部分选择: 'Deploy from a branch'" -ForegroundColor White
Write-Host "3. 分支选择: 'main'" -ForegroundColor White
Write-Host "4. 文件夹选择: '/ (root)'" -ForegroundColor White
Write-Host "5. 点击 'Save'" -ForegroundColor White

# 8. 显示网站地址
$websiteUrl = "https://$githubUsername.github.io/$repoName/"
Write-Host "`n🎉 部署完成！" -ForegroundColor Green
Write-Host "=" * 50
Write-Host "你的网站地址: $websiteUrl" -ForegroundColor Cyan
Write-Host "=" * 50

Write-Host "`n📋 下一步操作：" -ForegroundColor Yellow
Write-Host "1. 等待几分钟让GitHub Pages生效" -ForegroundColor White
Write-Host "2. 访问 $websiteUrl 测试网站" -ForegroundColor White
Write-Host "3. 分享链接给朋友: $websiteUrl" -ForegroundColor White
Write-Host "4. 如需更新网站，运行: git add . && git commit -m '更新' && git push" -ForegroundColor White

Write-Host "`n💡 提示：网站使用浏览器本地存储，每个访问者看到的是自己添加的景点。" -ForegroundColor Gray
Write-Host "   如需共享数据，需要开发后端功能（进阶需求）。" -ForegroundColor Gray

# 保存配置信息
$config = @{
    github_username = $githubUsername
    repo_name = $repoName
    website_url = $websiteUrl
    deployed_at = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
} | ConvertTo-Json

$config | Out-File -FilePath "deployment_config.json" -Encoding UTF8
Write-Host "`n📁 配置已保存到: deployment_config.json" -ForegroundColor Gray