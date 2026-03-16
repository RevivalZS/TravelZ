#!/usr/bin/env python3
"""
简单的HTTP服务器用于测试旅游网站
"""
import http.server
import socketserver
import webbrowser
import os
import threading
import time

PORT = 8080
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def log_message(self, format, *args):
        # 减少日志输出
        pass

def start_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"✅ 服务器启动在 http://localhost:{PORT}")
        print(f"📁 服务目录: {DIRECTORY}")
        print("🔄 按 Ctrl+C 停止服务器")
        print("🌐 正在打开浏览器...")
        
        # 在后台线程中打开浏览器
        def open_browser():
            time.sleep(1)
            webbrowser.open(f"http://localhost:{PORT}")
        
        threading.Thread(target=open_browser, daemon=True).start()
        
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\n👋 服务器已停止")

if __name__ == "__main__":
    print("🚀 启动旅游网站测试服务器")
    print("=" * 50)
    start_server()