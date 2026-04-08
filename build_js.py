"""
场景构建脚本模块

该模块负责从文本文件解析场景数据，生成 JavaScript 代码，
并将其嵌入到 index.html 文件中。主要用于将游戏剧情文本转换为
可在浏览器中运行的 JavaScript 场景定义。

使用方法：
    直接运行此脚本即可自动生成并更新 index.html 中的场景代码。

处理流程：
    1. 解析 文本/ 目录下的谜题文本文件
    2. 提取场景描述、选项和效果信息
    3. 生成对应的 JavaScript 场景代码
    4. 将生成的代码插入到 index.html 中
"""

import re
import os


def parse_txt(file_path):
    """
    解析文本文件中的场景定义
    
    该函数读取指定文本文件，解析其中的场景定义，
    包括场景描述、选项、条件和效果。
    
    Args:
        file_path (str): 要解析的文本文件路径
    
    Returns:
        dict: 场景字典，键为场景ID，值为场景数据对象
        
        场景数据对象包含：
            - desc: 场景描述文本
            - options: 选项列表，每个选项包含 text、target、cond_str
            - effs: 效果列表
            - enter_condition: 进入条件
    
    解析格式：
        场景ID: scene_name
        场景描述文本...
        **选项：**
        - 选项文本 [前往 target_scene] [条件：condition]
    """
    # 读取文件内容
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 使用正则表达式分割场景，提取场景ID和场景内容
    parts = re.split(r'场景ID:\s*([A-Za-z0-9_]+)', content)
    scenes = {}
    
    # 遍历所有场景，处理每个场景的内容
    for i in range(1, len(parts), 2):
        scene_id = parts[i].strip()
        scene_body = parts[i + 1]
        
        # 提取场景进入条件
        condition_match = re.search(r'条件：([^\n]+)', scene_body)
        condition = condition_match.group(1).strip() if condition_match else None
        
        # 提取选项部分
        options_section = re.search(
            r'\*\*选项[：:]\*\*\s*(.*)', scene_body, re.S
        )
        if options_section:
            # 分离场景描述和选项文本
            desc_part = scene_body[:options_section.start()].strip()
            options_text = options_section.group(1).strip()
        else:
            # 没有选项部分的情况
            desc_part = scene_body.strip()
            options_text = ''
        
        # 处理场景描述和效果
        desc_lines = []
        effs = []
        
        # 遍历描述部分的每一行
        for line in desc_part.split('\n'):
            line = line.strip()
            # 跳过条件行和分隔线
            if line.startswith('条件：') or line.startswith('---'):
                continue
            # 跳过标题行
            if line.startswith('##'):
                continue
            # 检查是否是效果行
            effect_patterns = [
                '**获得线索：', '**状态：', '**获得状态：',
                '**获得物品：', '**获得奖励：', '**线索：',
                '**状态', '**获得'
            ]
            if any(line.startswith(p) for p in effect_patterns):
                # 提取效果并添加到效果列表
                effs.append(line.replace('**', '').strip())
                continue
            # 添加非空行到描述列表
            if line:
                desc_lines.append(line)
        
        # 组合场景描述
        desc = '\n'.join(desc_lines)
        
        # 处理选项
        options = []
        for opt in options_text.split('\n'):
            opt = opt.strip()
            # 跳过非选项行
            if not opt.startswith('-'):
                continue
            
            # 提取目标场景
            target_match = re.search(r'\[(?:前往|返回)\s+([A-Za-z0-9_]+)\]', opt)
            target = target_match.group(1) if target_match else 'hall_main'
            
            # 提取选项文本
            text_match = re.search(r'-\s*(.*?)\s*(?:\[|$)', opt)
            text = text_match.group(1).strip() if text_match else opt.replace('- ', '').strip()
            
            # 提取选项条件
            opt_cond = re.search(r'\[条件\s*[:：]\s*(.*?)\]', opt)
            if opt_cond:
                opt_cond_str = opt_cond.group(1)
            else:
                # 尝试从括号中提取条件
                opt_cond2 = re.search(r'（(.*?)）', opt)
                opt_cond_str = opt_cond2.group(1) if opt_cond2 else None
            
            # 添加选项到选项列表
            options.append({
                'text': text,
                'target': target,
                'cond_str': opt_cond_str
            })
        
        # 添加场景到场景字典
        scenes[scene_id] = {
            'desc': desc.replace('\\', '\\\\').replace('`', '\\`'),  # 转义特殊字符
            'options': options,
            'effs': effs,
            'enter_condition': condition
        }
    
    return scenes


