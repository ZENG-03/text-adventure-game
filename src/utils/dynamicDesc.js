import { useGameStore } from '../store/gameStore';

/**
 * 动态场景描述生成器
 * 每个房间注册一个描述函数，根据状态返回不同段落
 */
export const dynamicDescriptions = {

  // 画室动态描述
  studio_entry: (store) => {
    const descParts = [];
    
    // 基础描述
    descParts.push(`画室位于庄园二层东侧，是一间宽敞明亮的房间。月光透过天窗洒落，照亮了满墙的画作。`);
    
    // 根据支线进度添加细节
    if (store.getFlag('side_painting_completed')) {
      descParts.push(`七幅画作已经完成，色彩鲜艳，仿佛有生命在其中流动。`);
    } else if (store.getFlag('side_painting_triggered')) {
      descParts.push(`七幅画作已经完成，但空气中似乎弥漫着一丝忧伤。`);
    } else {
      descParts.push(`画框上标着不同的颜色名称：赤、橙、黄、绿、青、蓝、紫。但画布都是空白的。`);
    }
    
    // 根据物品添加细节
    if (store.hasItem('银手镯')) {
      descParts.push(`你手腕上的银手镯在月光下微微发光，画中的女子似乎正看着那道银光。`);
    }
    if (store.hasItem('伊莲娜纪念徽章')) {
      descParts.push(`那枚心形徽章在你胸口轻轻震动，仿佛在回应画室里的某种呼唤。`);
    }
    
    // 根据时间添加环境变化
    if (store.run.game_time?.phase === 'night') {
      descParts.push(`月光如水，彩色玻璃窗在地板上投下七色光斑。`);
    } else {
      descParts.push(`阳光透过彩色玻璃窗，在地板上投下斑斓的光影。`);
    }
    
    // 根据好感度添加角色情绪
    const elenaAff = store.profile.character_affection?.elena || 0;
    if (elenaAff >= 5 && store.getFlag('side_painting_completed')) {
      descParts.push(`你隐约听到一声轻柔的叹息，像是有人在说："谢谢你。"`);
    }
    
    return descParts.join('\n\n');
  },

  // 大厅动态描述
  hall_main: (store) => {
    const descParts = [];
    descParts.push(`你站在大厅中央。大厅两侧各立着四座大理石雕像。`);
    
    const medalCount = store.run.medals.length;
    if (medalCount === 0) {
      descParts.push(`壁炉里有烧焦的纸片。通往其他房间的走廊隐约可见。`);
    } else if (medalCount < 7) {
      descParts.push(`壁炉台上摆放着 ${medalCount} 枚徽章，它们散发着柔和的光芒。墙上七幅抽象画中，已有 ${medalCount} 幅显现出清晰的图案。`);
    } else {
      descParts.push(`七枚徽章齐聚，大厅中央的石台发出轰鸣，露出一条螺旋石梯。`);
    }
    
    // 根据管家支线进度
    if (store.getFlag('side_butler_completed')) {
      descParts.push(`管家奥尔德斯站在阴影中，他的眼中似乎多了一丝释然。`);
    } else if (store.getFlag('side_butler_triggered')) {
      descParts.push(`管家不在大厅，壁炉台上压着一张纸条。`);
    }
    
    // 根据时间
    if (store.run.game_time?.phase === 'night') {
      descParts.push(`月光透过高处的彩窗，在大理石地板上投下冷白色的光。`);
    }
    
    return descParts.join('\n\n');
  },

  // 音乐室动态描述
  musicroom_entry: (store) => {
    const descParts = [];
    descParts.push(`音乐室位于庄园一层西侧，穹顶圆形大厅。一架巨大的管风琴矗立在中央。`);
    
    if (store.getFlag('side_music_completed')) {
      descParts.push(`空气中似乎还回荡着埃莉诺的第七交响曲，余音缭绕。`);
    } else if (store.hasItem('埃莉诺的琴弓')) {
      descParts.push(`你手中的琴弓微微颤动，仿佛在催促你演奏什么。`);
    }
    
    if (store.hasItem('共鸣水晶')) {
      descParts.push(`你背包里的共鸣水晶轻轻震动，与管风琴的音管产生共鸣。`);
    }
    
    return descParts.join('\n\n');
  },

  // 地下室动态描述
  basement_entry: (store) => {
    const descParts = [];
    descParts.push(`地下室阴暗潮湿，空气中夹杂着铁锈与泥土的气味。`);
    
    if (store.getFlag('side_underground_completed')) {
      descParts.push(`洞穴入口已被封住，地下的回响已然沉寂。`);
    } else if (store.getFlag('side_underground_triggered')) {
      descParts.push(`墙壁上的裂缝中透出冷风，隐约可以听到敲击声。`);
    }
    
    if (store.hasItem('符文石')) {
      descParts.push(`你手中的符文石微微发热，似乎在指引着什么。`);
    }
    
    return descParts.join('\n\n');
  }
};