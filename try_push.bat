@echo off
echo 🚀 尝试推送旅游网站到GitHub
echo ========================================
echo.

echo 当前Git状态：
git status
echo.

echo 远程仓库配置：
git remote -v
echo.

echo 提交历史：
git log --oneline -5
echo.

echo 尝试推送到GitHub...
echo 如果要求输入用户名，请输入: RevivalZS
echo 如果要求输入密码，请使用GitHub访问令牌
echo.

git push -u origin main

if %errorlevel% equ 0 (
    echo.
    echo ✅ 推送成功！
    echo.
    echo 🌐 你的网站地址：https://revivalzs.github.io/revival/
    echo 📁 GitHub仓库：https://github.com/RevivalZS/revival
    echo.
    echo 请访问GitHub仓库，启用Pages：
    echo 1. 打开 https://github.com/RevivalZS/revival/settings/pages
    echo 2. 选择 Branch: main, Folder: / (root)
    echo 3. 点击 Save
) else (
    echo.
    echo ❌ 推送失败
    echo.
    echo 可能的原因：
    echo 1. 需要GitHub访问令牌（不是密码）
    echo 2. 仓库不存在或没有权限
    echo 3. 网络连接问题
    echo.
    echo 解决方案：
    echo 1. 生成访问令牌：https://github.com/settings/tokens
    echo 2. 创建仓库：https://github.com/new
    echo 3. 检查网络连接
)

echo.
echo 按任意键退出...
pause > nul