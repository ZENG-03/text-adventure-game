import glob
import os
import re

for filepath in glob.glob("文本/*.txt"):
    with open(filepath, 'r', encoding='utf-8', errors='replace') as f:
        text = f.read()
    
    orig = text
    
    # "library_success? 但是缺少核心条件? 暂定失败分支" -> "library_success_fail"
    # Actually just replace "library_success?" with "library_fail" ??
    text = re.sub(r'library_success\?[^\]]*', 'library_fail', text)
    
    if text != orig:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(text)
        print(f"Updated {filepath}")
