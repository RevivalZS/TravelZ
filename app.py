#!/usr/bin/env python3
"""
旅行足迹 - Flask 后端 API
启动方式: python app.py
访问地址: http://localhost:5000
"""

import os
import json
import sqlite3
import time
from datetime import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.', static_url_path='')
CORS(app)

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'travel.db')
PLACES_JSON = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'data', 'places.json')


def get_db():
    """获取数据库连接"""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn


def init_db():
    """初始化数据库，导入 places.json 中的默认数据"""
    os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
    conn = get_db()
    cursor = conn.cursor()

    # 建表
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS places (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            description TEXT NOT NULL,
            image TEXT DEFAULT '',
            tags TEXT DEFAULT '[]',
            lat REAL DEFAULT 0,
            lng REAL DEFAULT 0,
            created_at TEXT DEFAULT (datetime('now', 'localtime'))
        )
    ''')

    # 如果表是空的，从 places.json 导入初始数据
    cursor.execute('SELECT COUNT(*) FROM places')
    if cursor.fetchone()[0] == 0:
        try:
            with open(PLACES_JSON, 'r', encoding='utf-8') as f:
                data = json.load(f)
            for p in data.get('places', []):
                coords = p.get('coordinates', {})
                cursor.execute('''
                    INSERT INTO places (id, name, location, description, image, tags, lat, lng)
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
                ''', (
                    p['id'],
                    p['name'],
                    p['location'],
                    p['description'],
                    p.get('image', ''),
                    json.dumps(p.get('tags', []), ensure_ascii=False),
                    coords.get('lat', 0),
                    coords.get('lng', 0)
                ))
            print(f"✅ 已从 places.json 导入 {len(data.get('places', []))} 条景点数据")
        except FileNotFoundError:
            print("⚠️  places.json 未找到，数据库为空")

    conn.commit()
    conn.close()


# ─── API 路由 ───────────────────────────────────────────────

@app.route('/')
def index():
    """服务前端首页"""
    return send_from_directory('.', 'index.html')


@app.route('/<path:filename>')
def static_files(filename):
    """服务静态文件 (css, js, images 等)"""
    return send_from_directory('.', filename)


@app.route('/api/places', methods=['GET'])
def get_places():
    """获取所有景点，支持标签筛选"""
    tag = request.args.get('tag', '')
    conn = get_db()
    cursor = conn.cursor()

    if tag and tag != 'all':
        # SQLite JSON 查询：tags 列包含指定标签
        cursor.execute("SELECT * FROM places ORDER BY id DESC")
        rows = cursor.fetchall()
        places = []
        for row in rows:
            place = dict(row)
            place['tags'] = json.loads(place['tags'])
            if tag in place['tags']:
                places.append(place)
    else:
        cursor.execute("SELECT * FROM places ORDER BY id DESC")
        rows = cursor.fetchall()
        places = []
        for row in rows:
            place = dict(row)
            place['tags'] = json.loads(place['tags'])
            places.append(place)

    conn.close()
    return jsonify({'places': places})


@app.route('/api/places/<int:place_id>', methods=['GET'])
def get_place(place_id):
    """获取单个景点详情"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM places WHERE id = ?", (place_id,))
    row = cursor.fetchone()
    conn.close()

    if row is None:
        return jsonify({'error': '景点不存在'}), 404

    place = dict(row)
    place['tags'] = json.loads(place['tags'])
    return jsonify(place)


@app.route('/api/places', methods=['POST'])
def create_place():
    """创建新景点"""
    data = request.get_json()
    if not data:
        return jsonify({'error': '请提供 JSON 数据'}), 400

    # 必填字段验证
    required = ['name', 'location', 'description']
    for field in required:
        if not data.get(field, '').strip():
            return jsonify({'error': f'请填写 {field}'}), 400

    tags = data.get('tags', [])
    if isinstance(tags, str):
        try:
            tags = json.loads(tags)
        except json.JSONDecodeError:
            tags = [tags]

    if not tags:
        return jsonify({'error': '请至少选择一个标签'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO places (name, location, description, image, tags, lat, lng)
        VALUES (?, ?, ?, ?, ?, ?, ?)
    ''', (
        data['name'].strip(),
        data['location'].strip(),
        data['description'].strip(),
        data.get('image', '').strip(),
        json.dumps(tags, ensure_ascii=False),
        float(data.get('lat', 0)),
        float(data.get('lng', 0))
    ))
    conn.commit()
    new_id = cursor.lastrowid
    conn.close()

    return jsonify({'id': new_id, 'message': '景点创建成功'}), 201


@app.route('/api/places/<int:place_id>', methods=['PUT'])
def update_place(place_id):
    """更新景点信息"""
    data = request.get_json()
    if not data:
        return jsonify({'error': '请提供 JSON 数据'}), 400

    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM places WHERE id = ?", (place_id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({'error': '景点不存在'}), 404

    tags = data.get('tags')
    if tags and isinstance(tags, str):
        try:
            tags = json.loads(tags)
        except json.JSONDecodeError:
            tags = [tags]

    cursor.execute('''
        UPDATE places SET
            name = COALESCE(?, name),
            location = COALESCE(?, location),
            description = COALESCE(?, description),
            image = COALESCE(?, image),
            tags = COALESCE(?, tags),
            lat = COALESCE(?, lat),
            lng = COALESCE(?, lng)
        WHERE id = ?
    ''', (
        data.get('name'),
        data.get('location'),
        data.get('description'),
        data.get('image'),
        json.dumps(tags, ensure_ascii=False) if tags else None,
        data.get('lat'),
        data.get('lng'),
        place_id
    ))
    conn.commit()
    conn.close()

    return jsonify({'message': '更新成功'})


@app.route('/api/places/<int:place_id>', methods=['DELETE'])
def delete_place(place_id):
    """删除景点"""
    conn = get_db()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM places WHERE id = ?", (place_id,))
    if cursor.fetchone() is None:
        conn.close()
        return jsonify({'error': '景点不存在'}), 404

    cursor.execute("DELETE FROM places WHERE id = ?", (place_id,))
    conn.commit()
    conn.close()

    return jsonify({'message': '删除成功'})


# ─── 启动 ───────────────────────────────────────────────────

if __name__ == '__main__':
    print("=" * 50)
    print("🗺️  旅行足迹 - 后端服务")
    print("=" * 50)
    init_db()
    print(f"📁 数据库: {DB_PATH}")
    print(f"🌐 访问: http://localhost:5000")
    print("=" * 50)
    app.run(host='0.0.0.0', port=5000, debug=True)
