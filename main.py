from engine import GameEngine
from data import build_scenes

def main():
    print("正在加载游戏资源...")
    scenes = build_scenes()
    
    engine = GameEngine(scenes, "title")
    engine.run()

if __name__ == "__main__":
    main()
