// 额外的谜题场景模块
const extraPuzzles = {
  // 新增谜题：镜像谜题
  "puzzle_mirror": {
    desc: `你在一个房间里发现了一面古老的镜子，镜子上刻着一行字："真相就在你的倒影中。"

当你看向镜子时，你发现镜子中的你做出了与你相反的动作。你意识到这是一个镜像谜题。`,
    options: [
      { text: "尝试触摸镜子", target: "puzzle_mirror_touch" },
      { text: "研究镜子上的刻字", target: "puzzle_mirror_inspect" },
      { text: "返回大厅", target: "hall_main" }
    ]
  },
  
  "puzzle_mirror_touch": {
    desc: `当你触摸镜子时，你感到一股力量将你拉向镜子。你穿过镜子，发现自己进入了一个镜像世界。

在这个世界里，一切都是颠倒的。你需要找到返回现实世界的方法。`,
    options: [
      { text: "探索镜像世界", target: "puzzle_mirror_world" },
      { text: "尝试再次穿过镜子", target: "puzzle_mirror_return" }
    ]
  },
  
  "puzzle_mirror_inspect": {
    desc: `你仔细研究镜子上的刻字，发现刻字的排列方式似乎暗示着某种密码。

刻字的排列是：T R U T H
                H T U R
                R U T H
                T H R U`,
    options: [
      { text: "输入密码：TRUTH", target: "puzzle_mirror_correct" },
      { text: "输入密码：HTRU", target: "puzzle_mirror_wrong" },
      { text: "返回大厅", target: "hall_main" }
    ]
  },
  
  "puzzle_mirror_world": {
    desc: `你在镜像世界中探索，发现了一个与现实世界相似但颠倒的环境。你看到一个宝箱，上面有一个锁。

锁上刻着："只有真正了解自己的人才能打开。"`,
    options: [
      { text: "尝试打开宝箱", target: "puzzle_mirror_chest" },
      { text: "返回现实世界", target: "puzzle_mirror_return" }
    ]
  },
  
  "puzzle_mirror_chest": {
    desc: `当你尝试打开宝箱时，宝箱发出了光芒，里面放着一面小镜子和一张纸条。

纸条上写着："这面镜子将帮助你找到回家的路。"`,
    options: [
      { text: "拿起小镜子和纸条", target: "puzzle_mirror_reward" },
      { text: "返回现实世界", target: "puzzle_mirror_return" }
    ]
  },
  
  "puzzle_mirror_reward": {
    on_enter: () => {
      let msg = "";
      msg += addItem("镜像碎片");
      msg += addClue("镜像谜题的秘密：有时候，我们需要从不同的角度看问题");
      return msg;
    },
    desc: `你获得了镜像碎片和关于镜像谜题的线索。
这面镜子看起来具有特殊的力量。`,
    options: [
      { text: "返回现实世界", target: "puzzle_mirror_return" }
    ]
  },
  
  "puzzle_mirror_return": {
    desc: `你成功返回了现实世界。这次经历让你对自己有了更深刻的认识。`,
    options: [
      { text: "返回大厅", target: "hall_main" }
    ]
  },
  
  "puzzle_mirror_correct": {
    desc: `你输入了正确的密码！镜子发出了金色的光芒，一个隐藏的暗格打开了，里面放着一面魔法镜子和一张纸条。

纸条上写着："恭喜你解开了镜像谜题，这面镜子将帮助你看到真相。"`,
    options: [
      { text: "拿起魔法镜子和纸条", target: "puzzle_mirror_magic_reward" },
      { text: "返回大厅", target: "hall_main" }
    ]
  },
  
  "puzzle_mirror_magic_reward": {
    on_enter: () => {
      let msg = "";
      msg += addItem("魔法镜子");
      msg += addClue("镜像谜题的秘密：真相往往隐藏在表面之下");
      return msg;
    },
    desc: `你获得了魔法镜子和关于镜像谜题的线索。
这面镜子看起来可以看到普通镜子看不到的东西。`,
    options: [
      { text: "返回大厅", target: "hall_main" }
    ]
  },
  
  "puzzle_mirror_wrong": {
    desc: `你输入的密码不正确，镜子发出了红色的光芒，然后恢复了原状。
你需要重新思考...`,
    options: [
      { text: "重新尝试", target: "puzzle_mirror_inspect" },
      { text: "返回大厅", target: "hall_main" }
    ]
  }
};

export default extraPuzzles;