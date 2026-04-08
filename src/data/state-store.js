/**
 * 状态存储模块
 * 
 * 该模块负责游戏状态的管理，包括：
 * - 存档的加载和保存
 * - 状态的标准化和验证
 * - 状态的修改和查询
 * - 字段别名的处理
 * 
 * 主要功能：
 * - 从localStorage加载存档
 * - 保存存档到localStorage
 * - 创建状态存储对象
 * - 提供状态操作的API
 */

// 存档系统常量
const SCHEMA_VERSION = 1;
const PROFILE_SAVE_VERSION = 4;

// 默认的个人资料状态（跨存档共享）
const DEFAULT_PROFILE_STATE = {
    save_version: PROFILE_SAVE_VERSION,
    play_count: 0,
    endings_reached: [],
    achievements: [],
    visited_options: {} // 记录哪些选项被访问过
};

// 默认的单局游戏状态
const DEFAULT_RUN_STATE = {
    medals: [],
    items: [],
    clues: [],
    flags: {},
    current_scene_id: "title",
    hall_medal_count: 0,
    run_started_at: null,
    last_hall_medal_count: 0,
    hint_levels: {},
    visited_options: []
};

// 字段别名映射
const FIELD_ALIASES = {
    items: ["inventory"],
    flags: ["vars", "variables"],
    clues: ["memories"],
    medals: ["badges"],
    hall_medal_count: ["badge_count", "medal_count"]
};

/**
 * 深拷贝对象
 * @param {any} obj 要拷贝的对象
 * @returns {any} 拷贝后的对象
 */
function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
}

/**
 * 将值转换为整数
 * @param {any} val 要转换的值
 * @param {number} fallback 转换失败时的默认值
 * @returns {number} 转换后的整数
 */
function intValue(val, fallback) {
    const n = Number(val);
    return isNaN(n) ? fallback : n;
}

/**
 * 标准化个人资料状态
 * @param {any} state 原始状态
 * @returns {Object} 标准化后的状态
 */
function normalizeProfileState(state) {
    const result = clone(DEFAULT_PROFILE_STATE);

    if (!state || typeof state !== "object") {
        return result;
    }

    // 合并现有状态
    Object.keys(result).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
            const val = state[key];
            if (Array.isArray(result[key])) {
                result[key] = Array.isArray(val) ? val : [];
            } else if (typeof result[key] === "object") {
                result[key] = typeof val === "object" ? val : {};
            } else if (typeof result[key] === "number") {
                result[key] = intValue(val, 0);
            }
        }
    });

    return result;
}

/**
 * 标准化单局游戏状态
 * @param {any} state 原始状态
 * @returns {Object} 标准化后的状态
 */
function normalizeRunState(state) {
    const result = clone(DEFAULT_RUN_STATE);

    if (!state || typeof state !== "object") {
        return result;
    }

    // 合并现有状态
    Object.keys(result).forEach((key) => {
        if (Object.prototype.hasOwnProperty.call(state, key)) {
            const val = state[key];
            if (Array.isArray(result[key])) {
                result[key] = Array.isArray(val) ? val : [];
            } else if (typeof result[key] === "object") {
                result[key] = typeof val === "object" ? val : {};
            } else if (typeof result[key] === "number") {
                result[key] = intValue(val, 0);
            } else if (typeof result[key] === "string") {
                result[key] = String(val);
            } else if (typeof result[key] === "boolean") {
                result[key] = Boolean(val);
            }
        }
    });

    return result;
}

/**
 * 标准化根状态
 * @param {any} state 原始状态
 * @returns {Object} 标准化后的状态
 */
function normalizeRootState(state) {
    if (!state || typeof state !== "object") {
        state = {};
    }

    return {
        schema_version: SCHEMA_VERSION,
        profile: normalizeProfileState(state.profile),
        run: normalizeRunState(state.run)
    };
}

/**
 * 为状态对象添加字段别名
 * @param {Object} root 根状态对象
 * @returns {Object} 添加了别名的状态对象
 */
function attachAliases(root) {
    if (!root || !root.run) {
        return root;
    }

    Object.keys(FIELD_ALIASES).forEach((canonicalName) => {
        const aliases = FIELD_ALIASES[canonicalName];
        const target = root.run[canonicalName];

        if (target !== undefined) {
            aliases.forEach((alias) => {
                Object.defineProperty(root.run, alias, {
                    get: () => target,
                    set: (val) => {
                        root.run[canonicalName] = val;
                    },
                    enumerable: true
                });
            });
        }
    });

    return root;
}

/**
 * 验证个人资料状态
 * @param {Object} profile 个人资料状态
 * @returns {Object[]} 验证问题列表
 */
