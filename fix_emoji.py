"""
表情符号修复工具模块

该模块用于修复 game-scenes.js 文件中损坏的表情符号显示问题。
通过正则表达式替换，将乱码或缺失的表情符号恢复为正确的格式。

使用方法：
    直接运行此脚本即可自动修复 js/game-scenes.js 文件中的表情符号问题。
"""

import re


def fix_emoji_in_scenes():
    """
    修复游戏场景文件中的表情符号
    
    该函数执行以下操作：
    1. 读取 js/game-scenes.js 文件内容
    2. 使用正则表达式匹配损坏的表情符号模式
    3. 将匹配到的内容替换为正确的表情符号格式
    4. 将修复后的内容写回文件
    
    Returns:
        None
    
    Note:
        当前修复规则：将乱码形式的'查看笔记'替换为正确的表情符号格式
    """
    with open('js/game-scenes.js', 'r', encoding='utf-8') as f:
        text = f.read()

    text = re.sub(r'[\ufffd\?\s]+查看笔记', '📘 查看笔记', text)

    with open('js/game-scenes.js', 'w', encoding='utf-8') as f:
        f.write(text)


if __name__ == '__main__':
    fix_emoji_in_scenes()

