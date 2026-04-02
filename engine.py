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

    def remove_item(self, item):
        if item in self.state["items"]:
            self.state["items"].remove(item)
            return True
        return False


    def remove_item(self, item):
        if item in self.state["items"]:
            self.state["items"].remove(item)
            return True
        return False

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
                res = self.current_scene.on_enter(self.state)
                if isinstance(res, dict) and res.get("type") == "redirect":
                    target_id = res.get("target")
                    if target_id and target_id in self.scenes:
                        self.current_scene = self.scenes[target_id]
                        self.state.set("current_scene_id", target_id)
                        continue

            print(self.current_scene.desc)
            print("-" * 40)
            
            available_options = []
            for opt in self.current_scene.options:
                if opt.condition is None or opt.condition(self.state):
                    available_options.append(opt)
            
            # 基础命令
            is_trap = any(kw in self.current_scene.id for kw in ["trap", "death", "explosion", "failure", "dead"])
            if is_trap and (len(self.current_scene.options) <= 1 or not self.current_scene.options):
                room_entry = "hall_main"
                prefix = self.current_scene.id.split("_")[0]
                if prefix in ["library", "basement", "greenhouse", "musicroom", "studio", "clocktower", "bedroom"]:
                    room_entry = f"{prefix}_entry"
                
                # We need Option class, which is defined in engine.py
                available_options.clear()
                available_options.append(Option("重新挑战 (回到进入前)", room_entry))
                available_options.append(Option("返回大厅稍作休息", "hall_main"))
                print("\n[提示：遇到危险！如果死亡，可输入 'load' 读取存档。]")

            print("\n[系统指令: save (保存), load (读取), inv (背包/线索), hint (提示), q (退出)]")

            if not available_options:
                print("没有可行的选项，游戏结束。")
                break

            visited = self.state.get("visited_options", [])
            for i, opt in enumerate(available_options, 1):
                opt_key = f"{self.current_scene.id}->{opt.target}"
                if opt_key in visited:
                    print(f"[90m{i}. {opt.text} (已勘查)[0m")
                else:
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
            elif choice in ['hint', '提示']:
                try:
                    with open("data/hints.json", "r", encoding="utf-8") as f:
                        hints_db = json.load(f)
                    
                    hint_list = hints_db.get(self.current_scene.id)
                    if not hint_list:
                        prefix = self.current_scene.id.split("_")[0] + "_entry"
                        hint_list = hints_db.get(prefix, hints_db.get("default"))
                    
                    hint_idx = self.state.get(f"hint_level_{self.current_scene.id}", 0)
                    if hint_idx < len(hint_list):
                        print(f"\n【系统提示】: {hint_list[hint_idx]}")
                        self.state.set(f"hint_level_{self.current_scene.id}", hint_idx + 1)
                    else:
                        print("\n【系统提示】: 已经没有更多提示了。")
                except FileNotFoundError:
                    print("\n【系统提示】: 提示库未找到。")
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
                    visited = self.state.get("visited_options", [])
                    opt_key = f"{self.current_scene.id}->{selected.target}"
                    if opt_key not in visited:
                        visited.append(opt_key)
                        self.state.set("visited_options", visited)
                    self.current_scene = self.scenes[selected.target]
                    self.state.set("current_scene_id", selected.target)
                    self.state.save("autosave.json")
                else:
                    print("无效选择，请重新输入。")
                    input("按回车继续...")
            except ValueError:
                print("请输入有效的数字或指令。")
                input("按回车继续...")
