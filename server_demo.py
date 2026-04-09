from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)

SAVE_DIR = "saves"
if not os.path.exists(SAVE_DIR):
    os.makedirs(SAVE_DIR)

@app.route("/api/game/scenes", methods=["GET"])
def get_scenes_dsl():
    return jsonify({
        "title": {
            "desc": "<h1>【云端热更新验证】</h1><p>您已成功连接服务器！</p>",
            "options": [{"text": "进入游戏", "target": "opening_studio"}]
        }
    })

@app.route("/api/user/save", methods=["POST"])
def sync_save_data():
    auth = request.headers.get("Authorization")
    if not auth:
        return jsonify({"error": "Unauthorized"}), 401
    
    token = auth.split(" ")[1]
    # In production, use database and valid Token decoding
    path = os.path.join(SAVE_DIR, f"{token}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(request.json, f, ensure_ascii=False)
        
    return jsonify({"status": "success"})

@app.route("/api/user/save", methods=["GET"])
def fetch_save_data():
    auth = request.headers.get("Authorization")
    if not auth:
        return jsonify({"error": "Unauthorized"}), 401
        
    token = auth.split(" ")[1]
    path = os.path.join(SAVE_DIR, f"{token}.json")
    if os.path.exists(path):
        with open(path, "r", encoding="utf-8") as f:
            return jsonify(json.load(f))
    return jsonify({}), 404

if __name__ == "__main__":
    app.run(port=8000, debug=True)
