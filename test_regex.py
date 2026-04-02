import re

text = "**失去物品：** 机械齿轮"
if re.match(r"^\*\*(?:消耗物品|失去物品)", text):
    print("matched 1!")
else:
    print("failed 1")
    
if re.match(r"^\*\*(?:消耗物品|失去物品|获得线索|状态|获得状态|获得物品|获得奖励|线索|状态更新|奖励：|物品：|提示：|获得：)", text):
    print("matched 2")
else:
    print("failed 2")
