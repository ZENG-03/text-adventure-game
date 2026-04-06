import re
line = " - 按含义放入收集到的关键信物（只要收集到至少5个便可开启） [前往 final_test_1_correct] [条件：js:['星盘钥匙','机械齿轮','共鸣水晶','神秘颜料','生命之露','符文石','夜莺胸针','银手镯','主人的怀表'].filter(i=>hasItem(i)).length >= 5]"
m = re.match(r'-\s*(.*?)\s*\[前往\s+(.*?)\]\s*(?:\[条件：(.*?)\])?$', line.strip())
if m:
    print(m.groups())
