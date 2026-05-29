# 🚀 TravelZ 部署指南

## 部署架构
- **前端**：GitHub Pages（已部署）
- **后端**：Railway.app（免费额度）

---

## 第一步：部署后端到 Railway

### 1. 注册 Railway 账号
访问 https://railway.app 用 GitHub 账号登录

### 2. 创建新项目
1. 点击 "New Project"
2. 选择 "Deploy from GitHub repo"
3. 选择你的 `TravelZ` 仓库
4. Railway 会自动检测到 `Procfile` 并部署

### 3. 获取后端地址
部署完成后：
1. 点击项目 → Settings → Networking
2. 点击 "Generate Domain"
3. 复制生成的地址（如 `https://travelz-backend.up.railway.app`）

### 4. 修改前端配置
编辑 `script.js` 第7行，把地址改成你的 Railway 地址：
```javascript
: 'https://travelz-backend.up.railway.app';  // ← 改成你的地址
```

### 5. 推送更新到 GitHub
```bash
git add .
git commit -m "feat: 配置线上后端地址"
git push
```

GitHub Pages 会自动更新。

---

## 第二步：测试

1. 访问你的 GitHub Pages 地址
2. 尝试浏览景点列表
3. 尝试提交一个新景点

---

## 常见问题

### Q: 提交数据后页面刷新但看不到新数据？
A: Railway 免费版会休眠，首次请求需要等待 10-30 秒唤醒。

### Q: 部署失败？
A: 检查 Railway 的 Deploy Logs，常见问题是依赖安装失败。

### Q: 如何查看后端日志？
A: Railway 项目 → Deployments → 点击最新的部署 → View Logs

---

## 本地开发

```bash
# 安装依赖
pip install -r requirements.txt

# 启动后端
python app.py

# 访问 http://localhost:5000
```

---

## 文件说明

```
TravelZ/
├── index.html          # 前端页面
├── script.js           # 前端脚本（包含 API 配置）
├── style.css           # 样式
├── app.py              # Flask 后端
├── requirements.txt    # Python 依赖
├── Procfile            # Railway 部署配置
├── .gitignore          # Git 忽略规则
└── data/
    └── places.json     # 初始数据
```