function validateProfileState(profile) {
    const issues = [];

    if (!profile) {
        issues.push({ type: "error", message: "Profile state is missing" });
        return issues;
    }

    if (!Array.isArray(profile.endings_reached)) {
        issues.push({ type: "error", message: "endings_reached must be an array" });
    }

    if (!Array.isArray(profile.achievements)) {
        issues.push({ type: "error", message: "achievements must be an array" });
    }

    if (typeof profile.visited_options !== "object") {
        issues.push({ type: "error", message: "visited_options must be an object" });
    }

    return issues;
}

/**
 * 验证单局游戏状态
 * @param {Object} run 单局游戏状态
 * @returns {Object[]} 验证问题列表
 */
function validateRunState(run) {
    const issues = [];

    if (!run) {
        issues.push({ type: "error", message: "Run state is missing" });
        return issues;
    }

    if (!Array.isArray(run.medals)) {
        issues.push({ type: "error", message: "medals must be an array" });
    }

    if (!Array.isArray(run.items)) {
        issues.push({ type: "error", message: "items must be an array" });
    }

    if (!Array.isArray(run.clues)) {
        issues.push({ type: "error", message: "clues must be an array" });
    }

    if (typeof run.flags !== "object") {
        issues.push({ type: "error", message: "flags must be an object" });
    }

    if (typeof run.current_scene_id !== "string") {
        issues.push({ type: "error", message: "current_scene_id must be a string" });
    }

    return issues;
}

/**
 * 验证根状态
 * @param {Object} root 根状态
 * @returns {Object[]} 验证问题列表
 */
function validateRootState(root) {
    const issues = [];

    if (!root) {
        issues.push({ type: "error", message: "Root state is missing" });
        return issues;
    }

    if (root.schema_version !== SCHEMA_VERSION) {
        issues.push({
            type: "warning",
            message: `Schema version mismatch (expected ${SCHEMA_VERSION}, got ${root.schema_version})`
        });
    }

    issues.push(...validateProfileState(root.profile));
    issues.push(...validateRunState(root.run));

    return issues;
}

/**
 * 从localStorage加载状态
 * @returns {Object} 加载的状态
 */
export function loadState() {
    try {
        const saved = localStorage.getItem("adventure_save");
        if (saved) {
            const parsed = JSON.parse(saved);
            const normalized = normalizeRootState(parsed);
            const validated = validateRootState(normalized);

            if (validated.length > 0) {
                console.warn("Loaded state has issues:", validated);
            }

            return attachAliases(normalized);
        }
    } catch (e) {
        console.error("Failed to load state:", e);
    }

    return attachAliases(normalizeRootState(null));
}

/**
 * 保存状态到localStorage
 * @param {Object} state 要保存的状态
 */
export function saveState(state) {
    try {
        const normalized = normalizeRootState(state);
        const validated = validateRootState(normalized);

        if (validated.length > 0) {
            console.warn("Saving state with issues:", validated);
        }

        localStorage.setItem("adventure_save", JSON.stringify(normalized));
    } catch (e) {
        console.error("Failed to save state:", e);
    }
}

/**
 * 创建存档存储对象
 * 
 * 该函数创建一个状态存储对象，提供了丰富的方法来操作游戏状态，
 * 包括状态的查询、修改、导出等功能。
 * 
 * @param {any} initialState - 初始状态
 * @returns {Object} - 状态存储对象
 */