def make_js_code(scenes):
    """
    将场景数据转换为 JavaScript 代码
    
    该函数接收解析后的场景字典，生成对应的 JavaScript 场景定义代码。
    包括场景描述、选项、进入效果和条件判断。
    
    Args:
        scenes (dict): 场景字典，由 parse_txt() 函数返回
    
    Returns:
        str: 生成的 JavaScript 代码字符串
    
    生成的代码格式：
        scenes["scene_id"] = {
            on_enter: () => { ... },
            desc: `场景描述`,
            options: [
                { text: "选项文本", target: "目标场景", condition: ... }
            ]
        };
    """
    # 存储生成的 JavaScript 代码行
    js_lines = []
    
    # 遍历每个场景
    for sid, sdata in scenes.items():
        # 开始定义场景对象
        js_lines.append(f'scenes["{sid}"] = {{')
        
        # 处理场景进入效果
        if sdata['effs']:
            js_lines.append('    on_enter: () => {')
            js_lines.append('        let msg = "";')
            
            # 遍历每个效果
            for eff in sdata['effs']:
                # 处理获得线索的效果
                if '获得线索' in eff or '获得线索：' in eff or '线索：' in eff:
                    # 提取线索名称
                    clue = eff.split('：')[1].strip() if '：' in eff else eff.replace('获得线索', '').strip()
                    # 生成检查线索是否存在的代码
                    js_lines.append(f'        if(!hasClue("{clue}")) {{')
                    # 添加线索到游戏状态
                    js_lines.append(f'            gameState.clues.push("{clue}");')
                    # 生成提示消息
                    msg = f'            msg += `<div class="system-message">【获得线索】：{clue}</div>`;'
                    js_lines.append(msg)
                    js_lines.append('        }')
                # 处理获得奖励或物品的效果
                elif '获得奖励' in eff or '获得物品' in eff or '奖励：' in eff or '物品：' in eff:
                    # 提取物品部分
                    item_part = eff.split('：')[1].strip() if '：' in eff else eff.replace('获得奖励', '').replace('获得物品', '').strip()
                    # 分割物品列表
                    items = [x.strip() for x in re.split(r'、|，|,', item_part)]
                    if len(items) > 0:
                        # 使用第一个物品作为条件检查
                        cond_item = items[0]
                        js_lines.append(f'        if(!hasItem("{cond_item}")) {{')
                        # 遍历添加每个物品
                        for item in items:
                            js_lines.append(f'            gameState.items.push("{item}");')
                            # 如果是徽章，添加到徽章列表并调用添加徽章函数
                            if '徽章' in item:
                                js_lines.append(f'            gameState.medals.push("{item}");')
                                js_lines.append('            addMedal();')
                        # 生成提示消息
                        msg = f'            msg += `<div class="system-message">【获得奖励】：{item_part}</div>`;'
                        js_lines.append(msg)
                        js_lines.append('        }')
                # 处理状态更新效果
                elif '状态' in eff:
                    # 提取状态名称
                    state_part = eff.split('：')[1].strip() if '：' in eff else eff.replace('状态', '').replace('获得状态', '').strip()
                    # 生成检查状态是否存在的代码
                    js_lines.append(f'        if(!getFlag("{state_part}")) {{')
                    # 设置状态标志
                    js_lines.append(f'            setFlag("{state_part}", true);')
                    # 根据状态类型生成不同样式的提示消息
                    if '封印' in state_part or '麻痹' in state_part or '稀释' in state_part:
                        msg = f'            msg += `<div class="danger-message">【状态更新】：{state_part}</div>`;'
                    else:
                        msg = f'            msg += `<div class="system-message">【状态更新】：{state_part}</div>`;'
                    js_lines.append(msg)
                    js_lines.append('        }')
            
            # 返回提示消息
            js_lines.append('        return msg;')
            js_lines.append('    },')
        
        # 处理场景描述，转义换行符
        desc_text = sdata["desc"].replace('\n', '\\n')
        js_lines.append(f'    desc: `{desc_text}`,')
        
        # 处理场景选项
        js_lines.append('    options: [')
        opts = []
        
        # 遍历每个选项
        for opt in sdata['options']:
            # 转义选项文本中的特殊字符
            text = opt['text'].replace('"', '\\"').replace('`', '\\`')
            target = opt['target']
            cond_str = opt['cond_str']
            
            # 开始构建选项对象
            opt_line = f'        {{ text: "{text}", target: "{target}"'
            
            # 处理选项条件
            if cond_str:
                # 处理不需要线索的条件
                if '不' in cond_str and '线索' in cond_str:
                    item = cond_str.replace('不', '').replace('需要', '').replace('拥有', '')
                    item = item.replace('线索', '').replace('：', '').replace(':', '').strip()
                    opt_line += f', condition: () => !hasClue("{item}")'
                # 处理需要线索的条件
                elif '线索' in cond_str:
                    item = cond_str.replace('需要', '').replace('拥有', '')
                    item = item.replace('线索', '').replace('：', '').replace(':', '').strip()
                    opt_line += f', condition: () => hasClue("{item}")'
                # 处理不需要状态的条件
                elif '不' in cond_str and '状态' in cond_str:
                    item = cond_str.replace('不', '').replace('需要', '').replace('状态', '')
                    item = item.replace('：', '').replace(':', '').strip()
                    opt_line += f', condition: () => !getFlag("{item}")'
                # 处理需要状态的条件
                elif '状态' in cond_str:
                    item = cond_str.replace('需要', '').replace('状态', '')
                    item = item.replace('：', '').replace(':', '').strip()
                    opt_line += f', condition: () => getFlag("{item}")'
                # 处理需要物品的条件
                elif '需要' in cond_str or '拥有' in cond_str or '获得过' in cond_str:
                    item = cond_str.replace('需要拥有', '').replace('需要', '').replace('拥有', '')
                    item = item.replace('获得过', '').replace('：', '').replace(':', '').strip()
                    opt_line += f', condition: () => hasItem("{item}")'
                # 处理特殊条件
                elif '若有' in cond_str:
                    opt_line += f', condition: () => hasItem("生命之露")'
            
            # 结束选项对象
            opt_line += ' }'
            opts.append(opt_line)
        
        # 添加选项列表到代码
        js_lines.append(',\n'.join(opts))
        js_lines.append('    ]')
        js_lines.append('};\n')
    
    # 组合所有代码行并返回
    return '\n'.join(js_lines)


