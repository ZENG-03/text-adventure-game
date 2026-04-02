#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Intelligently match and replace placeholder scenes with real content from text files
"""

import os
import re
from pathlib import Path
from difflib import SequenceMatcher

SCENES_FILE = r'F:\PYTHON  ZUOYE\文字冒险-解谜\js\game-scenes.js'
TEXT_DIR = r'F:\PYTHON  ZUOYE\文字冒险-解谜\文本'

def get_placeholder_scenes():
    """Get list of placeholder scene IDs."""
    with open(SCENES_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    scene_pattern = r'scenes\["([^"]+)"\]\s*=\s*\{(.*?)\};'
    placeholders = {}
    
    for match in re.finditer(scene_pattern, content, re.DOTALL):
        scene_id = match.group(1)
        scene_code = match.group(2)
        if '该剧情节点' in scene_code and '尚在整理中' in scene_code:
            placeholders[scene_id] = match.group(0)
    
    return placeholders

def parse_text_files():
    """Parse text files and extract real scene definitions."""
    scenes = {}
    text_files = Path(TEXT_DIR).glob('*.txt')
    
    for text_file in sorted(text_files):
        with open(text_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Find all scene definitions
        scene_pattern = r'场景ID:\s*([a-zA-Z0-9_]+)\s*(.*?)(?=(?:场景ID:|---|\Z))'
        
        for match in re.finditer(scene_pattern, content, re.DOTALL):
            scene_id = match.group(1).strip()
            scene_content = match.group(2).strip()
            
            # Extract description
            desc_match = re.search(r'^(.*?)(?:\*?\*选项:\*?\*|选项:)', scene_content, re.DOTALL)
            if desc_match:
                description = desc_match.group(1).strip()
            else:
                description = scene_content[:300].strip()
            
            # Clean description
            description = re.sub(r'\*+', '', description)
            description = re.sub(r'\n+', ' ', description)
            description = re.sub(r'\s+', ' ', description)
            description = description[:800]
            
            # Extract options
            options = []
            option_pattern = r'-\s*([^[\]]+)\s*\[前往\s*([a-zA-Z0-9_]+)\]'
            
            for opt_match in re.finditer(option_pattern, scene_content):
                opt_text = opt_match.group(1).strip()
                opt_target = opt_match.group(2).strip()
                options.append({
                    'text': opt_text,
                    'target': opt_target
                })
            
            if description or options:
                scenes[scene_id] = {
                    'desc': description,
                    'options': options,
                    'source_file': text_file.name
                }
    
    return scenes

def similarity(a, b):
    """Calculate similarity between two strings (0-1)."""
    return SequenceMatcher(None, a, b).ratio()

def find_most_similar_scene(placeholder_id, all_scenes):
    """Find the most similar real scene for a placeholder."""
    best_match = None
    best_score = 0.3  # Minimum threshold
    
    for scene_id in all_scenes:
        score = similarity(placeholder_id, scene_id)
        if score > best_score:
            best_score = score
            best_match = scene_id
    
    return best_match

def generate_scene_js(scene_id, scene_data):
    """Generate JavaScript code for a scene definition."""
    # Clean and escape description
    desc = scene_data['desc']
    desc = desc.replace('\\', '\\\\')  # Escape backslashes first
    desc = desc.replace('`', '\\`')    # Escape backticks
    desc = re.sub(r'\n+', ' ', desc)   # Replace newlines with spaces
    desc = desc.strip()
    
    options_js = []
    for opt in scene_data['options']:
        text = opt['text']
        text = text.replace('\\', '\\\\')
        text = text.replace('`', '\\`')
        text = text.replace('"', '\\"')
        text = re.sub(r'\n+', ' ', text)
        target = opt['target']
        options_js.append(f'        {{ text: "{text}", target: "{target}" }}')
    
    if not options_js:
        options_js.append('        { text: "返回大厅", target: "hall_main" }')
        options_js.append('        { text: "返回主界面", target: "title" }')
    
    options_str = ',\n'.join(options_js)
    
    code = f'''scenes["{scene_id}"] = {{
    desc: `{desc}`,
    options: [
{options_str}
    ]
}};'''
    return code

def main():
    print("=" * 60)
    print("ENHANCED: 用文本内容替换占位场景")
    print("=" * 60)
    
    # Parse text files
    print("\n[1/4] 正在解析文本文件...")
    all_scenes = parse_text_files()
    print(f"[OK] 共提取 {len(all_scenes)} 个真实场景\n")
    
    # Get placeholders
    print("[2/4] 正在加载占位场景...")
    placeholders = get_placeholder_scenes()
    print(f"[OK] 共找到 {len(placeholders)} 个占位场景\n")
    
    # Read current file
    with open(SCENES_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace placeholders
    print("[3/4] 正在替换占位场景...")
    replacements = 0
    
    # Group placeholders by prefix to find patterns
    for placeholder_id in sorted(placeholders.keys()):
        # Try to find the best matching real scene
        best_match = find_most_similar_scene(placeholder_id, all_scenes)
        
        if best_match:
            # Generate new scene code with the placeholder ID but real content
            real_scene_data = all_scenes[best_match]
            new_code = generate_scene_js(placeholder_id, real_scene_data)
            old_code = placeholders[placeholder_id]
            
            if content.count(old_code) == 1:
                content = content.replace(old_code, new_code)
                replacements += 1
                print(f"[OK] {placeholder_id} <- {best_match} (similarity: {similarity(placeholder_id, best_match):.2f})")
    
    print(f"\n[OK] 成功替换: {replacements} 个\n")
    
    # Save
    print("[4/4] 正在保存文件...")
    with open(SCENES_FILE, 'w', encoding='utf-8') as f:
        f.write(content)
    print("[OK] 文件已保存!\n")
    
    print("=" * 60)
    print(f"替换完成!")
    print(f"  替换数量: {replacements}")
    print(f"请在游戏中验证更新。")
    print("=" * 60)

if __name__ == '__main__':
    main()
