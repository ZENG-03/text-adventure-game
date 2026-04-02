with open('js/game-engine.js', 'r', encoding='utf-8') as f:
    content = f.read()

new_fn = '''const ITEM_DESCRIPTIONS = {
    "蓝宝石徽章": "第一枚徽章，湛蓝色，表面有细密的星图纹路。",
    "红宝石徽章": "第二枚徽章，深红色，仿佛有一滴凝固的血。",
    "翠绿徽章": "第三枚徽章，翠绿色，触摸时能感到微微的振动。",
    "橙色徽章": "第四枚徽章，橙色，像秋日的落叶。",
    "金色徽章": "第五枚徽章，金色，散发着淡淡的草木香。",
    "紫色徽章": "第六枚徽章，紫色，表面刻着复杂的符文。",
    "彩虹徽章": "第七枚徽章，七色流转，是所有徽章中唯一会发光的。",
    "色彩徽章": "第四枚徽章，彩色。",
    "旋律徽章": "音乐室的徽章。",
    "深渊徽章": "地下室的徽章。",
    "克劳利的日记": "皮质封面，记录着庄园的部分秘密。",
    "机械齿轮": "铜质齿轮，边缘有编号，可用于其他机关。",
    "共鸣水晶": "透明水晶，敲击时会发出纯净的乐音。",
    "神秘颜料": "七色颜料混合而成，可以唤醒枯萎的植物。",
    "生命之露": "一小瓶清澈的液体，散发着草木的清香。",
    "符文石": "黑色石头上刻着古老的符文，微微发热。",
    "星盘钥匙": "铜质圆盘，可嵌入书桌凹槽。",
    "阿斯特的怀表": "停止的怀表，指针指向11:55。",
    "伊莲娜的纪念徽章": "心形彩虹色徽章，背面刻着“永存于画中”。",
    "夜莺胸针": "银质胸针，夜莺的眼睛是红宝石。",
    "埃莉诺的琴弓": "乌木琴弓，弓尾库镶着珍珠母贝。",
    "托马斯的笔记本": "地质学家的考察笔记。",
    "守护者符文": "手背上的银色符文，获得后可封印古老力量。"
};

function updateInventoryDisplay() {
    const invItems = document.getElementById("inv-items");
    const invClues = document.getElementById("inv-clues");
    const medalCountSpan = document.getElementById("medal-count");
    const invMedals = document.getElementById("inv-medals");

    let itemsHtml = "";
    let cluesHtml = "";
    let medalsCount = 0;
    let medalsHtml = "";

    // 过滤重复物品
    let uniqueItems = [...new Set(gameState.items)];

    for (let i = 0; i < uniqueItems.length; i++) {
        let item = uniqueItems[i];
        let rawItem = item.replace("[道具]", "").replace("【徽章】", "").trim();
        let titleAttr = ITEM_DESCRIPTIONS[rawItem] ? " title=\\"" + ITEM_DESCRIPTIONS[rawItem] + "\\" style=\\"cursor:help;\\"" : "";
        
        if (item.startsWith("[道具]")) {
            itemsHtml += "<span class='inv-item'" + titleAttr + ">" + rawItem + "</span> ";
        } else if (item.startsWith("【徽章】") || rawItem.endsWith("徽章")) {
            medalsCount++;
            medalsHtml += "<span class='inv-item medal'" + titleAttr + ">" + rawItem + "</span> ";
        } else {
            itemsHtml += "<span class='inv-item'" + titleAttr + ">" + rawItem + "</span> ";  
        }
    }'''

old_fn = content[content.find('function updateInventoryDisplay() {'):content.find('for (let i = 0; i < gameState.clues.length; i++) {')]
if old_fn:
    with open('js/game-engine.js', 'w', encoding='utf-8') as f:
        f.write(content.replace(old_fn, new_fn))
    print('inventory descriptions updated!')
