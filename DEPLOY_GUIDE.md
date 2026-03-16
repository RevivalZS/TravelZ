# 旅游网站部署指南

## 🚀 快速部署到GitHub Pages

### 方法一：使用GitHub Desktop（最简单）

1. **下载GitHub Desktop**
   - 访问 https://desktop.github.com/ 下载安装

2. **创建新仓库**
   - 打开GitHub Desktop
   - 点击"File" → "New Repository"
   - 名称: `travel-website` (或其他你喜欢的名字)
   - 本地路径: 选择 `~/.openclaw/workspace/travel-website`
   - 点击"Create Repository"

3. **提交更改**
   - 在GitHub Desktop中会看到所有文件
   - 在左下角填写提交信息，如"Initial commit"
   - 点击"Commit to main"

4. **发布到GitHub**
   - 点击"Publish repository"
   - 保持仓库为公开(Public)
   - 点击"Publish"

5. **启用GitHub Pages**
   - 打开浏览器，访问你的GitHub仓库
   - 点击"Settings" → "Pages"
   - 在"Source"中选择"Deploy from a branch"
   - 分支选择"main"，文件夹选择"/ (root)"
   - 点击"Save"
   - 等待几分钟，你的网站就上线了！

### 方法二：使用Git命令行

如果你熟悉Git，可以使用以下命令：

```bash
# 1. 进入网站目录
cd ~/.openclaw/workspace/travel-website

# 2. 初始化Git仓库
git init

# 3. 添加所有文件
git add .

# 4. 提交更改
git commit -m "Initial commit - travel website"

# 5. 在GitHub上创建新仓库（通过网页）
# 访问 https://github.com/new
# 创建名为 travel-website 的仓库（不要初始化README）

# 6. 添加远程仓库并推送
git remote add origin https://github.com/你的用户名/travel-website.git
git branch -M main
git push -u origin main

# 7. 启用GitHub Pages（通过网页）
# 访问你的仓库 → Settings → Pages
# 选择 main 分支，/ (root) 文件夹
```

## 🌐 访问你的网站

部署成功后，你的网站地址将是：
```
https://你的用户名.github.io/travel-website/
```

例如：
```
https://revivalz.github.io/travel-website/
```

## 📱 分享给朋友

### 分享方式：
1. **直接发送链接**：把上面的GitHub Pages链接发给朋友
2. **生成二维码**：使用在线工具将链接转为二维码
3. **社交媒体**：分享到微信、QQ等社交平台

### 网站功能说明：
- **浏览景点**：朋友可以直接查看你推荐的景点
- **分享新景点**：朋友也可以添加他们推荐的景点
- **筛选功能**：按标签（自然、历史、美食等）筛选景点
- **响应式设计**：手机和电脑都能完美显示

## 🔧 自定义修改

### 修改景点数据：
编辑 `data/places.json` 文件，添加或修改景点信息：

```json
{
  "id": 7,
  "name": "你的景点名称",
  "location": "地点",
  "description": "景点描述...",
  "image": "图片URL",
  "tags": ["标签1", "标签2"],
  "coordinates": {
    "lat": 纬度,
    "lng": 经度
  }
}
```

### 修改网站样式：
编辑 `style.css` 文件，可以修改：
- 颜色主题（搜索 `#00b894` 替换为你的主题色）
- 字体大小
- 布局样式

### 修改网站内容：
编辑 `index.html` 文件，可以修改：
- 网站标题
- 导航栏文字
- 页脚信息

## 💡 使用提示

### 本地测试：
在部署前，可以在本地测试网站：
1. 用浏览器直接打开 `index.html` 文件
2. 或使用本地服务器：
   ```bash
   # 使用Python启动简单服务器
   cd travel-website
   python -m http.server 8000
   # 然后在浏览器访问 http://localhost:8000
   ```

### 数据保存：
- 网站使用浏览器本地存储(LocalStorage)保存用户添加的景点
- 这意味着每个访问者看到的是他们自己添加的景点
- 如果要共享数据，需要后端支持（进阶功能）

### 图片建议：
- 使用高质量的图片（建议尺寸：800x600像素）
- 可以使用免费图库如 Unsplash、Pexels
- 确保图片URL是公开可访问的

## 🛠️ 进阶功能（可选）

如果你想让网站更强大，可以考虑：

1. **添加地图功能**：集成百度地图或高德地图API
2. **用户登录**：让不同用户管理自己的景点
3. **评论系统**：让朋友可以对景点发表评论
4. **点赞功能**：让朋友可以点赞喜欢的景点

## ❓ 常见问题

### Q: 网站部署后无法访问？
A: 等待5-10分钟，GitHub Pages需要时间构建。如果还是无法访问，检查仓库设置中的Pages配置。

### Q: 如何更新网站内容？
A: 修改文件后，使用Git提交并推送到GitHub：
```bash
git add .
git commit -m "更新内容"
git push
```

### Q: 朋友添加的景点我能看到吗？
A: 目前每个用户看到的是自己浏览器中保存的景点。如果要共享，需要开发后端功能。

### Q: 网站支持中文吗？
A: 完全支持！网站使用中文字体和中文内容。

---

## 🎉 恭喜！

你的旅游景点分享网站已经准备好了！现在就可以分享给朋友，一起记录和发现美好的旅行地点。

如果有任何问题，随时问我！