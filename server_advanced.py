from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import sqlite3
import jwt
import datetime
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)
CORS(app)

SECRET_KEY = "enigmatic_manor_super_secret"
SAVE_DIR = "saves"
DB_FILE = "users.db"

if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

# 初始化数据库
def init_db():
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    username TEXT UNIQUE NOT NULL,
                    password_hash TEXT NOT NULL
                 )''')
    conn.commit()
    conn.close()

init_db()

# 工具函数：生成和解密 Token
def generate_token(username):
    payload = {
        'exp': datetime.datetime.utcnow() + datetime.timedelta(days=7),
        'iat': datetime.datetime.utcnow(),
        'sub': username
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

# ================= 认证接口 =================
@app.route("/api/user/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    if not username or not password:
        return jsonify({"error": "缺失用户名或密码"}), 400
        
    try:
        conn = sqlite3.connect(DB_FILE)
        c = conn.cursor()
        pwd_hash = generate_password_hash(password)
        c.execute("INSERT INTO users (username, password_hash) VALUES (?, ?)", (username, pwd_hash))
        conn.commit()
        conn.close()
        return jsonify({"message": "注册成功，请使用新账号登录"})
    except sqlite3.IntegrityError:
        return jsonify({"error": "用户名已存在，请换一个"}), 409

@app.route("/api/user/login", methods=["POST"])
def login():
    data = request.json
    username = data.get("username")
    password = data.get("password")
    
    conn = sqlite3.connect(DB_FILE)
    c = conn.cursor()
    c.execute("SELECT password_hash FROM users WHERE username=?", (username,))
    row = c.fetchone()
    conn.close()
    
    if row and check_password_hash(row[0], password):
        token = generate_token(username)
        return jsonify({"token": token, "username": username, "message": "登录成功"})
    else:
        return jsonify({"error": "账号或密码错误"}), 401


# ================= 游戏数据接口 =================
def get_user_from_request():
    auth = request.headers.get("Authorization")
    if not auth:
        return None
    token = auth.split(" ")[1]
    return verify_token(token)

@app.route("/api/game/scenes", methods=["GET"])
def get_scenes_dsl():
    user = get_user_from_request()
    welcome_text = f"<h1>【专属云端档案】</h1><p>欢迎回来，侦探 {user}。</p>" if user else "<h1>【离线游玩】</h1><p>尚未登录云端。</p>"
    
    return jsonify({
        "title": {
            "desc": welcome_text + "<br><p>系统已连接至远端情报库。</p>",
            "options": [{"text": "推开大门，进入庄园", "target": "opening_studio"}]
        }
    })

@app.route("/api/user/save", methods=["POST"])
def sync_save_data():
    username = get_user_from_request()
    if not username:
        return jsonify({"error": "Token 无效或过期"}), 401
    
    # 用解析后的可靠 username 当做文件名
    path = os.path.join(SAVE_DIR, f"{username}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(request.json, f, ensure_ascii=False)
        
    return jsonify({"status": "success"})

@app.route("/api/user/save", methods=["GET"])
def fetch_save_data():
    username = get_user_from_request()
    if not username:
        return jsonify({"error": "Token 无效或过期"}), 401
        
    path = os.path.join(SAVE_DIR, f"{username}.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return jsonify(json.load(f))
    return jsonify({}), 404

if __name__ == "__main__":
    print(">>> 【庄园核心库】后备管理服务器已点火")
    app.run(port=8000, debug=True)
