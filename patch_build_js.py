with open("build_js_all.py", "r", encoding="utf-8") as f:
    text = f.read()

# Patch 1: skip lines starting with 以下是对 or #
old_cond = """            if raw.startswith("条件：") or raw.startswith("---") or raw.startswith("##"):
                continue"""
new_cond = """            if raw.startswith("条件：") or raw.startswith("---") or raw.startswith("##") or raw.startswith("#") or raw.startswith("以下是对"):
                continue"""

if old_cond in text:
    text = text.replace(old_cond, new_cond)
    with open("build_js_all.py", "w", encoding="utf-8") as f:
        f.write(text)
    print("Patched build_js_all.py")
else:
    print("Could not find old_cond in build_js_all.py")
