import re

with open('index.html', 'r', encoding='utf-8') as f:
    html = f.read()

# 1. Add CSS for settings panel
settings_css = '''
        #settings-panel {
            display: none;
            position: fixed;
            top: 20%;
            left: 50%;
            transform: translateX(-50%);
            background-color: #222;
            border: 2px solid var(--accent-color);
            width: 80%;
            max-width: 400px;
            padding: 20px;
            box-shadow: 0 0 20px rgba(0,0,0,0.8);
            z-index: 100;
        }
        #settings-panel label {
            display: inline-block;
            width: 100px;
        }
'''
if '#settings-panel' not in html:
    html = html.replace('</style>', settings_css + '    </style>')

# 2. Add Settings button
settings_btn = '<button id="settings-btn" class="nav-btn" onclick="toggleSettings()">设置</button>'
if 'id="settings-btn"' not in html:
    html = html.replace(
        '<button id="inventory-btn"',
        settings_btn + '\n            <button id="inventory-btn"'
    )

# 3. Add Settings Modal
settings_modal = '''
    <div id="settings-panel">
        <h2 style="color: var(--accent-color); margin-top: 0; border-bottom: 1px solid #444; padding-bottom: 10px;">设置</h2>
        <div style="margin-bottom: 15px;">
            <label>字体大小：</label>
            <input type="range" id="setting-fontsize" min="14" max="24" value="16" oninput="applySettings()">
            <span id="fontsize-val">16px</span>
        </div>
        <div style="margin-bottom: 15px;">
            <label>打字机速度：</label>
            <input type="range" id="setting-typespeed" min="10" max="60" value="25" oninput="applySettings()" step="1">
            <span id="typespeed-val">25ms</span>
        </div>
        <div style="margin-bottom: 15px;">
            <label>关闭动画：</label>
            <input type="checkbox" id="setting-noanim" onchange="applySettings()">
        </div>
        <button class="sys-btn" style="width: 100%; margin-top: 15px; padding: 10px;" onclick="toggleSettings()">关闭设置</button>
    </div>
'''

if 'id="settings-panel"' not in html:
    html = html.replace('<!-- 游戏引擎核心逻辑', settings_modal + '\n    <!-- 游戏引擎核心逻辑')

with open('index.html', 'w', encoding='utf-8') as f:
    f.write(html)
print('Settings UI added')
