#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
List placeholder scenes and extracted scenes
"""

import os
import re
from pathlib import Path

SCENES_FILE = r'F:\PYTHON  ZUOYE\文字冒险-解谜\js\game-scenes.js'
TEXT_DIR = r'F:\PYTHON  ZUOYE\文字冒险-解谜\文本'

def get_placeholder_scenes():
    """Get list of placeholder scene IDs."""
    with open(SCENES_FILE, 'r', encoding='utf-8') as f:
        content = f.read()
    
    scene_pattern = r'scenes\["([^"]+)"\]\s*=\s*\{(.*?)\};'
    placeholders = []
    
    for match in re.finditer(scene_pattern, content, re.DOTALL):
        scene_id = match.group(1)
        scene_code = match.group(2)
        if '该剧情节点' in scene_code and '尚在整理中' in scene_code:
            placeholders.append(scene_id)
    
    return sorted(placeholders)

def get_extracted_scenes():
    """Get list of extracted scene IDs from text files."""
    scenes = set()
    text_files = Path(TEXT_DIR).glob('*.txt')
    
    for text_file in sorted(text_files):
        with open(text_file, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        
        # Find all scene IDs
        scene_pattern = r'场景ID:\s*([a-zA-Z0-9_]+)'
        for match in re.finditer(scene_pattern, content):
            scenes.add(match.group(1))
    
    return sorted(scenes)

def main():
    print("=" * 60)
    print("ANALYSIS: Placeholder vs Extracted Scenes")
    print("=" * 60)
    
    placeholders = get_placeholder_scenes()
    extracted = get_extracted_scenes()
    extracted_set = set(extracted)
    
    print(f"\nPlaceholder scenes: {len(placeholders)}")
    print(f"Extracted scenes: {len(extracted)}")
    
    # Find mismatches
    missing = []
    for p in placeholders:
        if p not in extracted_set:
            missing.append(p)
    
    print(f"\nPlaceholder scenes WITHOUT matching extracted scene: {len(missing)}")
    
    if missing:
        print("\nFirst 20 problematic IDs:")
        for i, scene_id in enumerate(missing[:20]):
            print(f"  {i+1}. {scene_id}")
    
    # Show some extracted scenes for reference
    print(f"\nSample extracted scenes (first 20):")
    for i, scene_id in enumerate(extracted[:20]):
        print(f"  {i+1}. {scene_id}")

if __name__ == '__main__':
    main()
