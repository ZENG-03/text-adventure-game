"""
游戏引擎核心模块

该模块实现了游戏的核心逻辑，包括场景管理、状态管理、
用户交互处理和游戏循环。它是整个游戏的核心控制器。

主要功能：
- 场景管理：加载、切换和执行场景
- 状态管理：维护游戏状态，包括物品、线索、标记等
- 用户交互：处理用户选择和输入
- 游戏循环：控制游戏的运行流程
"""

import json
import os

from state_store import StateStore


class GameState:
    """
    游戏状态管理类
    
    负责维护和访问游戏中的各项数据，包括：
    - 玩家背包物品
    - 收集的线索
    - 获得的徽章
    - 游戏标记（状态变量）
    - 提示等级
    
    提供了状态的保存和加载功能，支持游戏进度的持久化。
    """
    
    def __init__(self, initial_state=None):
        """
        初始化游戏状态
        
        Args:
            initial_state: 初始状态数据（可选）
        """
        self.store = StateStore(initial_state)

    @property
    def root(self):
        """
        获取根状态
        
        Returns:
            dict: 完整的根状态数据
        """
        return self.store.root

    @property
    def profile(self):
        """
        获取玩家存档信息（多周目共享）
        
        Returns:
            dict: 个人资料状态
        """
        return self.store.profile

    @property
    def state(self):
        """
        获取当前单局游戏状态
        
        Returns:
            dict: 当前运行状态
        """
        return self.store.run

    @state.setter
    def state(self, value):
        """
        设置当前单局游戏状态
        
        Args:
            value: 新的运行状态数据
        """
        self.store.replace_run(value)

    @property
    def items(self):
        """
        获取当前拥有的道具列表
        
        Returns:
            list: 物品列表
        """
        return self.store.run["items"]

    @property
    def clues(self):
        """
        获取当前收集的线索列表
        
        Returns:
            list: 线索列表
        """
        return self.store.run["clues"]

    @property
    def medals(self):
        """
        获取当前获得的徽章列表
        
        Returns:
            list: 徽章列表
        """
        return self.store.run["medals"]

    @property
    def flags(self):
        """
        获取当前游戏的标记（状态变量）
        
        Returns:
            dict: 标记字典
        """
        return self.store.run["flags"]

    def get(self, key, default=None):
        """
        获取指定键的状态值，支持提示等级和通用标记
        
        Args:
            key: 状态键
            default: 默认值（可选）
        
        Returns:
            Any: 状态值或默认值
        """
        if key in self.store.run:
            return self.store.run.get(key, default)
        if key.startswith("hint_level_"):
            scene_id = key[len("hint_level_"):]
            return self.store.run["hint_levels"].get(scene_id, default)
        return self.store.run["flags"].get(key, default)

    def set(self, key, value):
        """
        设置指定键的状态值
        
        Args:
            key: 状态键
            value: 状态值
        
        Returns:
            Any: 设置的值
        """
        if key in self.store.run:
            self.store.run[key] = value
            return value
        if key.startswith("hint_level_"):
            scene_id = key[len("hint_level_"):]
            self.store.run["hint_levels"][scene_id] = value
            return value
        self.store.run["flags"][key] = value
        return value

    def add_item(self, item):
        """
        添加道具到背包
        
        Args:
            item: 物品名称
        
        Returns:
            bool: 是否添加成功（如果物品已存在则返回 False）
        """
        if item not in self.items:
            self.items.append(item)
            return True
        return False

    def has_item(self, item):
        """
        检查是否拥有某道具
        
        Args:
            item: 物品名称
        
        Returns:
            bool: 是否拥有该物品
        """
        return item in self.items

    def remove_item(self, item):
        """
        从背包移除道具
        
        Args:
            item: 物品名称
        
        Returns:
            bool: 是否移除成功（如果物品不存在则返回 False）
        """
        if item in self.items:
            self.items.remove(item)
            return True
        return False

    def has_clue(self, clue):
        """
        检查是否获得某线索
        
        Args:
            clue: 线索名称
        
        Returns:
            bool: 是否拥有该线索
        """
        return clue in self.clues

    def add_clue(self, clue):
        """
        添加新线索
        
        Args:
            clue: 线索名称
        
        Returns:
            bool: 是否添加成功（如果线索已存在则返回 False）
        """
        if clue not in self.clues:
            self.clues.append(clue)
            return True
        return False

    def save(self, filename="savegame.json"):
        """
        保存当前游戏进度到文件
        
        Args:
            filename: 保存文件名（默认 "savegame.json"）
        """
        with open(filename, "w", encoding="utf-8") as f:
            json.dump(self.store.export_root(), f, ensure_ascii=False, indent=4)
        print("游戏已保存。")

    def load(self, filename="savegame.json"):
        """
        从文件读取游戏进度
        
        Args:
            filename: 加载文件名（默认 "savegame.json"）
        
        Returns:
            str: 当前场景ID，如果加载失败则返回 None
        """
        try:
            with open(filename, "r", encoding="utf-8") as f:
                payload = json.load(f)
            self.store.replace_root(payload)
            print("读取存档成功。")
            return self.get("current_scene_id")
        except FileNotFoundError:
            print("找不到存档文件。")
            return None


