# 🚀 快速部署指南 - 旅游网站到GitHub

## 📋 部署前准备

### 1. 确保已安装Git
```bash
# 检查Git是否安装
git --version
```
如果未安装，下载：https://git-scm.com/downloads

### 2. 有GitHub账号
如果没有，注册：https://github.com/signup

## 🔧 部署步骤（10分钟完成）

### 步骤1：打开命令提示符或PowerShell
按 `Win + R`，输入 `cmd` 或 `powershell`，回车

### 步骤2：进入网站目录
```bash
cd "C:\Users\13419\.openclaw\workspace\travel-website"
```

### 步骤3：初始化Git仓库
```bash
git init
git add .
git commit -m "Initial commit - Travel website"
```

### 步骤4：在GitHub创建仓库
1. 打开 https://github.com/new
2. 填写信息：
   - Repository name: `travel-website` (或其他名字)
   - Description: `旅游景点分享网站`
   - Public: ✅ 选择公开
   - 不要勾选：Initialize this repository with...
3. 点击 **Create repository**

### 步骤5：连接并推送代码
复制GitHub显示的代码（类似这样）：
```bash
git remote add origin https://github.com/你的用户名/travel-website.git
git branch -M main
git push -u origin main
```

### 步骤6：启用GitHub Pages
1. 进入仓库：https://github.com/你的用户名/travel-website
2. 点击 **Settings** → **Pages**
3. 配置：
   - Source: Deploy from a branch
   - Branch: main
   - Folder: / (root)
4. 点击 **Save**

### 步骤7：等待并访问
等待1-2分钟，访问：
```
https://你的用户名.github.io/travel-website/
```

## 🌐 你的网站地址

部署成功后，你的网站将是：
```
https://你的用户名.github.io/travel-website/
```

例如：
```
https://revivalz.github.io/travel-website/
```

## 📱 分享给朋友

### 分享方式：
1. **直接发链接**：把上面的网址发给朋友
2. **生成二维码**：用 https://qr.io/ 生成二维码
3. **社交媒体**：分享到微信、QQ等

### 朋友可以：
- 浏览你推荐的景点
- 添加他们发现的景点
- 按标签筛选（自然/历史/美食等）
- 分享到自己的社交圈

## 🔄 更新网站

如需更新网站内容：

```bash
# 1. 进入网站目录
cd "C:\Users\13419\.openclaw\workspace\travel-website"

# 2. 修改文件（编辑HTML/CSS/JS或places.json）

# 3. 提交并推送更新
git add .
git commit -m "更新内容描述"
git push
```

## ❓ 常见问题

### Q: 推送代码时要求登录？
A: 可能需要配置Git凭据：
```bash
git config --global user.name "你的名字"
git config --global user.email "你的邮箱"
```

### Q: GitHub Pages不显示？
A: 等待5-10分钟，或检查Settings → Pages配置

### Q: 如何修改网站样式？
A: 编辑 `style.css` 文件，修改颜色、字体等

### Q: 如何添加更多景点？
A: 编辑 `data/places.json` 或通过网站表单添加

### Q: 朋友添加的景点我能看到吗？
A: 目前每个用户看到的是自己浏览器保存的景点。如需共享，需要后端开发。

## 💡 高级功能（可选）

### 添加自定义域名
1. 购买域名（如 aliyun.com）
2. 在域名DNS添加CNAME记录指向GitHub
3. 在仓库Settings → Pages设置Custom domain

### 添加分析统计
1. 注册 Google Analytics
2. 在 `index.html` 中添加跟踪代码
3. 查看访问数据

### 添加评论系统
1. 使用 Giscus（GitHub Discussions）
2. 或使用 Disqus
3. 集成到网站中

## 🎯 一键部署命令（汇总）

```bash
# 在 travel-website 目录中执行：
git init
git add .
git commit -m "旅游网站部署"
git remote add origin https://github.com/你的用户名/travel-website.git
git branch -M main
git push -u origin main
```

## 📞 需要帮助？

如果遇到问题：
1. 检查错误信息
2. 搜索错误信息 + "GitHub"
3. 或问我（爪爪）！

---

**预计时间**：10-15分钟  
**难度**：简单（有Git基础）  
**结果**：永久在线的旅游分享网站  

**立即开始**：按照步骤操作，你的网站很快就能上线！