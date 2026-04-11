// 场景注册表：映射场景ID到对应的模块路径
const sceneRegistry = {
  // 核心场景
  'title': () => import('./core/title.js'),
  'start': () => import('./core/title.js'),
  'start_ng_plus': () => import('./core/title.js'),
  'hall_main': () => import('./core/hall.js'),
  'hall_initial_enter': () => import('./core/hall.js'),
  'hall_history': () => import('./core/hall.js'),
  'hall_fireplace': () => import('./core/hall.js'),
  'ending_1': () => import('./core/endings.js'),
  'ending_2': () => import('./core/endings.js'),
  'ending_3': () => import('./core/endings.js'),
  'ending_4': () => import('./core/endings.js'),
  'ending_5': () => import('./core/endings.js'),
  'sys_room_exit_transition': () => import('./core/transitions.js'),
  'sys_side_story_1_trigger': () => import('./core/transitions.js'),
  'sys_side_story_2_trigger': () => import('./core/transitions.js'),
  'sys_side_story_3_trigger': () => import('./core/transitions.js'),
  'sys_side_story_4_trigger': () => import('./core/transitions.js'),
  // 图书馆场景
  'library_entry': () => import('./rooms/library.js'),
  'library_astrolabe': () => import('./rooms/library.js'),
  'library_books': () => import('./rooms/library.js'),
  // 音乐室场景
  'musicroom_entry': () => import('./rooms/musicroom.js'),
  'musicroom_piano': () => import('./rooms/musicroom.js'),
  'musicroom_phonograph': () => import('./rooms/musicroom.js'),
  'musicroom_books': () => import('./rooms/musicroom.js'),
  'musicroom_notes': () => import('./rooms/musicroom.js'),
  'musicroom_pedal': () => import('./rooms/musicroom.js'),
  'musicroom_puzzle_notes': () => import('./rooms/musicroom.js'),
  'musicroom_puzzle_success': () => import('./rooms/musicroom.js'),
  // 温室花房场景
  'greenhouse_entry': () => import('./rooms/greenhouse.js'),
  'greenhouse_fountain': () => import('./rooms/greenhouse.js'),
  'greenhouse_flowers': () => import('./rooms/greenhouse.js'),
  'greenhouse_puzzle_plants': () => import('./rooms/greenhouse.js'),
  'greenhouse_puzzle_success': () => import('./rooms/greenhouse.js'),
  // 画室场景
  'studio_entry': () => import('./rooms/studio.js'),
  'studio_painting': () => import('./rooms/studio.js'),
  'studio_puzzle_colors': () => import('./rooms/studio.js'),
  'studio_puzzle_success': () => import('./rooms/studio.js'),
  // 地下室场景
  'basement_entry': () => import('./rooms/basement.js'),
  'basement_altar': () => import('./rooms/basement.js'),
  'basement_puzzle_runes': () => import('./rooms/basement.js'),
  'basement_puzzle_success': () => import('./rooms/basement.js'),
  // 钟楼场景
  'clocktower_entry': () => import('./rooms/clocktower.js'),
  'clocktower_mechanism': () => import('./rooms/clocktower.js'),
  'clocktower_clocks': () => import('./rooms/clocktower.js'),
  'clocktower_puzzle_time': () => import('./rooms/clocktower.js'),
  'clocktower_puzzle_success': () => import('./rooms/clocktower.js'),
  // 卧室场景
  'bedroom_entry': () => import('./rooms/bedroom.js'),
  'bedroom_portraits': () => import('./rooms/bedroom.js'),
  'bedroom_dresser': () => import('./rooms/bedroom.js'),
  'bedroom_wardrobe': () => import('./rooms/bedroom.js'),
  'bedroom_candle_midnight': () => import('./rooms/bedroom.js'),
  'bedroom_candle_success': () => import('./rooms/bedroom.js'),
  'final_chamber_entry': () => import('./rooms/bedroom.js'),
  // 管家支线
  'side_story_1_start': () => import('./sidequests/butler.js'),
  'clocktower_search': () => import('./sidequests/butler.js'),
  'astor_rescue': () => import('./sidequests/butler.js'),
  // 画中女子支线
  'side_story_2_start': () => import('./sidequests/painting.js'),
  'painting_search_mirror': () => import('./sidequests/painting.js'),
  'painting_use_mirror': () => import('./sidequests/painting.js'),
  // 地下秘密支线
  'side_story_3_start': () => import('./sidequests/underground.js'),
  'underground_search_key': () => import('./sidequests/underground.js'),
  'underground_use_key': () => import('./sidequests/underground.js'),
  'underground_explore': () => import('./sidequests/underground.js'),
  // 未完成的交响曲支线
  'side_story_4_start': () => import('./sidequests/music.js'),
  'music_search_items': () => import('./sidequests/music.js'),
  'music_complete': () => import('./sidequests/music.js'),
  'side_ask_butler_elenor': () => import('./sidequests/music.js'),
  'side_symphony_details': () => import('./sidequests/music.js'),
  'side_piano_stool': () => import('./sidequests/music.js'),
  'side_brooch_clue': () => import('./sidequests/music.js'),
  'side_fireplace_secret': () => import('./sidequests/music.js'),
  'side_elenor_diary': () => import('./sidequests/music.js'),
  'side_play_elenor_violin': () => import('./sidequests/music.js'),
  'side_symphony_complete': () => import('./sidequests/music.js'),
  'side_ending_music_public': () => import('./sidequests/music.js'),
  'side_ending_music_keep': () => import('./sidequests/music.js'),
  'side_music_final_mechanism': () => import('./sidequests/music.js'),
  
  // 谜题示例场景
  'puzzle_item_submission': () => import('./puzzle-examples.js'),
  'puzzle_item_success': () => import('./puzzle-examples.js'),
  'puzzle_text_input': () => import('./puzzle-examples.js'),
  'puzzle_text_success': () => import('./puzzle-examples.js'),
  'puzzle_combine': () => import('./puzzle-examples.js'),
  'puzzle_combine_success': () => import('./puzzle-examples.js'),
  'puzzle_sorting': () => import('./puzzle-examples.js'),
  'puzzle_sorting_success': () => import('./puzzle-examples.js'),
  'puzzle_memory': () => import('./puzzle-examples.js'),
  'puzzle_memory_success': () => import('./puzzle-examples.js'),
  'puzzle_slider': () => import('./puzzle-examples.js'),
  'puzzle_slider_success': () => import('./puzzle-examples.js'),
  'puzzle_rhythm': () => import('./puzzle-examples.js'),
  'puzzle_rhythm_success': () => import('./puzzle-examples.js'),
  'hidden_room': () => import('./puzzle-examples.js'),
  'read_document': () => import('./puzzle-examples.js'),
  'hidden_passage': () => import('./puzzle-examples.js'),
  'wear_ring': () => import('./puzzle-examples.js'),
  'examine_mechanism': () => import('./puzzle-examples.js'),
  'read_music': () => import('./puzzle-examples.js'),
  'puzzle_mirror': () => import('./puzzle-examples.js'),
  'puzzle_mirror_touch': () => import('./puzzle-examples.js'),
  'puzzle_mirror_inspect': () => import('./puzzle-examples.js'),
  'puzzle_mirror_world': () => import('./puzzle-examples.js'),
  'puzzle_mirror_chest': () => import('./puzzle-examples.js'),
  'puzzle_mirror_reward': () => import('./puzzle-examples.js'),
  'puzzle_mirror_return': () => import('./puzzle-examples.js'),
  'puzzle_mirror_correct': () => import('./puzzle-examples.js'),
  'puzzle_mirror_magic_reward': () => import('./puzzle-examples.js'),
  'puzzle_mirror_wrong': () => import('./puzzle-examples.js'),
  'puzzle_number_sequence': () => import('./puzzle-examples.js'),
  'puzzle_number_success': () => import('./puzzle-examples.js'),
  'puzzle_word_riddle': () => import('./puzzle-examples.js'),
  'puzzle_word_success': () => import('./puzzle-examples.js'),
  'puzzle_item_combination': () => import('./puzzle-examples.js'),
  'puzzle_combination_success': () => import('./puzzle-examples.js'),
  'puzzle_logic': () => import('./puzzle-examples.js'),
  'puzzle_logic_success': () => import('./puzzle-examples.js'),
  // 支线场景
  'side_story_1_start': () => import('./side-stories.js'),
  'side_story_1_move_rock': () => import('./side-stories.js'),
  'side_story_1_find_tool': () => import('./side-stories.js'),
  'side_story_1_enter_cellar': () => import('./side-stories.js'),
  'side_story_1_check_box': () => import('./side-stories.js'),
  'side_story_1_explore_cellar': () => import('./side-stories.js'),
  'side_story_1_find_key': () => import('./side-stories.js'),
  'side_story_1_open_box': () => import('./side-stories.js'),
  'side_cellar_wall': () => import('./side-stories.js'),
  'side_cellar_diary': () => import('./side-stories.js'),
  'side_ending_master': () => import('./side-stories.js'),
  'side_story_2_start': () => import('./side-stories.js'),
  'side_story_2_follow_cat': () => import('./side-stories.js'),
  'side_story_2_find_owner': () => import('./side-stories.js'),
  'side_story_2_check_room': () => import('./side-stories.js'),
  'side_story_2_return_cat': () => import('./side-stories.js'),
  'side_story_3_start': () => import('./side-stories.js'),
  'side_story_3_open_letter': () => import('./side-stories.js'),
  'side_story_3_find_sender': () => import('./side-stories.js'),
  'side_story_3_talk_scholar': () => import('./side-stories.js'),
  // 结局场景
  'ending_5_truth': () => import('./core/endings.js'),
  'ending_6_forgotten': () => import('./core/endings.js'),
  'ending_7_harmony': () => import('./core/endings.js'),
  'ending_8_time': () => import('./core/endings.js'),
  'ending_9_shadow': () => import('./core/endings.js'),
  'ending_10_light': () => import('./core/endings.js'),
  'epilogue_true_end': () => import('./core/endings.js'),
  'ending_true': () => import('./core/endings.js'),
  'ending_false': () => import('./core/endings.js'),
  'ending_giveup': () => import('./core/endings.js'),
  // 图书馆缺失场景
  'library_bookshelves': () => import('./rooms/library.js'),
  'library_protruding_books': () => import('./rooms/library.js'),
  'library_trap_needle': () => import('./rooms/library.js'),
  'library_hidden_passage': () => import('./rooms/library.js'),
  'library_blank_book_reveal': () => import('./rooms/library.js'),
  'library_unlock_stones': () => import('./rooms/library.js'),
  'library_reset_success': () => import('./rooms/library.js'),
  'library_light_tracking': () => import('./rooms/library.js'),
  'library_color_pull': () => import('./rooms/library.js'),
  'library_globe_gap': () => import('./rooms/library.js'),
  'library_astrolabe_calibrate': () => import('./rooms/library.js'),
  'library_combination': () => import('./rooms/library.js'),
  'library_combo_fail': () => import('./rooms/library.js'),
  'library_scholar_order': () => import('./rooms/library.js'),
  'library_check_books': () => import('./rooms/library.js'),
  // 音乐室缺失场景
  'musicroom_piano': () => import('./rooms/musicroom.js'),
  'musicroom_tuning_pins': () => import('./rooms/musicroom.js'),
  'musicroom_tune_with_forks': () => import('./rooms/musicroom.js'),
  'musicroom_tune_by_ear': () => import('./rooms/musicroom.js'),
  'musicroom_fill_score': () => import('./rooms/musicroom.js'),
  'musicroom_ensemble': () => import('./rooms/musicroom.js'),
  'musicroom_autoplayer': () => import('./rooms/musicroom.js'),
  'musicroom_reflectors': () => import('./rooms/musicroom.js'),
  'musicroom_adjust_reflectors': () => import('./rooms/musicroom.js'),
  'musicroom_resonance': () => import('./rooms/musicroom.js'),
  'musicroom_play_full_score': () => import('./rooms/musicroom.js'),
  'musicroom_deafening': () => import('./rooms/musicroom.js'),
  'musicroom_collapse': () => import('./rooms/musicroom.js'),
  'musicroom_organ': () => import('./rooms/musicroom.js'),
  'musicroom_place_keycaps': () => import('./rooms/musicroom.js'),
  'musicroom_use_gear': () => import('./rooms/musicroom.js'),
  'musicroom_place_keycaps_unlocked': () => import('./rooms/musicroom.js'),
  'musicroom_bellows': () => import('./rooms/musicroom.js'),
  'musicroom_lock_bellows': () => import('./rooms/musicroom.js'),
  'musicroom_connect_power': () => import('./rooms/musicroom.js'),
  'musicroom_tune_piano': () => import('./rooms/musicroom.js'),
  'musicroom_instruments': () => import('./rooms/musicroom.js'),
  'musicroom_violin': () => import('./rooms/musicroom.js'),
  'musicroom_instrument_order': () => import('./rooms/musicroom.js'),
  'musicroom_tuning_forks': () => import('./rooms/musicroom.js'),
  'musicroom_reflector_ropes': () => import('./rooms/musicroom.js'),
  'musicroom_painting': () => import('./rooms/musicroom.js'),
  'musicroom_use_crystal': () => import('./rooms/musicroom.js'),
  'musicroom_copy_score': () => import('./rooms/musicroom.js'),
  'musicroom_find_score_parts': () => import('./rooms/musicroom.js'),
  'musicroom_play_instruments_order': () => import('./rooms/musicroom.js'),
  'musicroom_inside': () => import('./rooms/musicroom.js'),
  'musicroom_inspect': () => import('./rooms/musicroom.js'),
  'musicroom_order_by_score': () => import('./rooms/musicroom.js'),
  'musicroom_play_organ': () => import('./rooms/musicroom.js'),
  'musicroom_search_crystal': () => import('./rooms/musicroom.js'),
  // 温室缺失场景
  'greenhouse_flower_beds': () => import('./rooms/greenhouse.js'),
  'greenhouse_plant_seeds': () => import('./rooms/greenhouse.js'),
  'greenhouse_conditions': () => import('./rooms/greenhouse.js'),
  'greenhouse_fireplace': () => import('./rooms/greenhouse.js'),
  'greenhouse_well': () => import('./rooms/greenhouse.js'),
  'greenhouse_fertilize': () => import('./rooms/greenhouse.js'),
  'greenhouse_fan': () => import('./rooms/greenhouse.js'),
  'greenhouse_shades': () => import('./rooms/greenhouse.js'),
  'greenhouse_check_conditions': () => import('./rooms/greenhouse.js'),
  'greenhouse_revive_parts': () => import('./rooms/greenhouse.js'),
  'greenhouse_mix_blood': () => import('./rooms/greenhouse.js'),
  'greenhouse_pond_tool': () => import('./rooms/greenhouse.js'),
  'greenhouse_tree_hole': () => import('./rooms/greenhouse.js'),
  'greenhouse_poison_spore': () => import('./rooms/greenhouse.js'),
  'greenhouse_fan_accident': () => import('./rooms/greenhouse.js'),
  'greenhouse_tree': () => import('./rooms/greenhouse.js'),
  'greenhouse_pond_dip': () => import('./rooms/greenhouse.js'),
  'greenhouse_tool_shed': () => import('./rooms/greenhouse.js'),
  'greenhouse_manual': () => import('./rooms/greenhouse.js'),
  'greenhouse_wooden_box': () => import('./rooms/greenhouse.js'),
  'greenhouse_box_opened': () => import('./rooms/greenhouse.js'),
  'greenhouse_take_tools': () => import('./rooms/greenhouse.js'),
  'greenhouse_collect_plant_parts': () => import('./rooms/greenhouse.js'),
  'greenhouse_hydroponic': () => import('./rooms/greenhouse.js'),
  'greenhouse_clean_pipes': () => import('./rooms/greenhouse.js'),
  'greenhouse_mix_nutrient': () => import('./rooms/greenhouse.js'),
  'greenhouse_fix_pump': () => import('./rooms/greenhouse.js'),
  'greenhouse_basin': () => import('./rooms/greenhouse.js'),
  'greenhouse_pipes': () => import('./rooms/greenhouse.js'),
  'greenhouse_use_fertilizer': () => import('./rooms/greenhouse.js'),
  'greenhouse_check_seeds': () => import('./rooms/greenhouse.js'),
  'greenhouse_nursery': () => import('./rooms/greenhouse.js'),
  // 画室缺失场景
  'studio_palette': () => import('./rooms/studio.js'),
  'studio_palette_pipes': () => import('./rooms/studio.js'),
  'studio_add_water': () => import('./rooms/studio.js'),
  'studio_find_solvent': () => import('./rooms/studio.js'),
  'studio_stained_glass': () => import('./rooms/studio.js'),
  'studio_light_palette': () => import('./rooms/studio.js'),
  'studio_light_mirror': () => import('./rooms/studio.js'),
  'studio_portrait': () => import('./rooms/studio.js'),
  'studio_press_gems': () => import('./rooms/studio.js'),
  'studio_gem_wrong': () => import('./rooms/studio.js'),
  'studio_paint_mirror': () => import('./rooms/studio.js'),
  'studio_fixative': () => import('./rooms/studio.js'),
  'studio_pipe_source': () => import('./rooms/studio.js'),
  'studio_grind_stones': () => import('./rooms/studio.js'),
  'studio_poison_pigment': () => import('./rooms/studio.js'),
  'studio_glass_shard': () => import('./rooms/studio.js'),
  'studio_mirror_trap': () => import('./rooms/studio.js'),
  'studio_arrange_stones': () => import('./rooms/studio.js'),
  'studio_rotate_scale': () => import('./rooms/studio.js'),
  'studio_palette_active': () => import('./rooms/studio.js'),
  'studio_cabinet': () => import('./rooms/studio.js'),
  'studio_password_drawer': () => import('./rooms/studio.js'),
  'studio_drawer_opened': () => import('./rooms/studio.js'),
  'studio_sculpture': () => import('./rooms/studio.js'),
  'studio_gem_correct': () => import('./rooms/studio.js'),
  'studio_paint_mirror_fix': () => import('./rooms/studio.js'),
  'studio_paint_portrait': () => import('./rooms/studio.js'),
  'studio_mix': () => import('./rooms/studio.js'),
  'studio_cabinet_open': () => import('./rooms/studio.js'),
  'studio_sketches': () => import('./rooms/studio.js'),
  // 地下室缺失场景
  'basement_altar_use_dew': () => import('./rooms/basement.js'),
  'basement_altar_blood_attempt': () => import('./rooms/basement.js'),
  'basement_alchemy_table': () => import('./rooms/basement.js'),
  'basement_read_notes': () => import('./rooms/basement.js'),
  'basement_distillation': () => import('./rooms/basement.js'),
  'basement_balance': () => import('./rooms/basement.js'),
  'basement_vials': () => import('./rooms/basement.js'),
  'basement_furnace': () => import('./rooms/basement.js'),
  'basement_open_furnace': () => import('./rooms/basement.js'),
  'basement_force_furnace': () => import('./rooms/basement.js'),
  'basement_rune_stones': () => import('./rooms/basement.js'),
  'basement_activate_stones': () => import('./rooms/basement.js'),
  'basement_stone_trap': () => import('./rooms/basement.js'),
  'basement_find_metals': () => import('./rooms/basement.js'),
  'basement_smelt_essence': () => import('./rooms/basement.js'),
  'basement_place_essence': () => import('./rooms/basement.js'),
  'basement_altar_direct': () => import('./rooms/basement.js'),
  'basement_elemental_activation': () => import('./rooms/basement.js'),
  'basement_poison_gas': () => import('./rooms/basement.js'),
  'basement_furnace_explosion': () => import('./rooms/basement.js'),
  'basement_rune_curse': () => import('./rooms/basement.js'),
  // 钟楼缺失场景
  'clocktower_workbench': () => import('./rooms/clocktower.js'),
  'clocktower_tools': () => import('./rooms/clocktower.js'),
  'clocktower_gear_room': () => import('./rooms/clocktower.js'),
  'clocktower_find_handle': () => import('./rooms/clocktower.js'),
  'clocktower_turn_by_hand': () => import('./rooms/clocktower.js'),
  'clocktower_observe_hands': () => import('./rooms/clocktower.js'),
  'clocktower_match_rhythm': () => import('./rooms/clocktower.js'),
  'clocktower_calibration': () => import('./rooms/clocktower.js'),
  'clocktower_calibration_success': () => import('./rooms/clocktower.js'),
  'clocktower_calibration_fail': () => import('./rooms/clocktower.js'),
  'clocktower_shadow': () => import('./rooms/clocktower.js'),
  'clocktower_shadow_solution': () => import('./rooms/clocktower.js'),
  'clocktower_lever_midnight': () => import('./rooms/clocktower.js'),
  'clocktower_lever_early': () => import('./rooms/clocktower.js'),
  'clocktower_trap_room': () => import('./rooms/clocktower.js'),
  'clocktower_inspect': () => import('./rooms/clocktower.js'),
  'clocktower_escape': () => import('./rooms/clocktower.js'),
  'clocktower_death_gear': () => import('./rooms/clocktower.js'),
  'clocktower_death_fall': () => import('./rooms/clocktower.js'),
  'clocktower_death_trap': () => import('./rooms/clocktower.js'),
  // 卧室缺失场景
  'bedroom_diary': () => import('./rooms/bedroom.js'),
  'bedroom_dressing_table': () => import('./rooms/bedroom.js'),
  'bedroom_mirror_delay': () => import('./rooms/bedroom.js'),
  'bedroom_bed': () => import('./rooms/bedroom.js'),
  'bedroom_closet': () => import('./rooms/bedroom.js'),
  'bedroom_closet_lock': () => import('./rooms/bedroom.js'),
  'bedroom_window': () => import('./rooms/bedroom.js'),
  'bedroom_midnight_fountain': () => import('./rooms/bedroom.js'),
  'bedroom_telescope': () => import('./rooms/bedroom.js'),
  'bedroom_painting': () => import('./rooms/bedroom.js'),
  'bedroom_mirror_reflection': () => import('./rooms/bedroom.js'),
  'bedroom_color_light': () => import('./rooms/bedroom.js'),
  'bedroom_answer_correct': () => import('./rooms/bedroom.js'),
  'bedroom_answer_wrong': () => import('./rooms/bedroom.js'),
  'bedroom_closet_back': () => import('./rooms/bedroom.js'),
  'bedroom_rune_solution': () => import('./rooms/bedroom.js'),
  'bedroom_direct_painting': () => import('./rooms/bedroom.js'),
  'bedroom_box_correct': () => import('./rooms/bedroom.js'),
  'bedroom_box_trap': () => import('./rooms/bedroom.js'),
  'bedroom_mirror_curse': () => import('./rooms/bedroom.js'),
  'bedroom_fall': () => import('./rooms/bedroom.js'),
  'bedroom_break_mirror': () => import('./rooms/bedroom.js'),
  'bedroom_question': () => import('./rooms/bedroom.js')
}

