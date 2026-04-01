const fs = require('fs');

let content = fs.readFileSync('index.html', 'utf8');

const targetFunc = 'function updateInventoryDisplay()';
const startIdx = content.indexOf(targetFunc);
if (startIdx !== -1) {
    const endIdx = content.indexOf('function returnToHall', startIdx);
    if (endIdx !== -1) {
        const scriptToAdd = `function updateInventoryDisplay() {
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
    
    if (ngCountSpan) ngCountSpan.innerText = globalState.playthroughs || 0;
    
    let reachedEndings = globalState.endingsReached || [];
    let uniqueEndings = new Set(reachedEndings).size;
    
    if (endingCountSpan) endingCountSpan.innerText = uniqueEndings;
    
    if (invAch) {
        let achHtml = "";
        let uniqueArr = Array.from(new Set(reachedEndings));
        for(let i = 0; i < uniqueArr.length; i++) {
            let e = uniqueArr[i];
            let e_name = e.replace("ending_", "");
            if (e_name === "normal") e_name = "梦境的终结(大结局)";
            achHtml += "<div class='inv-item achievement' style='display:block;margin-bottom:5px;'><span class='icon'>✨</span> 解锁结局: " + e_name + "</div>";
        }
        if(achHtml === "") achHtml = "<span class='empty-text'>无成就</span>";
        invAch.innerHTML = achHtml;
    }
}
`;
        content = content.substring(0, startIdx) + scriptToAdd + '\n' + content.substring(endIdx);
        fs.writeFileSync('index.html', content);
        console.log('Successfully patched JavaScript logic');
    } else {
        console.log('Could not find function returnToHall');
    }
}
