#!/usr/bin/env python3
"""
启用GitHub Pages的脚本
由于GitHub API需要权限，这里提供手动操作指南
"""

import json
import os
from datetime import datetime

def create_pages_config():
    """创建GitHub Pages配置指南"""
    
    config = {
        "timestamp": datetime.now().isoformat(),
        "repository": "RevivalZS/revival",
        "website_url": "https://revivalzs.github.io/revival/",
        "pages_settings_url": "https://github.com/RevivalZS/revival/settings/pages",
        "repository_url": "https://github.com/RevivalZS/revival",
        "steps": [
            {
                "step": 1,
                "title": "访问Pages设置页面",
                "description": "打开GitHub仓库的Pages设置",
                "url": "https://github.com/RevivalZS/revival/settings/pages",
                "action": "点击链接或复制URL到浏览器"
            },
            {
                "step": 2,
                "title": "配置部署源",
                "description": "选择从分支部署",
                "details": "在'Source'部分选择 'Deploy from a branch'"
            },
            {
                "step": 3,
                "title": "选择分支和文件夹",
                "description": "配置部署的具体设置",
                "details": "Branch: 选择 'main'\nFolder: 选择 '/ (root)'"
            },
            {
                "step": 4,
                "title": "保存设置",
                "description": "启用GitHub Pages",
                "details": "点击 'Save' 按钮"
            },
            {
                "step": 5,
                "title": "等待部署",
                "description": "GitHub会自动部署你的网站",
                "details": "等待1-2分钟，状态会显示绿色勾勾"
            },
            {
                "step": 6,
                "title": "访问网站",
                "description": "测试你的网站",
                "url": "https://revivalzs.github.io/revival/",
                "action": "点击链接测试网站功能"
            }
        ],
        "verification": [
            "主页加载正常",
            "6个景点卡片显示",
            "筛选功能工作正常",
            "可以添加新景点",
            "响应式设计正常"
        ],
        "troubleshooting": {
            "pages_not_showing": "等待5分钟，刷新页面",
            "404_error": "确认Pages已启用，分支选择正确",
            "css_not_loading": "检查文件路径，清除浏览器缓存"
        }
    }
    
    # 保存配置
    with open("pages_config.json", "w", encoding="utf-8") as f:
        json.dump(config, f, indent=2, ensure_ascii=False)
    
    # 创建HTML指南
    create_html_guide(config)
    
    # 创建文本指南
    create_text_guide(config)
    
    return config

