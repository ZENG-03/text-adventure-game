import re
import os

def parse_txt(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    parts = re.split(r'场景ID:\s*([A-Za-z0-9_]+)', content)
    scenes = {}
    for i in range(1, len(parts), 2):
        scene_id = parts[i].strip()
        scene_body = parts[i+1]
        
        conditionMatch = re.search(r'条件：([^\n]+)', scene_body)
        condition = conditionMatch.group(1).strip() if conditionMatch else None
        
        options_section = re.search(r'\*\*选项[：:]\*\*\s*(.*)', scene_body, re.S)
        if options_section:
            desc_part = scene_body[:options_section.start()].strip()
            options_text = options_section.group(1).strip()
        else:
            desc_part = scene_body.strip()
            options_text = ''
            
        desc_lines = []
        effs = []
        for line in desc_part.split('\n'):
            line = line.strip()
            if line.startswith('条件：') or line.startswith('---') or line.startswith('##'):
                continue
            if line.startswith('**获得线索：') or line.startswith('**状态：') or line.startswith('**获得状态：') or line.startswith('**获得物品：') or line.startswith('**获得奖励：') or line.startswith('**线索：') or line.startswith('**状态') or line.startswith('**获得'):
                effs.append(line.replace('**', '').strip())
                continue
            if line:
                desc_lines.append(line)
        desc = '\n'.join(desc_lines)
        
        options = []
        for opt in options_text.split('\n'):
            opt = opt.strip()
            if not opt.startswith('-'): continue
            
            targetMatch = re.search(r'\[(?:前往|返回)\s+([A-Za-z0-9_]+)\]', opt)
            target = targetMatch.group(1) if targetMatch else 'hall_main'
            
            # Remove the bracket part to get pure text
            textMatch = re.search(r'-\s*(.*?)\s*(?:\[|$)', opt)
            text = textMatch.group(1).strip() if textMatch else opt.replace('- ', '').strip()
            
            opt_cond = re.search(r'\[条件\s*[:：]\s*(.*?)\]', opt)
            if opt_cond:
                opt_cond_str = opt_cond.group(1)
            else:
                opt_cond2 = re.search(r'（(.*?)）', opt)
                opt_cond_str = opt_cond2.group(1) if opt_cond2 else None
                
            options.append({'text': text, 'target': target, 'cond_str': opt_cond_str})
            
        scenes[scene_id] = {
            'desc': desc.replace('\\', '\\\\').replace('`', '\\`'),
            'options': options,
            'effs': effs,
            'enter_condition': condition
        }
    return scenes

def make_js_code(scenes):
    js_lines = []
    for sid, sdata in scenes.items():
        js_lines.append(f'scenes["{sid}"] = {{')
        
        if sdata['effs']:
            js_lines.append('    on_enter: () => {')
            js_lines.append('        let msg = "";')
            
            for eff in sdata['effs']:
                if '获得线索' in eff or '获得线索：' in eff or '线索：' in eff:
                    clue = eff.split('：')[1].strip() if '：' in eff else eff.replace('获得线索', '').strip()
                    js_lines.append(f'        if(!hasClue("{clue}")) {{')
                    js_lines.append(f'            gameState.clues.push("{clue}");')
                    js_lines.append(f'            msg += `<div class="system-message">【获得线索】：{clue}</div>`;')
                    js_lines.append('        }')
                elif '获得奖励' in eff or '获得物品' in eff or '奖励：' in eff or '物品：' in eff:
                    item_part = eff.split('：')[1].strip() if '：' in eff else eff.replace('获得奖励', '').replace('获得物品', '').strip()
                    items = [x.strip() for x in re.split(r'、|，|,', item_part)]
                    if len(items) > 0:
                        cond_item = items[0]
                        js_lines.append(f'        if(!hasItem("{cond_item}")) {{')
                        for item in items:
                            js_lines.append(f'            gameState.items.push("{item}");')
                            if '徽章' in item:
                                js_lines.append(f'            gameState.medals.push("{item}");')
                                js_lines.append('            addMedal();')
                        js_lines.append(f'            msg += `<div class="system-message">【获得奖励】：{item_part}</div>`;')
                        js_lines.append('        }')
                elif '状态' in eff:
                    state_part = eff.split('：')[1].strip() if '：' in eff else eff.replace('状态', '').replace('获得状态', '').strip()
                    js_lines.append(f'        if(!getFlag("{state_part}")) {{')
                    js_lines.append(f'            setFlag("{state_part}", true);')
                    if '封印' in state_part or '麻痹' in state_part or '稀释' in state_part:
                        js_lines.append(f'            msg += `<div class="danger-message">【状态更新】：{state_part}</div>`;')
                    else:
                        js_lines.append(f'            msg += `<div class="system-message">【状态更新】：{state_part}</div>`;')
                    js_lines.append('        }')
                    
            js_lines.append('        return msg;')
            js_lines.append('    },')
            
        desc_text = sdata["desc"].replace('$', '\\$')
        js_lines.append(f'    desc: `{desc_text}`,')
        
        js_lines.append('    options: [')
        opts = []
        for opt in sdata['options']:
            text = opt['text'].replace('"', '\\"').replace('`', '\\`')
            target = opt['target']
            cond_str = opt['cond_str']
            
            opt_line = f'        {{ text: "{text}", target: "{target}"'
            
            if cond_str:
                if '不' in cond_str and '线索' in cond_str:
                     item = cond_str.replace('不', '').replace('需要', '').replace('拥有', '').replace('线索', '').replace('：','').replace(':','').strip()
                     opt_line += f', condition: () => !hasClue("{item}")'
                elif '线索' in cond_str:
                    item = cond_str.replace('需要', '').replace('拥有', '').replace('线索', '').replace('：','').replace(':','').strip()
                    opt_line += f', condition: () => hasClue("{item}")'
                elif '不' in cond_str and '状态' in cond_str:
                    item = cond_str.replace('不', '').replace('需要', '').replace('状态', '').replace('：','').replace(':','').strip()
                    opt_line += f', condition: () => !getFlag("{item}")'
                elif '状态' in cond_str:
                    item = cond_str.replace('需要', '').replace('状态', '').replace('：','').replace(':','').strip()
                    opt_line += f', condition: () => getFlag("{item}")'
                elif '需要' in cond_str or '拥有' in cond_str or '获得过' in cond_str:
                    item = cond_str.replace('需要拥有', '').replace('需要', '').replace('拥有', '').replace('获得过', '').replace('：','').replace(':','').strip()
                    opt_line += f', condition: () => hasItem("{item}")'
                elif '若有' in cond_str:
                    opt_line += f', condition: () => hasItem("生命之露")'
            opt_line += ' }'
            opts.append(opt_line)
        js_lines.append(',\n'.join(opts))
        js_lines.append('    ]')
        js_lines.append('};\n')
    return '\n'.join(js_lines)

js1 = make_js_code(parse_txt('文本/谜题-地下室.txt'))
js2 = make_js_code(parse_txt('文本/谜题-画室.txt'))
js3 = make_js_code(parse_txt('文本/谜题-图书馆.txt'))

full_js = "\n// --- 自动生成的地下室场景 ---\n" + js1 + "\n// --- 自动生成的画室场景 ---\n" + js2 + "\n// --- 自动生成的图书馆场景 ---\n" + js3

html_path = 'index.html'
with open(html_path, 'r', encoding='utf-8') as f:
    html = f.read()

prefix = "// --- 自动生成的地下室场景 ---"
if prefix in html:
    idx = html.find(prefix)
    html = html[:idx]

last_script_end = html.rfind('</script>')
if last_script_end != -1:
    new_html = html[:last_script_end] + full_js + '\n' + html[last_script_end:]
    with open(html_path, 'w', encoding='utf-8') as f:
        f.write(new_html)
    print("成功将三个房间的剧情融入 index.html！")
else:
    print("找不到 </script> 标签！")