class Option:
    """
    游戏选项类
    
    定义场景间的跳转及条件，每个选项包含：
    - 选项文本
    - 目标场景ID
    - 触发条件（可选）
    - 触发效果（可选）
    """
    
    def __init__(self, text, target_id, condition=None, effect=None):
        """
        初始化选项
        
        Args:
            text: 选项显示的文字
            target_id: 目标场景ID
            condition: 触发条件函数，接收GameState，返回bool（可选）
            effect: 触发效果函数，接收GameState（可选）
        """
        self.text = text        # 选项显示的文字
        self.target = target_id # 目标场景ID
        self.condition = condition  # 触发条件函数，接收GameState，返回bool
        self.effect = effect        # 触发效果函数，接收GameState


class Scene:
    """
    游戏场景类
    
    包含场景的描述、选项和进入触发器，是游戏的基本组成单元。
    """
    
    def __init__(self, scene_id, description, options=None, on_enter=None):
        """
        初始化场景
        
        Args:
            scene_id: 场景唯一标识符
            description: 场景描述文字
            options: 可选操作列表（默认空列表）
            on_enter: 进入场景时触发的函数，接收GameState（可选）
        """
        self.id = scene_id          # 场景唯一标识符
        self.desc = description     # 场景描述文字
        self.options = options or [] # 可选操作列表
        self.on_enter = on_enter    # 进入场景时触发的函数，接收GameState


