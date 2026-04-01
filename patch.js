const fs = require('fs');
let c = fs.readFileSync('index.html', 'utf8');

// 1. Add CSS
const p1 = c.indexOf('<style>');
const p2 = c.indexOf('</style>', p1);
const cssPatch = Buffer.from('CiAgICAgICAgQG1lZGlhIHNjcmVlbiBhbmQgKG1heC13aWR0aDogNjAwcHgpIHsKICAgICAgICAgICAgI2dhbWUtY29udGFpbmVyIHsKICAgICAgICAgICAgICAgIHdpZHRoOiAxMDAlOwogICAgICAgICAgICAgICAgbWFyZ2luLXRvcDogMDsKICAgICAgICAgICAgICAgIGJvcmRlci1yYWRpdXM6IDA7CiAgICAgICAgICAgICAgICBoZWlnaHQ6IDEwMHZoOwogICAgICAgICAgICAgICAgcGFkZGluZzogMTBweDsKICAgICAgICAgICAgICAgIGJvcmRlcjogbm9uZTsKICAgICAgICAgICAgfQogICAgICAgICAgICAiaW52ZW50b3J5LXBhbmVsIiB7CiAgICAgICAgICAgICAgICB3aWR0aDogMTAwJTsKICAgICAgICAgICAgICAgIGhlaWdodDogMTAwdmg7CiAgICAgICAgICAgICAgICB0b3A6IDA7CiAgICAgICAgICAgICAgICBsZWZ0OiAxMDAlOwogICAgICAgICAgICAgICAgdHJhbnNmb3JtOiBub25lOwogICAgICAgICAgICAgICAgdHJhbnNpdGlvbjogbGVmdCAwLjNzIGVhc2UtaW4tb3V0OwogICAgICAgICAgICAgICAgYm9yZGVyLXJhZGl1czogMDsKICAgICAgICAgICAgfQogICAgICAgICAgICAiLmludmVudG9yeS1wYW5lbC5vcGVuIiB7CiAgICAgICAgICAgICAgICBsZWZ0OiAwOwogICAgICAgICAgICB9CiAgICAgICAgfQogICAgICAgICJuYXYtYnV0dG9ucyIgeyBkaXNwbGF5OiBmbGV4OyBnYXA6IDEwcHg7IH0KICAgICAgICAibmF2LWJ0biIgeyBiYWNrZ3JvdW5kOiB0cmFuc3BhcmVudDsgY29sb3I6IHZhcigtLWFjY2VudC1jb2xvcik7IGJvcmRlcjogMXB4IHNvbGlkIHZhcigtLWFjY2VudC1jb2xvcik7IHBhZGRpbmc6IDVweCAxMHB4OyBjdXJzb3I6IHBvaW50ZXI7IGJvcmRlci1yYWRpdXM6IDNweDsgfQogICAgICAgICJuYXYtYnRuOmhvdmVyIiB7IGJhY2tncm91bmQ6IHJnYmEoMjEyLCAxNzUsIDU1LCAwLjEpOyB9CiAgICAgICAgIi5pbnYtc2VjdGlvbiIgeyBtYXJnaW4tYm90dG9tOiAxNXB4OyB9CiAgICAgICAgIi5lbXB0eS10ZXh0IiB7IGNvbG9yOiAjNzc3OyBmb250LXN0eWxlOiBpdGFsaWM7IH0KICAgICAgICAiLmludi1pdGVtIiB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgYmFja2dyb3VuZDogIzMzMzsgcGFkZGluZzogNHB4IDhweDsgbWFyZ2luOiAzcHg7IGJvcmRlci1yYWRpdXM6IDNweDsgY29sb3I6ICNkNGQ0ZDQ7IH0KICAgICAgICAiLmJhZGdlIiB7IGRpc3BsYXk6IGlubGluZS1ibG9jazsgYmFja2dyb3VuZDogdmFyKC0tYWNjZW50LWNvbG9yKTsgY29sb3I6ICMxMTE7IHBhZGRpbmc6IDJweCA2cHg7IGJvcmRlci1yYWRpdXM6IDEwcHg7IGZvbnQtc2l6ZTogMC44ZW07IG1hcmdpbi1sZWZ0OjVweDsgfQogICAgICAgici5hY2hpZXZlbWVudCIgeyBjb2xvcjogI2VhZDY3ZDsgZm9udC13ZWlnaHQ6IGJvbGQ7IH0KICAgICAgICAubWVkYWwgeyBjb2xvcjogI2NkYWUzYTsgZm9udC13ZWlnaHQ6IDEwMDsgfQogICAg', 'base64').toString('utf8').replace(/"/g, '');
c = c.slice(0, p2) + cssPatch + "\n" + c.slice(p2);

// 2. Replace header
let h1 = c.indexOf('<div id="header">');
let h2 = c.indexOf('</div>', c.indexOf('<p>', h1)) + 6;
let headerPatch = `<div id="header" style="display:flex; justify-content:space-between; align-items:center;">
    <div>
        <h1 style="margin:0;">幽暗庄园的秘密</h1>
        <p style="margin:5px 0 0 0;font-size:0.9em;color:#aaa;">探索每个房间，寻找线索，解开谜题</p>
    </div>
    <div class="nav-buttons">
        <button class="nav-btn" onclick="returnToHall()">返回大厅</button>
        <button id="inventory-btn" class="nav-btn" onclick="toggleInventory()">背包</button>
    </div>
</div>`;
c = c.slice(0, h1) + headerPatch + c.slice(h2);

// 3. Replace Inventory Panel HTML
let i1 = c.indexOf('<div id="inventory-panel"');
let i2 = c.indexOf('</div>', c.indexOf('</div>', c.indexOf('</div>', i1))+1)+6;
// find the correct close for inventory panel (we know the tag `<div id="inventory-panel"` opens, but how many divs close?)
// Let's just find `<div class="overlay"` and replace from inventory-panel to right before <script>
let s1 = c.indexOf('<script>');
let real_i2 = c.lastIndexOf('</div>', s1) + 6;

let invPatch = `<div id="inventory-panel" class="inventory-panel">
    <div class="inv-header">
        <h2><span class="icon">🎒</span> 背包</h2>
        <button id="closeInv" class="close-btn" onclick="toggleInventory()">&times;</button>
    </div>
    <div class="inv-content">
        <div class="inv-section">
            <div class="section-header"><span class="icon">🗡️</span> 道具</div>
            <div id="inv-items" class="inv-list"><span class="empty-text">无</span></div>
        </div>
        <div class="inv-section">
            <div class="section-header"><span class="icon">🔍</span> 线索</div>
            <div id="inv-clues" class="inv-list"><span class="empty-text">无</span></div>
        </div>
        <div class="inv-section">
            <div class="section-header"><span class="icon">🏅</span> 徽章(<span id="medal-count">0</span>)</div>
            <div id="inv-medals" class="inv-list"><span class="empty-text">无</span></div>
        </div>
        <div class="inv-section">
            <div class="section-header"><span class="icon">🏆</span> 成就
                <span class="badge">轮回(<span id="ng-count">0</span>)</span>
                <span class="badge">结局(<span id="ending-count">0</span>)</span>
            </div>
            <div id="inv-achievements" class="inv-list"><span class="empty-text">无</span></div>
        </div>
    </div>
</div>`;
c = c.slice(0, i1) + invPatch + "\n" + c.slice(real_i2);

// 4. Inject Logic 
let f1 = c.indexOf('window.toggleInventory');
let f2 = c.indexOf('window.saveGame');
let toggleLogic = `window.toggleInventory = function() {
    const dialog = document.getElementById('inventory-panel');
    const overlay = document.getElementById('overlay');
    
    // Check if we are opening or closing
    const isOpen = dialog.classList.contains('open');
    if (isOpen) {
        dialog.classList.remove('open');
        overlay.style.display = 'none';
        return;
    } 

    const invItems = document.getElementById("inv-items");
    const invClues = document.getElementById("inv-clues");
    const medalCountSpan = document.getElementById("medal-count");
    const invMedals = document.getElementById("inv-medals");
    let itemsHtml = "";
    let cluesHtml = "";
    let medalsCount = 0;
    let medalsHtml = "";
    for (let i = 0; i < gameState.inventory.length; i++) {
        const item = gameState.inventory[i];
        if (item.startsWith("[道具]")) {
            itemsHtml += "<span class='inv-item'>" + item.replace("[道具]", "").trim() + "</span> ";
        } else if (item.startsWith("[线索]")) {
            cluesHtml += "<span class='inv-item'>" + item.replace("[线索]", "").trim() + "</span> ";
        } else if (item.startsWith("【徽章】")) {
            medalsCount++;
            medalsHtml += "<span class='inv-item medal'>" + item.replace("【徽章】", "").trim() + "</span> ";
        }
    }
    if (invItems) invItems.innerHTML = itemsHtml ? itemsHtml : "<span class='empty-text'>无</span>";
    if (invClues) invClues.innerHTML = cluesHtml ? cluesHtml : "<span class='empty-text'>无</span>";
    if (medalCountSpan) medalCountSpan.innerText = medalsCount;
    if (invMedals) invMedals.innerHTML = medalsHtml ? medalsHtml : "<span class='empty-text'>无</span>";

    const ngCountSpan = document.getElementById("ng-count");
    const endingCountSpan = document.getElementById("ending-count");
    const invAch = document.getElementById("inv-achievements");
    
    if (ngCountSpan) ngCountSpan.innerText = globalState.playCount || 0;
    
    let reachedEndings = globalState.endingsReached || [];
    let uniqueEndings = new Set(reachedEndings).size;
    
    if (endingCountSpan) endingCountSpan.innerText = uniqueEndings;
    
    if (invAch) {
        let achHtml = "";
        let uniqueArr = Array.from(new Set(reachedEndings));
        for(let i = 0; i < uniqueArr.length; i++) {
            let e = uniqueArr[i];
            achHtml += "<div class='inv-item achievement' style='display:block;margin-bottom:5px;'>><span class='icon'>✨</span> 解锁: " + e + "</div>";
        }
        if(achHtml === "") achHtml = "<span class='empty-text'>暂无成就</span>";
        invAch.innerHTML = achHtml;
    }
    dialog.classList.add('open');
    overlay.style.display = 'block';
}

function returnToHall() {
    if (gameState.currentSceneId === 'hall_main' || gameState.currentSceneId === 'hall_initial_enter') {
        alert('你已经在门厅了。');
        return;
    }
    renderScene('hall_main');
}

`;
c = c.slice(0, f1) + toggleLogic + c.slice(f2);
fs.writeFileSync('index.html', c);
console.log('Done!');