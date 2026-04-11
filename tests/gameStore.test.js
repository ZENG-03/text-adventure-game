// gameStore.test.js
// 测试游戏状态管理的核心功能

// 模拟localStorage
const localStorageMock = (() => {
  let store = {}
  return {
    getItem: jest.fn(key => store[key] || null),
    setItem: jest.fn((key, value) => {
      store[key] = value.toString()
    }),
    clear: jest.fn(() => {
      store = {}
    }),
    removeItem: jest.fn(key => {
      delete store[key]
    })
  }
})()

global.localStorage = localStorageMock

// 模拟showToast
const showToastMock = jest.fn()
global.showToast = showToastMock

// 导入gameStore
import { useGameStore } from '../src/store/gameStore'

describe('Game Store Tests', () => {
  let gameStore

  beforeEach(() => {
    // 重置localStorage
    localStorage.clear()
    // 重置showToast mock
    showToastMock.mockClear()
    // 创建新的store实例
    gameStore = useGameStore()
    // 初始化状态
    gameStore.initNewGame()
  })

  test('addItem should add item to inventory', () => {
    const item = '测试物品'
    const result = gameStore.addItem(item)
    
    expect(gameStore.inventory).toContain(item)
    expect(result).toBe(`<div class="system-message">【获得物品】：${item}</div>`)
  })

  test('addItem should not add duplicate item', () => {
    const item = '测试物品'
    gameStore.addItem(item)
    const result = gameStore.addItem(item)
    
    expect(gameStore.inventory.filter(i => i === item).length).toBe(1)
    expect(result).toBe('')
  })

  test('addItem should handle invalid input', () => {
    const result1 = gameStore.addItem(null)
    const result2 = gameStore.addItem(undefined)
    const result3 = gameStore.addItem(123)
    
    expect(result1).toBe('')
    expect(result2).toBe('')
    expect(result3).toBe('')
  })

  test('removeItem should remove item from inventory', () => {
    const item = '测试物品'
    gameStore.addItem(item)
    const result = gameStore.removeItem(item)
    
    expect(gameStore.inventory).not.toContain(item)
    expect(result).toBe(`<div class="system-message danger-message">【失去物品】：${item}</div>`)
  })

  test('removeItem should return empty string for non-existent item', () => {
    const item = '不存在的物品'
    const result = gameStore.removeItem(item)
    
    expect(result).toBe('')
  })

  test('removeItem should handle invalid input', () => {
    const result1 = gameStore.removeItem(null)
    const result2 = gameStore.removeItem(undefined)
    const result3 = gameStore.removeItem(123)
    
    expect(result1).toBe('')
    expect(result2).toBe('')
    expect(result3).toBe('')
  })

  test('addClue should add clue to collection', () => {
    const clue = '测试线索'
    const result = gameStore.addClue(clue)
    
    expect(gameStore.clues).toContain(clue)
    expect(result).toBe(`<div class="system-message">【获得线索】：${clue}</div>`)
  })

  test('addClue should not add duplicate clue', () => {
    const clue = '测试线索'
    gameStore.addClue(clue)
    const result = gameStore.addClue(clue)
    
    expect(gameStore.clues.filter(c => c === clue).length).toBe(1)
    expect(result).toBe('')
  })

  test('addClue should handle invalid input', () => {
    const result1 = gameStore.addClue(null)
    const result2 = gameStore.addClue(undefined)
    const result3 = gameStore.addClue(123)
    
    expect(result1).toBe('')
    expect(result2).toBe('')
    expect(result3).toBe('')
  })

  test('addMedal should add medal to collection', () => {
    const medal = '测试徽章'
    const result = gameStore.addMedal(medal)
    
    expect(gameStore.medals).toContain(medal)
    expect(gameStore.run.hall_medal_count).toBe(1)
    expect(result).toBe(`<div class="system-message">【获得徽章】：${medal}</div>`)
  })

  test('addMedal should not add duplicate medal', () => {
    const medal = '测试徽章'
    gameStore.addMedal(medal)
    const result = gameStore.addMedal(medal)
    
    expect(gameStore.medals.filter(m => m === medal).length).toBe(1)
    expect(result).toBe('')
  })

  test('addMedal should handle invalid input', () => {
    const result1 = gameStore.addMedal(null)
    const result2 = gameStore.addMedal(undefined)
    const result3 = gameStore.addMedal(123)
    
    expect(result1).toBe('')
    expect(result2).toBe('')
    expect(result3).toBe('')
  })

  test('saveGame should save game state to localStorage', () => {
    const slot = 1
    gameStore.saveGame(slot)
    
    expect(localStorage.setItem).toHaveBeenCalledWith(
      `adventure_save_${slot}`,
      expect.any(String)
    )
  })

  test('loadGame should load game state from localStorage', () => {
    const slot = 1
    const saveData = {
      profile: {
        endings_reached: ['ending_1'],
        play_count: 1,
        achievements: [],
        met_characters: []
      },
      run: {
        current_scene_id: 'hall_main',
        items: ['测试物品'],
        clues: ['测试线索'],
        medals: ['测试徽章'],
        flags: {},
        hall_medal_count: 1
      },
      timestamp: Date.now()
    }
    localStorage.setItem(`adventure_save_${slot}`, JSON.stringify(saveData))
    
    const sceneId = gameStore.loadGame(slot)
    
    expect(sceneId).toBe('hall_main')
    expect(gameStore.profile.endings_reached).toContain('ending_1')
    expect(gameStore.inventory).toContain('测试物品')
    expect(gameStore.clues).toContain('测试线索')
    expect(gameStore.medals).toContain('测试徽章')
  })

  test('getSaves should return list of saves', () => {
    const saveData1 = {
      profile: {},
      run: { current_scene_id: 'hall_main' },
      timestamp: Date.now()
    }
    const saveData2 = {
      profile: {},
      run: { current_scene_id: 'bedroom_entry' },
      timestamp: Date.now() - 3600000
    }
    
    localStorage.setItem('adventure_save_1', JSON.stringify(saveData1))
    localStorage.setItem('adventure_save_2', JSON.stringify(saveData2))
    
    const saves = gameStore.getSaves()
    
    expect(saves.length).toBe(2)
    expect(saves[0].slot).toBe(1)
    expect(saves[0].sceneId).toBe('hall_main')
    expect(saves[1].slot).toBe(2)
    expect(saves[1].sceneId).toBe('bedroom_entry')
  })

  test('deleteSave should remove save from localStorage', () => {
    const slot = 1
    const saveData = {
      profile: {},
      run: {},
      timestamp: Date.now()
    }
    localStorage.setItem(`adventure_save_${slot}`, JSON.stringify(saveData))
    
    gameStore.deleteSave(slot)
    
    expect(localStorage.removeItem).toHaveBeenCalledWith(`adventure_save_${slot}`)
  })
})