class GameEngine:
    """
    游戏引擎主类
    
    负责驱动游戏循环和逻辑处理，是整个游戏的核心控制器。
    处理用户输入、场景切换、状态管理等核心功能。
    """
    
    def __init__(self, scenes, start_scene_id):
        """
        初始化游戏引擎
        
        Args:
            scenes: 场景字典
            start_scene_id: 初始场景ID
        """
        self.scenes = scenes
        self.state = GameState()
        self.current_scene = self.scenes.get(start_scene_id)
        self.state.set("current_scene_id", start_scene_id)

    def clear_screen(self):
        """
        清空终端屏幕
        
        根据操作系统类型选择合适的清屏命令
        """
        os.system('cls' if os.name == 'nt' else 'clear')

    def run(self):
        """
        启动并运行游戏主循环
        
        游戏循环流程：
        1. 清空屏幕
        2. 处理场景进入时的触发逻辑
        3. 显示当前场景描述
        4. 筛选当前可用的选项
        5. 处理特殊场景（如死亡/陷阱场景）
        6. 显示系统指令提示
        7. 处理用户输入
        8. 执行选项效果并切换场景
        """
        while True:
            # 1. 清空屏幕，准备显示新场景
            self.clear_screen()
            
            # 2. 处理场景进入时的触发逻辑 (on_enter)
            if self.current_scene.on_enter:
                res = self.current_scene.on_enter(self.state)
                # 如果触发器返回了重定向指令，跳转到目标场景
                if isinstance(res, dict) and res.get("type") == "redirect":
                    target_id = res.get("target")
                    if target_id and target_id in self.scenes:
                        self.current_scene = self.scenes[target_id]
                        self.state.set("current_scene_id", target_id)
                        continue

            # 3. 显示当前场景描述
            print(self.current_scene.desc)
            print("-" * 40)
            
            # 4. 筛选当前可用的选项（根据 condition 判断）
            available_options = []
            for opt in self.current_scene.options:
                if opt.condition is None or opt.condition(self.state):
                    available_options.append(opt)
            
            # 5. 特殊处理：死亡/陷阱场景的自动恢复选项
            # 检查场景ID是否包含危险关键词
            is_trap = any(kw in self.current_scene.id for kw in ["trap", "death", "explosion", "failure", "dead"])
            # 如果是危险场景且没有后续选项，自动添加"重新开始"选项
            if is_trap and (len(self.current_scene.options) <= 1 or not self.current_scene.options):
                room_entry = "hall_main"
                prefix = self.current_scene.id.split("_")[0]
                # 尝试定位该区域的入口场景
                if prefix in ["library", "basement", "greenhouse", "musicroom", "studio", "clocktower", "bedroom"]:
                    room_entry = f"{prefix}_entry"
                
                available_options.clear()
                available_options.append(Option("重新挑战 (回到进入前)", room_entry))
                available_options.append(Option("返回大厅稍作休息", "hall_main"))
                print("\n[提示：遇到危险！如果死亡，可输入 'load' 读取存档。]")

            # 6. 显示系统指令提示
            print("\n[系统指令: save (保存), load (读取), inv (背包/线索), hint (提示), q (退出)]")

            # 7. 如果没有任何可用选项，游戏结束
            if not available_options:
                print("没有可行的选项，游戏结束。")
                break

            # 8. 列出所有可用选项，并标记已访问过的选项
            visited = self.state.get("visited_options", [])
            for i, opt in enumerate(available_options, 1):
                opt_key = f"{self.current_scene.id}->{opt.target}"
                if opt_key in visited:
                    # 使用灰色显示已访问选项 (ANSI 90m)
                    print(f"\u001b[90m{i}. {opt.text} (已勘查)\u001b[0m")
                else:
                    print(f"{i}. {opt.text}")

            # 9. 获取用户输入
            choice = input("\n请选择（输入数字或指令）: ").strip().lower()

            # 10. 处理系统指令
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
                # 提示系统：从 hints.json 加载提示内容
                try:
                    with open("src/data/hints.json", "r", encoding="utf-8") as f:
                        hints_db = json.load(f)
                    
                    hint_list = hints_db.get(self.current_scene.id)
                    # 如果当前场景没有特定提示，尝试寻找区域入口提示
                    if not hint_list:
                        prefix = self.current_scene.id.split("_")[0] + "_entry"
                        hint_list = hints_db.get(prefix, hints_db.get("default"))
                    
                    # 获取并增加当前的提示等级
                    hint_idx = self.state.get(f"hint_level_{self.current_scene.id}", 0)
                    if hint_list and hint_idx < len(hint_list):
                        print(f"\n【系统提示】: {hint_list[hint_idx]}")
                        self.state.set(f"hint_level_{self.current_scene.id}", hint_idx + 1)
                    else:
                        print("\n【系统提示】: 已经没有更多提示了。")
                except FileNotFoundError:
                    print("\n【系统提示】: 提示库未找到。")
                input("按回车继续...")
                continue
            elif choice == 'inv':
                # 显示玩家当前拥有的所有信息
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
                
            # 11. 处理数字选项选择
            try:
                idx = int(choice) - 1
                if 0 <= idx < len(available_options):
                    selected = available_options[idx]
                    # 执行选项附带的效果 (effect)
                    if selected.effect:
                        selected.effect(self.state)
                    
                    # 记录该路径为已访问
                    visited = self.state.get("visited_options", [])
                    opt_key = f"{self.current_scene.id}->{selected.target}"
                    if opt_key not in visited:
                        visited.append(opt_key)
                        self.state.set("visited_options", visited)
                    
                    # 跳转到新场景并保存进度
                    self.current_scene = self.scenes[selected.target]
                    self.state.set("current_scene_id", selected.target)
                    self.state.save("autosave.json")
                else:
                    print("无效选择，请重新输入。")
                    input("按回车继续...")
            except ValueError:
                print("请输入有效的数字或指令。")
                input("按回车继续...")
