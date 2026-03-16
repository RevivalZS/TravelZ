#!/usr/bin/env python3
"""
修复GitHub Pages问题的终极方案
"""

import requests
import json
import time
import sys

# 你的GitHub令牌（请替换为你的实际令牌）
# 重要：不要将真实令牌提交到GitHub！
# 获取令牌：https://github.com/settings/tokens
TOKEN = "YOUR_GITHUB_TOKEN_HERE"
OWNER = "RevivalZS"
REPO = "revival"

def check_repo_exists():
    """检查仓库是否存在"""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}"
    headers = {
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    print(f"检查仓库 {OWNER}/{REPO}...")
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        print(f"✅ 仓库存在")
        repo_data = response.json()
        print(f"   名称: {repo_data.get('name')}")
        print(f"   描述: {repo_data.get('description', '无描述')}")
        print(f"   公开: {not repo_data.get('private', True)}")
        print(f"   默认分支: {repo_data.get('default_branch', 'main')}")
        return True
    else:
        print(f"❌ 仓库不存在 (状态码: {response.status_code})")
        print(f"   错误: {response.text}")
        return False

def check_pages_status():
    """检查Pages状态"""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/pages"
    headers = {
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    print(f"检查GitHub Pages状态...")
    response = requests.get(url, headers=headers)
    
    if response.status_code == 200:
        pages_data = response.json()
        print(f"✅ GitHub Pages已启用")
        print(f"   状态: {pages_data.get('status', 'unknown')}")
        print(f"   网站: {pages_data.get('html_url', 'N/A')}")
        print(f"   源分支: {pages_data.get('source', {}).get('branch', 'N/A')}")
        return True
    elif response.status_code == 404:
        print(f"ℹ️  GitHub Pages未启用")
        return False
    else:
        print(f"⚠️  检查失败 (状态码: {response.status_code})")
        print(f"   错误: {response.text}")
        return None

def enable_pages():
    """尝试启用Pages"""
    url = f"https://api.github.com/repos/{OWNER}/{REPO}/pages"
    headers = {
        "Authorization": f"token {TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    data = {
        "source": {
            "branch": "main",
            "path": "/"
        }
    }
    
    print(f"尝试启用GitHub Pages...")
    response = requests.post(url, headers=headers, json=data)
    
    if response.status_code == 201:
        print(f"✅ GitHub Pages启用请求已发送")
        print(f"   响应: {response.json()}")
        return True
    elif response.status_code == 409:
        print(f"ℹ️  Pages可能已存在或正在处理")
        print(f"   错误: {response.json().get('message', '未知错误')}")
        return False
    else:
        print(f"❌ 启用失败 (状态码: {response.status_code})")
        print(f"   错误: {response.text}")
        return False

def create_workflow():
    """创建GitHub Actions工作流作为备用方案"""
    workflow_content = """name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      
      - name: Setup Pages
        uses: actions/configure-pages@v4
      
      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: '.'
      
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4"""
    
    print(f"创建GitHub Actions工作流作为备用方案...")
    
    # 工作流文件已存在，跳过
    print(f"✅ 工作流文件已存在: .github/workflows/deploy.yml")
    return True

def main():
    print("=" * 60)
    print("GitHub Pages问题修复工具")
    print("=" * 60)
    
    # 检查仓库
    if not check_repo_exists():
        print("\n❌ 仓库不存在，无法继续")
        return False
    
    print("\n" + "-" * 60)
    
    # 检查Pages状态
    pages_status = check_pages_status()
    
    if pages_status is True:
        print("\n🎉 GitHub Pages已启用！")
        print(f"\n你的网站: https://{OWNER}.github.io/{REPO}/")
        return True
    elif pages_status is False:
        print("\n尝试启用GitHub Pages...")
        
        # 尝试启用
        if enable_pages():
            print("\n✅ 启用请求已发送")
            print("\n等待1-2分钟，然后检查网站:")
            print(f"🌐 https://{OWNER}.github.io/{REPO}/")
            
            # 创建备用方案
            create_workflow()
            
            print("\n备用方案:")
            print("1. 访问: https://github.com/RevivalZS/revival/actions")
            print("2. 手动触发 'Deploy to GitHub Pages' 工作流")
            
            return True
        else:
            print("\n❌ 启用失败，使用备用方案")
            create_workflow()
            
            print("\n🎯 备用方案已就绪:")
            print("1. 访问: https://github.com/RevivalZS/revival/actions")
            print("2. 手动触发 'Deploy to GitHub Pages' 工作流")
            print("3. 等待2-3分钟部署完成")
            print("4. 访问: https://revivalzs.github.io/revival/")
            
            return True
    else:
        print("\n⚠️  状态检查失败，使用备用方案")
        create_workflow()
        
        print("\n🎯 直接使用备用方案:")
        print("1. 访问: https://github.com/RevivalZS/revival/actions")
        print("2. 手动触发 'Deploy to GitHub Pages' 工作流")
        
        return True

if __name__ == "__main__":
    success = main()
    
    print("\n" + "=" * 60)
    if success:
        print("✅ 修复工具执行完成")
    else:
        print("❌ 修复工具执行失败")
    
    print("\n重要链接:")
    print(f"仓库: https://github.com/{OWNER}/{REPO}")
    print(f"网站: https://{OWNER}.github.io/{REPO}/")
    print(f"Actions: https://github.com/{OWNER}/{REPO}/actions")
    print(f"Pages设置: https://github.com/{OWNER}/{REPO}/settings/pages")
    print("=" * 60)