def create_html_guide(config):
    """创建HTML格式的指南"""
    
    html = f"""<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>启用GitHub Pages指南</title>
    <style>
        body {{
            font-family: 'Segoe UI', sans-serif;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            background: #f5f7fa;
        }}
        
        .header {{
            background: linear-gradient(135deg, #00b894, #00a085);
            color: white;
            padding: 30px;
            border-radius: 15px;
            text-align: center;
            margin-bottom: 30px;
        }}
        
        .step {{
            background: white;
            border-radius: 10px;
            padding: 20px;
            margin-bottom: 20px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.1);
            border-left: 4px solid #00b894;
        }}
        
        .step-number {{
            display: inline-block;
            background: #00b894;
            color: white;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            text-align: center;
            line-height: 30px;
            margin-right: 10px;
            font-weight: bold;
        }}
        
        .action-button {{
            display: inline-block;
            background: #00b894;
            color: white;
            padding: 10px 20px;
            border-radius: 25px;
            text-decoration: none;
            margin: 10px 5px;
            transition: all 0.3s;
        }}
        
        .action-button:hover {{
            background: #00a085;
            transform: translateY(-2px);
        }}
        
        .info-box {{
            background: #e8f5e9;
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
        }}
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 启用GitHub Pages</h1>
        <p>最后一步，让你的网站上线！</p>
    </div>
    
    <div class="info-box">
        <h3>📊 部署信息</h3>
        <p><strong>仓库：</strong>{config['repository']}</p>
        <p><strong>网站：</strong>{config['website_url']}</p>
        <p><strong>时间：</strong>{config['timestamp']}</p>
    </div>
    
    <h2>📋 启用步骤</h2>
    """
    
    for step in config['steps']:
        html += f"""
    <div class="step">
        <div class="step-number">{step['step']}</div>
        <h3>{step['title']}</h3>
        <p>{step['description']}</p>
        """
        
        if 'details' in step:
            html += f"<pre style='background: #f8f9fa; padding: 10px; border-radius: 5px;'>{step['details']}</pre>"
        
        if 'url' in step:
            html += f'<a href="{step["url"]}" target="_blank" class="action-button">点击前往</a>'
        
        if 'action' in step:
            html += f'<p><em>{step["action"]}</em></p>'
        
        html += "</div>"
    
    html += f"""
    <div class="info-box">
        <h3>✅ 验证清单</h3>
        <ul>
    """
    
    for item in config['verification']:
        html += f"<li>{item}</li>"
    
    html += """
        </ul>
    </div>
    
    <div style="text-align: center; margin-top: 40px;">
        <a href="https://revivalzs.github.io/revival/" target="_blank" class="action-button" style="font-size: 1.2em;">
            🌐 访问我的网站
        </a>
        <a href="https://github.com/RevivalZS/revival" target="_blank" class="action-button">
            📁 查看GitHub仓库
        </a>
    </div>
    
    <div style="margin-top: 40px; text-align: center; color: #666; font-size: 0.9em;">
        <p>由爪爪 🤝 创建 | {config['timestamp']}</p>
    </div>
</body>
</html>
"""
    
    with open("enable_pages_guide.html", "w", encoding="utf-8") as f:
        f.write(html)
    
    print("✅ HTML指南已创建: enable_pages_guide.html")

def create_text_guide(config):
    """创建文本格式的指南"""
    
    text = f"""========================================
启用GitHub Pages指南
========================================

📅 时间: {config['timestamp']}
📁 仓库: {config['repository']}
🌐 网站: {config['website_url']}

🚀 启用步骤:
"""

    for step in config['steps']:
        text += f"\n{step['step']}. {step['title']}"
        text += f"\n   {step['description']}"
        if 'details' in step:
            text += f"\n   {step['details'].replace('\\n', '\\n   ')}"
        if 'url' in step:
            text += f"\n   URL: {step['url']}"
        text += "\n"

    text += """
✅ 验证清单:
"""

    for item in config['verification']:
        text += f"  • {item}\n"

    text += f"""
🔧 故障排除:
  • 页面不显示: 等待5分钟，刷新页面
  • 404错误: 确认Pages已启用，分支选择正确
  • CSS不加载: 检查文件路径，清除浏览器缓存

🎯 立即操作:
  1. 访问: {config['pages_settings_url']}
  2. 配置: Source → Deploy from a branch
  3. 选择: Branch: main, Folder: / (root)
  4. 点击: Save
  5. 等待: 1-2分钟
  6. 访问: {config['website_url']}

💡 提示: 启用后，你的网站将永久在线！
"""

    with open("enable_pages_guide.txt", "w", encoding="utf-8") as f:
        f.write(text)
    
    print("✅ 文本指南已创建: enable_pages_guide.txt")

def main():
    print("=" * 50)
    print("创建GitHub Pages启用指南")
    print("=" * 50)
    
    config = create_pages_config()
    
    print(f"\n✅ 指南创建完成！")
    print(f"\n📁 生成的文件:")
    print(f"  • pages_config.json - 配置信息")
    print(f"  • enable_pages_guide.html - HTML指南")
    print(f"  • enable_pages_guide.txt - 文本指南")
    
    print(f"\n🚀 立即操作:")
    print(f"  1. 访问: {config['pages_settings_url']}")
    print(f"  2. 按照指南启用GitHub Pages")
    print(f"  3. 访问: {config['website_url']}")
    
    print(f"\n" + "=" * 50)

if __name__ == "__main__":
    main()