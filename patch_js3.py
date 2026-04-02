import re

with open('js/game-engine.js', 'r', encoding='utf-8') as f:
    text = f.read()

settings_js = '''
// =============== 设置系统 (Settings) ===============
let gameSettings = {
    fontSize: 16,
    typeSpeed: 25,
    noAnim: false
};

function loadSettings() {
    const saved = localStorage.getItem("riddle_settings");
    if (saved) {
        try {
            gameSettings = Object.assign(gameSettings, JSON.parse(saved));
        } catch(e) {}
    }
    // Init UI
    const elFs = document.getElementById("setting-fontsize");
    const elTs = document.getElementById("setting-typespeed");
    const elNa = document.getElementById("setting-noanim");
    if (elFs) elFs.value = gameSettings.fontSize;
    if (elTs) elTs.value = gameSettings.typeSpeed;
    if (elNa) elNa.checked = gameSettings.noAnim;
    applySettings(false);
}

function applySettings(save = true) {
    const elFs = document.getElementById("setting-fontsize");
    const elTs = document.getElementById("setting-typespeed");
    const elNa = document.getElementById("setting-noanim");
    
    if (elFs) {
        gameSettings.fontSize = parseInt(elFs.value);
        document.getElementById("fontsize-val").innerText = elFs.value + "px";
        document.body.style.fontSize = elFs.value + "px";
        const storyEl = document.getElementById("story-text");
        if (storyEl) storyEl.style.fontSize = (gameSettings.fontSize + 2) + "px";
    }
    if (elTs) {
        gameSettings.typeSpeed = parseInt(elTs.value);
        document.getElementById("typespeed-val").innerText = elTs.value + "ms";
    }
    if (elNa) {
        gameSettings.noAnim = elNa.checked;
    }
    if (save) {
        localStorage.setItem("riddle_settings", JSON.stringify(gameSettings));
    }
}

function toggleSettings() {
    const panel = document.getElementById("settings-panel");
    if(!panel) return;
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        // hide others
        const inv = document.getElementById("inventory-panel");
        const ach = document.getElementById("achievement-panel");
        if (inv) inv.style.display = "none";
        if (ach) ach.style.display = "none";
        
        loadSettings();
        panel.style.display = "block";
    }
}

document.addEventListener("DOMContentLoaded", loadSettings);
'''

# We also need to patch typeWriterHTML to use `gameSettings.typeSpeed` instead of hardcoded 25.
# And check `gameSettings.noAnim`

p1_old = 'function typeWriterHTML(element, htmlStr, speed, callback) {'
p1_new = '''function typeWriterHTML(element, htmlStr, speed, callback) {
    speed = gameSettings.typeSpeed;
    if (gameSettings.noAnim) speed = 0;'''

if 'loadSettings()' not in text:
    text += '\n' + settings_js
    
if p1_old in text and 'gameSettings.typeSpeed' not in text:
    text = text.replace(p1_old, p1_new)

with open('js/game-engine.js', 'w', encoding='utf-8') as f:
    f.write(text)

print('Settings JS added')
