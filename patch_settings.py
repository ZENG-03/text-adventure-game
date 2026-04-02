import re

with open("js/game-engine.js", "r", encoding="utf-8") as f:
    text = f.read()

# 1. Update `typeWriterHTML`
old_typeWrite = """function typeWriterHTML(element, htmlString, speed, onComplete) {
    clearInterval(typeWriterInterval);
    element.innerHTML = "";
    isTyping = true;"""

new_typeWrite = """function typeWriterHTML(element, htmlString, speed, onComplete) {
    if (typeof gameSettings !== "undefined" && gameSettings.noAnim) {
        clearInterval(typeWriterInterval);
        element.innerHTML = htmlString;
        isTyping = false;
        element.onclick = null;
        if (onComplete) onComplete();
        return;
    }
    speed = typeof gameSettings !== "undefined" ? gameSettings.typeSpeed : speed;

    clearInterval(typeWriterInterval);
    element.innerHTML = "";
    isTyping = true;"""

text = text.replace(old_typeWrite, new_typeWrite, 1)

# 2. Fix `renderScene("title");` to make sure settings are loaded first.
# Wait, let's just find `// 初始渲染\nrenderScene("title");` and change it.

old_render = """// 初始渲染
renderScene("title");"""

new_render = """// 初始渲染
if (typeof loadSettings === "function") {
    loadSettings();
}
renderScene("title");"""

text = text.replace(old_render, new_render, 1)

with open("js/game-engine.js", "w", encoding="utf-8") as f:
    f.write(text)

print("Patched game-engine.js to use Settings properly!")
