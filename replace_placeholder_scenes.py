#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
已弃用：请使用 build_js_all.py

build_js_all.py 会：
- 从 文本/谜题-*.txt、支线、补充2 等解析「场景ID / 选项 / 获得线索」
- 写入 js/game-scenes.js 中「// --- 自动生成的」区块
- 允许扩展文本覆盖手写区同名场景（枢纽场景见 PROTECTED_IDS）
- 主线2 仅补充尚未由谜题生成的场景 ID，避免短剧本覆盖完整谜题
- 将占位选项「--」规范为「返回大厅」，并自动补全缺少的出口

运行：python build_js_all.py
"""
import subprocess
import sys
from pathlib import Path

if __name__ == "__main__":
    root = Path(__file__).resolve().parent
    script = root / "build_js_all.py"
    sys.exit(subprocess.call([sys.executable, str(script)], cwd=str(root)))
