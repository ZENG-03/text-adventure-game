import { useGameStore } from '../store/gameStore';

export const observationPoints = {
  // 画室
  'studio_entry': [
    {
      id: 'studio_cracks',
      text: '你凑近墙壁，发现颜料柜后面的墙皮有几道细微的裂缝，裂缝中透出微弱的光。',
      hint: '也许后面有隐藏空间？',
      unlockFlag: null,
      reward: null
    },
    {
      id: 'studio_palette_stains',
      text: '调色板上有一块干涸的颜料，颜色异常鲜艳。你用手指刮下一点粉末，闻起来有股奇怪的香味。',
      hint: null,
      unlockFlag: 'observed_palette',
      reward: null
    },
    {
      id: 'studio_brush_hair',
      text: '画笔的笔尖夹着一根长长的金色发丝。你轻轻抽出，发丝在月光下闪着光。',
      hint: '这可能是伊莲娜的头发。',
      unlockFlag: null,
      reward: () => {
        const store = useGameStore();
        store.addClue('画室画笔上的金发');
      }
    }
  ],
  // 大厅
  'hall_main': [
    {
      id: 'hall_statue_base',
      text: '你蹲下检查雅典娜雕像的底座，发现底座背面刻着一行小字："智慧生于头，却死于沉默。"',
      hint: '这可能与雕像谜题有关。',
      unlockFlag: null,
      reward: null
    },
    {
      id: 'hall_fireplace_brick',
      text: '壁炉左侧第三块砖似乎有些松动。你试着按了按，没有反应，但能感到后面是空的。',
      hint: '也许需要特定物品或时机。',
      unlockFlag: null,
      reward: null
    }
  ],
  // 音乐室
  'musicroom_entry': [
    {
      id: 'music_piano_inside',
      text: '你打开钢琴盖，发现琴弦上缠着一根白色的丝带，丝带上绣着"E.B."（埃莉诺·布莱克伍德）。',
      hint: null,
      reward: () => {
        const store = useGameStore();
        store.addClue('钢琴中的丝带，埃莉诺的遗物');
      }
    }
  ],
  // 地下室
  'basement_entry': [
    {
      id: 'basement_wall_marks',
      text: '你注意到墙壁上有一些奇怪的划痕，看起来像是某种符号。这些符号与石台上的符文有些相似。',
      hint: '这些划痕可能是某种指引。',
      unlockFlag: null,
      reward: null
    },
    {
      id: 'basement_air_flow',
      text: '你感到有微弱的气流从某个方向吹来。顺着气流的方向，你发现墙角有一个隐蔽的通风口。',
      hint: '通风口后面可能有秘密通道。',
      unlockFlag: null,
      reward: () => {
        const store = useGameStore();
        store.addClue('地下室有隐蔽的通风口');
      }
    }
  ]
};