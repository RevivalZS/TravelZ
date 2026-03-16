@echo off
chcp 65001 > nul
echo.
echo ========================================
echo 🚀 旅游网站一键部署工具
echo ========================================
echo GitHub用户名: RevivalZS
echo 仓库名称: revival
echo 网站地址: https://revivalzs.github.io/revival/
echo ========================================
echo.

echo 步骤1: 检查Git状态
git status
echo.

echo 步骤2: 检查远程仓库
git remote -v
echo.

echo 步骤3: 尝试推送到GitHub
echo 注意: 可能需要GitHub访问令牌
echo 生成令牌: https://github.com/settings/tokens
echo 选择权限: repo (全部仓库权限)
echo.
echo 按任意键开始推送...
pause > nul

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 推送成功！
    echo.
    echo 下一步:
    echo 1. 打开 https://github.com/RevivalZS/revival/settings/pages
    echo 2. 选择 Branch: main, Folder: / (root)
    echo 3. 点击 Save
    echo 4. 等待2分钟，访问 https://revivalzs.github.io/revival/
    echo.
) else (
    echo.
    echo ❌ 推送失败
    echo.
    echo 可能的原因:
    echo 1. 需要GitHub访问令牌（不是密码）
    echo 2. 仓库不存在
    echo 3. 网络问题
    echo.
    echo 解决方案:
    echo 1. 先创建仓库: https://github.com/new
    echo     - 名称: revival
    echo     - 公开仓库
    echo     - 不要初始化README
    echo 2. 生成访问令牌: https://github.com/settings/tokens
    echo 3. 重新运行此脚本
    echo.
)

echo 按任意键查看部署指南...
pause > nul

start DEPLOY_NOW.md

echo.
echo 按任意键退出...
pause > nul