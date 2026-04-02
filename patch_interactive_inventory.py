import re
import os

engine_path = "js/game-engine.js"
html_path = "index.html"

# 1. Update Game Engine JS
with open(engine_path, "r", encoding="utf-8") as f:
    engine_content = f.read()

# Add showItemDetails function
item_details_func = """
window.showItemDetails = function(name, desc) {
    const modal = document.getElementById("item-modal");
    if (!modal) return;
    document.getElementById("item-modal-title").innerText = name;
    document.getElementById("item-modal-desc").innerText = desc || "这是一个神秘的物品，目前还没有更多的描述。";
    modal.style.display = "block";
    setTimeout(() => {
        modal.style.opacity = "1";
        modal.style.transform = "translate(-50%, -50%) scale(1)";
    }, 10);
};

window.closeItemDetails = function() {
    const modal = document.getElementById("item-modal");
    if (!modal) return;
    modal.style.opacity = "0";
    modal.style.transform = "translate(-50%, -50%) scale(0.95)";
    setTimeout(() => {
        modal.style.display = "none";
    }, 300);
};

"""
if "window.showItemDetails" not in engine_content:
    engine_content = engine_content.replace('function updateInventoryDisplay() {', item_details_func + 'function updateInventoryDisplay() {')

# Modify updateInventoryDisplay to use onclick
old_title_logic = 'let titleAttr = ITEM_DESCRIPTIONS[rawItem] ? " title=\\"" + ITEM_DESCRIPTIONS[rawItem] + "\\" style=\\"cursor:help;\\"" : "";'
new_title_logic = 'let desc = ITEM_DESCRIPTIONS[rawItem] || "";\n          let titleAttr = desc ? ` onclick="showItemDetails(\'${rawItem}\', \'${desc}\')" style="cursor:pointer; border-bottom: 1px dashed var(--accent-color);"` : "";'
engine_content = engine_content.replace(old_title_logic, new_title_logic)

with open(engine_path, "w", encoding="utf-8") as f:
    f.write(engine_content)


# 2. Update HTML
with open(html_path, "r", encoding="utf-8") as f:
    html_content = f.read()

# Add CSS for item modal
css_to_add = """
        #item-modal {
            display: none;
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0.95);
            background: var(--bg-color);
            padding: 25px;
            border: 2px solid var(--accent-color);
            border-radius: 8px;
            z-index: 10000;
            color: var(--text-color);
            box-shadow: 0 10px 25px rgba(0,0,0,0.8);
            text-align: center;
            min-width: 250px;
            max-width: 80%;
            opacity: 0;
            transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
        #item-modal h3 {
            margin-top: 0;
            color: var(--accent-color);
            font-size: 1.4em;
            margin-bottom: 15px;
        }
        #item-modal p {
            font-size: 1.1em;
            line-height: 1.6;
            margin-bottom: 20px;
        }
        #item-modal button {
            background-color: var(--accent-color);
            color: #000;
            border: none;
            padding: 8px 20px;
            font-size: 1em;
            cursor: pointer;
            border-radius: 4px;
            font-weight: bold;
        }
        #item-modal button:hover {
            background-color: #f1c40f;
        }
"""
if "#item-modal {" not in html_content:
    html_content = html_content.replace('</style>', css_to_add + '</style>')

# Add HTML for item modal
modal_html = """
    <!-- 物品详情弹窗 -->
    <div id="item-modal">
        <h3 id="item-modal-title">物品名称</h3>
        <p id="item-modal-desc">物品描述细节</p>
        <button onclick="closeItemDetails()">关闭</button>
    </div>
"""
if 'id="item-modal"' not in html_content:
    html_content = html_content.replace('</body>', modal_html + '\n</body>')

with open(html_path, "w", encoding="utf-8") as f:
    f.write(html_content)

print("Patch applied for interactive inventory items.")
