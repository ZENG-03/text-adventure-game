"""
游戏主入口模块

该模块是文字冒险解谜游戏的主入口点，负责初始化游戏引擎并启动游戏循环。
游戏场景数据由 data 模块构建，游戏逻辑由 engine 模块驱动。
"""

from engine import GameEngine
from data import build_scenes


def main():
    """
    游戏主函数
    
    执行以下操作：
    1. 显示加载提示信息
    2. 构建所有游戏场景数据
    3. 初始化游戏引擎，设置起始场景为标题画面
    4. 启动游戏主循环
    
    Returns:
        None
    """
    print("正在加载游戏资源...")
    scenes = build_scenes()
    
    engine = GameEngine(scenes, "title")
    engine.run()


if __name__ == "__main__":
    main()

