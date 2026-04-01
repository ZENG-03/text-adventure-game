import os
import json

class GameState:
    def __init__(self):
        self.state = {
            "medals": [],
            "rooms_completed": [],
            "items": [],
            "clues": [],
            "side_quests": {},
            "hall_medal_count": 0,
            "current_scene_id": "opening_cinematic"
        }

    def get(self, key, default=None):
        return self.state.get(key, default)

    def set(self, key, value):
        self.state[key] = value

    def add_item(self, item):
        if item not in self.state["items"]:
            self.state["items"].append(item)
            return True
        return False

    def has_item(self, item):
        return item in self.state["items"]

    def has_clue(self, clue):
        return clue in self.state["clues"]

    def add_clue(self, clue):
        if clue not in self.state["clues"]:
            self.state["clues"].append(clue)
            return True
        return False

    def save(self, filename="savegame.json"):
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(self.state, f, ensure_ascii=False, indent=4)
        print("游戏已保存！")

    def load(self, filename="savegame.json"):
        try:
            with open(filename, "r", encoding="utf-8") as f:
                self.state = json.load(f)
            print("读取存档成功！")
            return self.state["current_scene_id"]
        except FileNotFoundError:
            print("找不到存档文件。")
            return None

class Option:
    def __init__(self, text, target_id, condition=None, effect=None):
        self.text = text
        self.target = target_id
        self.condition = condition  # function taking GameState, returning bool
        self.effect = effect        # function taking GameState

class Scene:
    def __init__(self, scene_id, description, options=None, on_enter=None):
        self.id = scene_id
        self.desc = description
        self.options = options or []
        self.on_enter = on_enter    # function taking GameState

class GameEngine:
    def __init__(self, scenes, start_scene_id):
        self.scenes = scenes
        self.state = GameState()
        self.current_scene = self.scenes.get(start_scene_id)
        self.state.set("current_scene_id", start_scene_id)

    def clear_screen(self):
        os.system('cls' if os.name == 'nt' else 'clear')

    def run(self):
        while True:
            self.clear_screen()
            if self.current_scene.on_enter:
                self.current_scene.on_enter(self.state)
                
            print(self.current_scene.desc)
            print("-" * 40)
            
            available_options = []
            for opt in self.current_scene.options:
                if opt.condition is None or opt.condition(self.state):
                    available_options.append(opt)
            
            # 基础命令
            print("\n[系统指令: save (保存), load (读取), inv (背包/线索), q (退出)]")
            
            if not available_options:
                print("没有可行的选项，游戏结束。")
                break
                
            for i, opt in enumerate(available_options, 1):
                print(f"{i}. {opt.text}")
                
            choice = input("\n请选择（输入数字或指令）: ").strip().lower()
            
            if choice == 'save':
                self.state.save()
                input("按回车继续...")
                continue
            elif choice == 'load':
                scene_id = self.state.load()
                if scene_id and scene_id in self.scenes:
                    self.current_scene = self.scenes[scene_id]
                input("按回车继续...")
                continue
            elif choice == 'inv':
                print("\n--- 侦探笔记 ---")
                print("道具: ", ", ".join(self.state.get("items")) or "无")
                print("线索: ", ", ".join(self.state.get("clues")) or "无")
                print("徽章: ", ", ".join(self.state.get("medals")) or "无")
                print("---------------")
                input("按回车继续...")
                continue
            elif choice == 'q':
                print("感谢游玩！")
                break
                
            try:
                idx = int(choice) - 1
                if 0 <= idx < len(available_options):
                    selected = available_options[idx]
                    if selected.effect:
                        selected.effect(self.state)
                    self.current_scene = self.scenes[selected.target]
                    self.state.set("current_scene_id", selected.target)
                else:
                    print("无效选择，请重新输入。")
                    input("按回车继续...")
            except ValueError:
                print("请输入有效的数字或指令。")
                input("按回车继续...")