def main():
    """
    主函数：执行场景构建流程
    
    该函数执行以下操作：
    1. 解析三个谜题文本文件（地下室、画室、图书馆）
    2. 生成对应的 JavaScript 代码
    3. 读取 index.html 文件
    4. 将生成的代码插入到适当位置
    5. 保存更新后的 index.html 文件
    
    Returns:
        None
    """
    # 解析地下室场景文本文件并生成 JavaScript 代码
    js1 = make_js_code(parse_txt('文本/谜题-地下室.txt'))
    # 解析画室场景文本文件并生成 JavaScript 代码
    js2 = make_js_code(parse_txt('文本/谜题-画室.txt'))
    # 解析图书馆场景文本文件并生成 JavaScript 代码
    js3 = make_js_code(parse_txt('文本/谜题-图书馆.txt'))
    
    # 组合所有生成的 JavaScript 代码，添加注释分隔
    full_js = (
        "\n// --- 自动生成的地下室场景 ---\n" + js1 +
        "\n// --- 自动生成的画室场景 ---\n" + js2 +
        "\n// --- 自动生成的图书馆场景 ---\n" + js3
    )
    
    # 读取 index.html 文件
    html_path = 'index.html'
    with open(html_path, 'r', encoding='utf-8') as f:
        html = f.read()
    
    # 检查是否存在旧的自动生成代码，如果存在则删除
    prefix = "// --- 自动生成的地下室场景 ---"
    if prefix in html:
        idx = html.find(prefix)
        html = html[:idx]
    
    # 找到最后一个 </script> 标签的位置
    last_script_end = html.rfind('</script>')
    if last_script_end != -1:
        # 将生成的代码插入到 </script> 标签之前
        new_html = html[:last_script_end] + full_js + '\n' + html[last_script_end:]
        # 保存更新后的 index.html 文件
        with open(html_path, 'w', encoding='utf-8') as f:
            f.write(new_html)
        print("成功将三个房间的剧情融入 index.html！")
    else:
        # 如果找不到 </script> 标签，输出错误信息
        print("找不到 </script> 标签！")


if __name__ == '__main__':
    main()

