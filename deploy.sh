#!/bin/bash

echo "🚀 开始构建旅游网站..."

# 构建网站
hugo

echo "📦 网站构建完成！"

echo ""
echo "📝 部署步骤："
echo "1. 在GitHub创建仓库：yourusername.github.io"
echo "2. 将public文件夹推送到仓库"
echo "3. 在GitHub设置中启用GitHub Pages"
echo ""
echo "🌐 访问地址：https://yourusername.github.io"
echo ""
echo "💡 提示：将yourusername替换为你的GitHub用户名"