export function createStore(initialState) {
    // 初始化根状态
    let root = attachAliases(normalizeRootState(initialState));

    /**
     * 检查运行状态中是否包含指定值
     * @param {string} key - 状态键名
     * @param {string} value - 要检查的值
     * @returns {boolean} - 是否包含该值
     */
    function hasRunListValue(key, value) {
        return root.run[key].includes(value);
    }

    /**
     * 向运行状态的列表中添加值
     * @param {string} key - 状态键名
     * @param {string} value - 要添加的值
     * @returns {boolean} - 是否成功添加
     */
    function addRunListValue(key, value) {
        if (typeof value !== "string" || root.run[key].includes(value)) {
            return false;
        }
        root.run[key].push(value);
        return true;
    }

    /**
     * 向运行状态的列表中添加多个值
     * @param {string} key - 状态键名
     * @param {string[]} values - 要添加的值数组
     * @returns {boolean} - 是否有值被添加
     */
    function addRunListValues(key, values) {
        let changed = false;
        for (let i = 0; i < values.length; i += 1) {
            changed = addRunListValue(key, values[i]) || changed;
        }
        return changed;
    }

    /**
     * 从运行状态的列表中移除值
     * @param {string} key - 状态键名
     * @param {string} value - 要移除的值
     * @returns {boolean} - 是否成功移除
     */
    function removeRunListValue(key, value) {
        const index = root.run[key].indexOf(value);
        if (index === -1) {
            return false;
        }
        root.run[key].splice(index, 1);
        return true;
    }

    /**
     * 检查个人资料状态中是否包含指定值
     * @param {string} key - 状态键名
     * @param {string} value - 要检查的值
     * @returns {boolean} - 是否包含该值
     */
    function hasProfileListValue(key, value) {
        return root.profile[key].includes(value);
    }

    /**
     * 向个人资料状态的列表中添加值
     * @param {string} key - 状态键名
     * @param {string} value - 要添加的值
     * @returns {boolean} - 是否成功添加
     */
    function addProfileListValue(key, value) {
        if (typeof value !== "string" || root.profile[key].includes(value)) {
            return false;
        }
        root.profile[key].push(value);
        return true;
    }

    // 返回状态存储对象
    return {
        /**
         * 获取根状态
         * @returns {Object} - 根状态
         */
        get root() {
            return root;
        },
        
        /**
         * 获取个人资料状态
         * @returns {Object} - 个人资料状态
         */
        get profile() {
            return root.profile;
        },
        
        /**
         * 获取运行状态
         * @returns {Object} - 运行状态
         */
        get run() {
            return root.run;
        },
        
        /**
         * 替换根状态
         * @param {Object} payload - 新的根状态
         * @returns {Object} - 替换后的根状态
         */
        replaceRoot(payload) {
            root = attachAliases(normalizeRootState(payload));
            return root;
        },
        
        /**
         * 替换个人资料状态
         * @param {Object} payload - 新的个人资料状态
         * @returns {Object} - 替换后的个人资料状态
         */
        replaceProfile(payload) {
            root.profile = normalizeProfileState(payload);
            attachAliases(root);
            return root.profile;
        },
        
        /**
         * 替换运行状态
         * @param {Object} payload - 新的运行状态
         * @returns {Object} - 替换后的运行状态
         */
        replaceRun(payload) {
            root.run = normalizeRunState(payload);
            attachAliases(root);
            return root.run;
        },
        
        /**
         * 重置运行状态
         * @param {Object} overrides - 覆盖的状态
         * @returns {Object} - 重置后的运行状态
         */
        resetRun(overrides) {
            root.run = normalizeRunState(overrides || {});
            attachAliases(root);
            return root.run;
        },
        
        /**
         * 导出根状态
         * @returns {Object} - 根状态的深拷贝
         */
        exportRoot() {
            return clone(root);
        },
        
        /**
         * 导出个人资料状态
         * @returns {Object} - 个人资料状态的深拷贝
         */
        exportProfile() {
            return clone(root.profile);
        },
        
        /**
         * 导出运行状态
         * @returns {Object} - 运行状态的深拷贝
         */
        exportRun() {
            return clone(root.run);
        },
        
        /**
         * 获取游戏次数
         * @returns {number} - 游戏次数
         */
        getPlayCount() {
            return root.profile.play_count;
        },
        
        /**
         * 增加游戏次数
         * @param {number} delta - 增加的数量
         * @returns {number} - 增加后的游戏次数
         */
        incrementPlayCount(delta = 1) {
            root.profile.play_count += intValue(delta, 1);
            return root.profile.play_count;
        },
        
        /**
         * 获取已达成的结局
         * @returns {string[]} - 结局列表
         */
        getEndingsReached() {
            return root.profile.endings_reached;
        },
        
        /**
         * 检查是否达成指定结局
         * @param {string} name - 结局名称
         * @returns {boolean} - 是否达成
         */
        hasEnding(name) {
            return hasProfileListValue("endings_reached", name);
        },
        
        /**
         * 添加结局
         * @param {string} name - 结局名称
         * @returns {boolean} - 是否成功添加
         */
        addEnding(name) {
            return addProfileListValue("endings_reached", name);
        },
        
        /**
         * 获取成就ID列表
         * @returns {string[]} - 成就ID列表
         */
        getAchievementIds() {
            return root.profile.achievements;
        },
        
        /**
         * 检查是否拥有指定成就
         * @param {string} id - 成就ID
         * @returns {boolean} - 是否拥有
         */
        hasAchievement(id) {
            return hasProfileListValue("achievements", id);
        },
        
        /**
         * 添加成就
         * @param {string} id - 成就ID
         * @returns {boolean} - 是否成功添加
         */
        addAchievement(id) {
            return addProfileListValue("achievements", id);
        },
        
        /**
         * 检查是否访问过指定选项
         * @param {string} key - 选项键
         * @returns {boolean} - 是否访问过
         */
        hasVisitedOption(key) {
            return Boolean(root.profile.visited_options[key]);
        },
        
        /**
         * 标记选项为已访问
         * @param {string} key - 选项键
         * @param {boolean} visited - 是否已访问
         * @returns {boolean} - 标记后的状态
         */
        markVisitedOption(key, visited = true) {
            root.profile.visited_options[key] = Boolean(visited);
            return root.profile.visited_options[key];
        },
        
        /**
         * 检查是否拥有指定物品
         * @param {string} item - 物品名称
         * @returns {boolean} - 是否拥有
         */
        hasItem(item) {
            return hasRunListValue("items", item);
        },
        
        /**
         * 添加物品
         * @param {string} item - 物品名称
         * @returns {boolean} - 是否成功添加
         */
        addItem(item) {
            return addRunListValue("items", item);
        },
        
        /**
         * 添加多个物品
         * @returns {boolean} - 是否有物品被添加
         */
        addItems() {
            return addRunListValues("items", Array.from(arguments));
        },
        
        /**
         * 移除物品
         * @param {string} item - 物品名称
         * @returns {boolean} - 是否成功移除
         */
        removeItem(item) {
            return removeRunListValue("items", item);
        },
        
        /**
         * 检查是否拥有指定线索
         * @param {string} clue - 线索名称
         * @returns {boolean} - 是否拥有
         */
        hasClue(clue) {
            return hasRunListValue("clues", clue);
        },
        
        /**
         * 添加线索
         * @param {string} clue - 线索名称
         * @returns {boolean} - 是否成功添加
         */
        addClue(clue) {
            return addRunListValue("clues", clue);
        },
        
        /**
         * 添加多个线索
         * @returns {boolean} - 是否有线索被添加
         */
        addClues() {
            return addRunListValues("clues", Array.from(arguments));
        },
        
        /**
         * 检查是否拥有指定徽章
         * @param {string} medal - 徽章名称
         * @returns {boolean} - 是否拥有
         */
        hasMedal(medal) {
            return hasRunListValue("medals", medal);
        },
        
        /**
         * 添加徽章记录
         * @param {string} medal - 徽章名称
         * @returns {boolean} - 是否成功添加
         */
        addMedalEntry(medal) {
            return addRunListValue("medals", medal);
        },
        
        /**
         * 增加大厅徽章计数
         * @param {number} delta - 增加的数量
         * @returns {number} - 增加后的计数
         */
        incrementHallMedalCount(delta = 1) {
            root.run.hall_medal_count += intValue(delta, 1);
            return root.run.hall_medal_count;
        },
        
        /**
         * 获取大厅徽章计数
         * @returns {number} - 大厅徽章计数
         */
        getHallMedalCount() {
            return root.run.hall_medal_count;
        },
        
        /**
         * 授予徽章
         * @param {string} medal - 徽章名称
         * @returns {boolean} - 是否是首次获得
         */
        awardMedal(medal) {
            const extras = Array.prototype.slice.call(arguments, 1);
            const hadReward = this.hasItem(medal) || this.hasMedal(medal);
            this.addItem(medal);
            this.addMedalEntry(medal);
            extras.forEach((item) => {
                this.addItem(item);
            });
            if (!hadReward) {
                this.incrementHallMedalCount(1);
            }
            return !hadReward;
        },
        
        /**
         * 获取标记值
         * @param {string} key - 标记键
         * @param {*} fallback - 默认值
         * @returns {*} - 标记值
         */
        getFlag(key, fallback = false) {
            if (!Object.prototype.hasOwnProperty.call(root.run.flags, key)) {
                return fallback;
            }
            return root.run.flags[key];
        },
        
        /**
         * 设置标记值
         * @param {string} key - 标记键
         * @param {*} value - 标记值
         * @returns {*} - 设置后的标记值
         */
        setFlag(key, value) {
            root.run.flags[key] = value;
            return root.run.flags[key];
        },
        
        /**
         * 增加标记值
         * @param {string} key - 标记键
         * @param {number} delta - 增加的数量
         * @returns {number} - 增加后的标记值
         */
        incrementFlag(key, delta = 1) {
            const current = Number(root.run.flags[key]) || 0;
            root.run.flags[key] = current + intValue(delta, 1);
            return root.run.flags[key];
        },
        
        /**
         * 获取场景提示等级
         * @param {string} sceneId - 场景ID
         * @returns {number} - 提示等级
         */
        getHintLevel(sceneId) {
            return root.run.hint_levels[sceneId] || 0;
        },
        
        /**
         * 设置场景提示等级
         * @param {string} sceneId - 场景ID
         * @param {number} level - 提示等级
         * @returns {number} - 设置后的提示等级
         */
        setHintLevel(sceneId, level) {
            root.run.hint_levels[sceneId] = intValue(level, 0);
            return root.run.hint_levels[sceneId];
        },
        
        /**
         * 验证状态
         * @returns {Object[]} - 验证问题列表
         */
        validate() {
            return validateRootState(root);
        }
    };
}

// 导出全局对象
window.StateStore = {
    SCHEMA_VERSION: SCHEMA_VERSION,
    loadState: loadState,
    saveState: saveState,
    createStore: createStore
};