"""
场景脚本修复工具模块

该模块用于修复 game-scenes.js 文件中的 API 调用问题。
主要功能是将直接的状态操作替换为统一的 StateAPI 调用，
确保代码符合新的状态管理架构。

使用方法：
    直接运行此脚本即可自动修复 js/game-scenes.js 文件中的 API 调用。
"""

import re


def fix_scene_api_calls():
    """
    修复场景文件中的 API 调用
    
    该函数执行以下操作：
    1. 读取 js/game-scenes.js 文件内容
    2. 检查并添加 StateAPI 导入语句（如果不存在）
    3. 将直接的状态操作函数调用替换为 StateAPI 命名空间下的调用
    4. 移除废弃的 gameState 直接操作
    5. 将修复后的内容写回文件
    
    Returns:
        None
    
    修复规则：
        - hasItem() -> StateAPI.hasItem()
        - addItem() -> StateAPI.addItem()
        - getFlag() -> StateAPI.getFlag()
        - setFlag() -> StateAPI.setFlag()
        - hasClue() -> StateAPI.hasClue()
        - addClue() -> StateAPI.addClue()
        - removeItem() -> StateAPI.removeItem()
    """
    file_path = 'js/game-scenes.js'
    
    with open(file_path, 'r', encoding='utf-8') as file:
        content = file.read()
    
    if 'import { StateAPI }' not in content:
        import_statement = "import { StateAPI } from './game-engine.js';\n"
        content = import_statement + content
    
    api_functions = r'(hasItem|addItem|getFlag|setFlag|hasClue|addClue|removeItem)\('
    content = re.sub(
        r'(?<!StateAPI\.)\b' + api_functions,
        r'StateAPI.\1(',
        content
    )
    
    content = content.replace('gameState.items.push(', 'StateAPI.addItem(')
    content = content.replace('gameState.medals.push(', '// ')
    content = content.replace('gameState.clues.push(', 'StateAPI.addClue(')

    with open(file_path, 'w', encoding='utf-8') as file:
        file.write(content)
    
    print('Done!')


if __name__ == '__main__':
    fix_scene_api_calls()

