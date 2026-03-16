#!/usr/bin/env python3
"""
尝试通过GitHub API启用GitHub Pages
"""

import requests
import json
import base64

# 你的GitHub访问令牌（请替换为你的实际令牌）
# 重要：不要将真实令牌提交到GitHub！
# 获取令牌：https://github.com/settings/tokens
GITHUB_TOKEN = "YOUR_GITHUB_TOKEN_HERE"
REPO_OWNER = "RevivalZS"
REPO_NAME = "revival"

def enable_github_pages():
    """尝试启用GitHub Pages"""
    
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}/pages"
    
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json",
        "Content-Type": "application/json"
    }
    
    # GitHub Pages配置
    data = {
        "source": {
            "branch": "main",
            "path": "/"
        }
    }
    
    print(f"尝试启用GitHub Pages...")
    print(f"仓库: {REPO_OWNER}/{REPO_NAME}")
    print(f"配置: {json.dumps(data, indent=2)}")
    
    try:
        # 首先检查当前状态
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            print(f"✅ GitHub Pages状态: {response.json().get('status', 'unknown')}")
            print(f"   网站地址: {response.json().get('html_url', 'N/A')}")
            return True
        elif response.status_code == 404:
            print("ℹ️  GitHub Pages未启用，尝试启用...")
            
            # 尝试启用Pages
            response = requests.post(url, headers=headers, json=data)
            
            if response.status_code == 201:
                print("✅ GitHub Pages启用请求已发送！")
                print(f"   响应: {response.json()}")
                return True
            else:
                print(f"❌ 启用失败 (状态码: {response.status_code})")
                print(f"   错误: {response.text}")
                return False
        else:
            print(f"❌ 检查状态失败 (状态码: {response.status_code})")
            print(f"   错误: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 请求异常: {e}")
        return False

def check_repository():
    """检查仓库是否存在"""
    
    url = f"https://api.github.com/repos/{REPO_OWNER}/{REPO_NAME}"
    
    headers = {
        "Authorization": f"token {GITHUB_TOKEN}",
        "Accept": "application/vnd.github.v3+json"
    }
    
    print(f"检查仓库 {REPO_OWNER}/{REPO_NAME}...")
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            repo_info = response.json()
            print(f"✅ 仓库存在！")
            print(f"   名称: {repo_info.get('name')}")
            print(f"   描述: {repo_info.get('description', '无描述')}")
            print(f"   公开: {repo_info.get('private', True) == False}")
            print(f"   URL: {repo_info.get('html_url')}")
            return True
        elif response.status_code == 404:
            print("❌ 仓库不存在！")
            print("   请先创建仓库: https://github.com/new")
            print("   名称: revival")
            print("   公开仓库")
            print("   不要初始化README等文件")
            return False
        else:
            print(f"❌ 检查失败 (状态码: {response.status_code})")
            print(f"   错误: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 请求异常: {e}")
        return False

def check_deployment_status():
    """检查部署状态"""
    
    print("\n" + "="*50)
    print("部署状态检查")
    print("="*50)
    
    # 检查仓库
    if not check_repository():
        print("\n❌ 仓库检查失败，无法继续")
        return False
    
    print("\n" + "="*50)
    print("尝试启用GitHub Pages")
    print("="*50)
    
    # 尝试启用Pages
    if enable_github_pages():
        print("\n✅ 操作完成！")
        print("\n下一步:")
        print("1. 等待1-2分钟让GitHub部署")
        print("2. 访问: https://revivalzs.github.io/revival/")
        print("3. 测试网站功能")
        return True
    else:
        print("\n❌ 启用GitHub Pages失败")
        print("\n手动操作步骤:")
        print("1. 访问: https://github.com/RevivalZS/revival/settings/pages")
        print("2. 配置:")
        print("   - Source: Deploy from a branch")
        print("   - Branch: main")
        print("   - Folder: / (root)")
        print("3. 点击 Save")
        print("4. 等待1-2分钟")
        print("5. 访问: https://revivalzs.github.io/revival/")
        return False

def main():
    print("="*50)
    print("GitHub Pages启用工具")
    print("="*50)
    
    # 注意：GitHub API对Pages操作有权限限制
    # 通常需要仓库管理员权限或OAuth授权
    print("注意: GitHub API对Pages操作可能需要特殊权限")
    print("如果API失败，请按照手动步骤操作")
    print("="*50)
    
    success = check_deployment_status()
    
    if success:
        print("\n" + "="*50)
        print("🎉 操作成功！")
        print("="*50)
        print("\n你的网站即将上线:")
        print("🌐 https://revivalzs.github.io/revival/")
    else:
        print("\n" + "="*50)
        print("⚠️  需要手动操作")
        print("="*50)
        print("\n请按照上面的手动步骤操作")

if __name__ == "__main__":
    main()