// 缓存已加载的场景对象
const sceneCache = new Map()

/**
 * 加载场景
 * @param {string} sceneId - 场景ID
 * @param {object} store - store实例（可选）
 * @returns {Promise<object>} 场景对象
 */
export async function loadScene(sceneId, store) {
  if (sceneCache.has(sceneId)) {
    return sceneCache.get(sceneId)
  }
  
  const loader = sceneRegistry[sceneId]
  if (!loader) {
    console.warn(`Scene ${sceneId} not registered, fallback to placeholder`)
    return getPlaceholderScene(sceneId)
  }
  
  try {
    const module = await loader()
      let scene = (module.default && module.default[sceneId]) || module[sceneId]; if(!scene){ scene = getPlaceholderScene(sceneId) } if (scene.on_enter) {
      const originalOnEnter = scene.on_enter
      scene.on_enter = () => originalOnEnter(store)
    }
    
    // 处理选项中的条件函数（仅在 options 为数组时处理）
    if (Array.isArray(scene.options)) {
      scene.options = scene.options.map(option => {
        if (!option || typeof option !== 'object') {
          return option
        }
        if (Array.isArray(option.cond)) {
          option.cond = option.cond.map(cond => {
            if (typeof cond === 'function') {
              return () => cond(store)
            }
            return cond
          })
        }
        return option
      })
    } else if (scene.options && typeof scene.options !== 'function') {
      scene.options = []
    }
    
    sceneCache.set(sceneId, scene)
    return scene
  } catch (error) {
    console.error(`Failed to load scene ${sceneId}:`, error)
    return getPlaceholderScene(sceneId)
  }
}

/**
 * 获取占位场景
 * @param {string} sceneId - 场景ID
 * @returns {object} 占位场景对象
 */
function getPlaceholderScene(sceneId) {
  return {
    desc: `【场景缺失】${sceneId} 尚在建设中，请返回大厅。`,
    options: [{ text: '返回大厅', target: 'hall_main' }]
  }
}

/**
 * 清除场景缓存
 */
export function clearSceneCache() {
  sceneCache.clear()
}

/**
 * 获取所有注册的场景ID
 * @returns {string[]} 场景ID数组
 */
export function getAllSceneIds() {
  return Object.keys(sceneRegistry)
}


