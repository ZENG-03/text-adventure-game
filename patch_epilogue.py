import re
import os

game_scenes_path = "js/game-scenes.js"

with open(game_scenes_path, "r", encoding="utf-8") as f:
    content = f.read()

# 1. Update ending 5 to point to epilogue
new_option = """
      options: [
          { text: "时光荏苒，一年以后...（进入日谈）", target: "epilogue_true_end" }
      ]
"""
content = re.sub(r'options:\s*\[\s*\{\s*text:\s*"[^\"]*重新步入轮回[^\"]*",\s*target:\s*"title"\s*\}\s*\](?=\s*\};?\s*scenes\["ending_6_forgotten"\])', new_option, content, count=1)

# 2. Add the epilogue scene
epilogue_scene = """
  scenes["epilogue_true_end"] = {
      on_enter: () => {
          return "";
      },
      desc: `距离你解开谜语馆的秘密，已经过去了一整年。

那座隐藏在山谷中的庄园，如今已经成为了世界闻名的“阿斯特纪念博物馆与画廊”。你将所有的手稿、画作与乐谱妥善保管并向公众开放。那些曾经被尘封的天才与爱恨，终于在世人的注视下得以重见天日，不再是一段寂寞的独白。那段纠缠、痴狂且跨越了几十年的迷失，画上了一个温和的句号。

清晨，你正坐在侦探事务所的书桌前轻抿咖啡，翻看着最新出版的《第七交响曲：未完成》初版修订本复印件。这首曾被厄运笼罩的绝唱，如今不仅在维也纳的顶尖音乐大厅由一流乐团重新演奏，甚至在全球引起了巨大的音乐轰动。

突然，一阵敲门声打断了你的思绪。

你打开门，空荡荡的走廊里并没有人。门前的地毯上只放着一个没有任何署名与邮戳的精美小金属匣。就在你将它拾起的瞬间，匣子的表面弹开了一道极其精密的双金属螺旋锁槽，透出一抹如同深海一般幽邃的蔚蓝色流光。

匣子的底端刻着一行小字：“这是伊莲娜尚未画出的颜色。”

你微微一笑，将匣子捧在手中，感受到了其中轻微却极富生命力的震动——就像微弱的心跳，正在等待你去解开它的最后束缚。

管家奥尔德斯曾经说过，“谜语的最终意义不是答案，而是提问的过程”。

看起来，新的谜题又要开始了。

【 游 戏 结 束 —— 感 谢 您 的 游 玩 】
再次感谢你在《谜语遗产：七重谜域》中的坚持与探索。愿你在现实的旅台中，也永远保持这般无畏与好奇。`,
      options: [
          { text: "带着回忆返回标题界面，或者重温新的旅程", target: "title" }
      ]
  };

"""

# Insert epilogue before ending_6
if "scenes[\"epilogue_true_end\"]" not in content:
    content = content.replace('scenes["ending_6_forgotten"] = {', epilogue_scene + 'scenes["ending_6_forgotten"] = {')

with open(game_scenes_path, "w", encoding="utf-8") as f:
    f.write(content)

print("Patch applied for post-ending epilogue.")
