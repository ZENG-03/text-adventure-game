import re

with open("data.py", "r", encoding="utf-8") as f:
    content = f.read()

# 1. replace puzzle markers
content = re.sub(r'\s*\(谜题[一二三四五六七]\)', '', content)
content = re.sub(r'（支线[一二三四五]）', '', content)
content = re.sub(r'\s*\(包含支线关联\)', '', content)

map_text = r"""
[ 庄园简图 ]
     二楼：画室 | 最深处的卧室
     一楼：音乐室 | 大厅 | 温室花房 |书房/图书馆 
  东侧附属：钟楼
   地下：地下室"""

content = content.replace('壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。"""',
                          '壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。' + map_text + '"""')

with open("data.py", "w", encoding="utf-8") as f:
    f.write(content)
print("data.py patched")
