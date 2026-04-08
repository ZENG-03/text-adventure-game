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

(function () {
    // 存档系统常量
    const SCHEMA_VERSION = 1;
    const PROFILE_SAVE_VERSION = 4;

    // 默认的个人资料状态（跨存档共享）
    const DEFAULT_PROFILE_STATE = {
        save_version: PROFILE_SAVE_VERSION,
        play_count: 0,
        endings_reached: [],
        achievements: [],
        visited_options: {}
    };

    // 默认的单次运行状态（当前游戏进度）
    const DEFAULT_RUN_STATE = {
        medals: [],
        rooms_completed: [],
        items: [],
        clues: [],
        side_quests: {},
        flags: {},
        hall_medal_count: 0,
        current_scene_id: "title",
        run_started_at: null,
        last_hall_medal_count: 0,
        hint_levels: {},
        visited_options: []
    };

    // 默认的完整根状态
    const DEFAULT_ROOT_STATE = {
        schema_version: SCHEMA_VERSION,
        profile: DEFAULT_PROFILE_STATE,
        run: DEFAULT_RUN_STATE
    };

    // 个人资料字段别名
    const PROFILE_ALIASES = {
        saveVersion: "save_version",
        playCount: "play_count",
        endingsReached: "endings_reached",
        visitedOptions: "visited_options"
    };

    // 运行状态字段别名
    const RUN_ALIASES = {
        currentSceneId: "current_scene_id",
        runStartedAt: "run_started_at",
        lastHallMedalCount: "last_hall_medal_count",
        hintLevels: "hint_levels",
        visitedOptions: "visited_options"
    };

    /**
     * 深拷贝对象
     * @param {any} value 
     * @returns {any}
     */
    function clone(value) {
        if (typeof structuredClone === "function") {
            return structuredClone(value);
        }
        if (value === null || value === undefined || typeof value !== "object") {
            return value;
        }
        return JSON.parse(JSON.stringify(value));
    }

    /**
     * 检查是否为对象
     * @param {any} value 
     * @returns {boolean}
     */
    function isObject(value) {
        return Boolean(value) && typeof value === "object" && !Array.isArray(value);
    }

    /**
     * 确保数组中只包含唯一的字符串
     * @param {any} value 
     * @returns {string[]}
     */
    function uniqueStrings(value) {
        if (!Array.isArray(value)) {
            return [];
        }
        const result = [];
        const seen = new Set();
        for (let i = 0; i < value.length; i += 1) {
            const item = value[i];
            if (typeof item === "string" && !seen.has(item)) {
                seen.add(item);
                result.push(item);
            }
        }
        return result;
    }

    /**
     * 转换为整数
     * @param {any} value 
     * @param {number} fallback 
     * @returns {number}
     */
    function intValue(value, fallback) {
        if (typeof value === "number" && Number.isFinite(value)) {
            return Math.trunc(value);
        }
        return fallback;
    }

    /**
     * 转换为可选整数
     * @param {any} value 
     * @returns {number|null}
     */
    function optionalIntValue(value) {
        if (value === null || value === undefined) {
            return null;
        }
        return intValue(value, null);
    }

    /**
     * 标准化布尔映射字典
     * @param {any} value 
     * @returns {Object.<string, boolean>}
     */
    function booleanMap(value) {
        if (!isObject(value)) {
            return {};
        }
        const result = {};
        Object.keys(value).forEach((key) => {
            result[String(key)] = Boolean(value[key]);
        });
        return result;
    }

    /**
     * 标准化通用映射字典
     * @param {any} value 
     * @returns {Object.<string, any>}
     */
    function genericMap(value) {
        if (!isObject(value)) {
            return {};
        }
        const result = {};
        Object.keys(value).forEach((key) => {
            result[String(key)] = clone(value[key]);
        });
        return result;
    }

    /**
     * 标准化整数映射字典
     * @param {any} value 
     * @returns {Object.<string, number>}
     */
    function intMap(value) {
        if (!isObject(value)) {
            return {};
        }
        const result = {};
        Object.keys(value).forEach((key) => {
            const item = intValue(value[key], null);
            if (item !== null) {
                result[String(key)] = item;
            }
        });
        return result;
    }

    /**
     * 处理字段别名映射
     * @param {Object} data 
     * @param {Object} aliases 
     * @returns {Object}
     */
    function normalizeKeys(data, aliases) {
        const result = {};
        Object.keys(data).forEach((key) => {
            result[aliases[key] || key] = data[key];
        });
        return result;
    }

    /**
     * 标准化个人资料状态
     * @param {any} data 
     * @returns {Object}
     */
    function normalizeProfileState(data) {
        const raw = isObject(data) ? normalizeKeys(data, PROFILE_ALIASES) : {};
        return {
            save_version: intValue(raw.save_version, PROFILE_SAVE_VERSION),
            play_count: intValue(raw.play_count, 0),
            endings_reached: uniqueStrings(raw.endings_reached),
            achievements: uniqueStrings(raw.achievements),
            visited_options: booleanMap(raw.visited_options)
        };
    }

    /**
     * 标准化运行状态
     * @param {any} data 
     * @returns {Object}
     */
    function normalizeRunState(data) {
        const raw = isObject(data) ? normalizeKeys(data, RUN_ALIASES) : {};
        const visitedOptionsRaw = raw.visited_options;
        const normalizedVisitedOptions = isObject(visitedOptionsRaw)
            ? uniqueStrings(Object.keys(visitedOptionsRaw).filter((key) => visitedOptionsRaw[key]))
            : uniqueStrings(visitedOptionsRaw);

        const hintLevels = intMap(raw.hint_levels);
        const flags = genericMap(raw.flags);

        const normalized = {
            medals: uniqueStrings(raw.medals),
            rooms_completed: uniqueStrings(raw.rooms_completed),
            items: uniqueStrings(raw.items),
            clues: uniqueStrings(raw.clues),
            side_quests: genericMap(raw.side_quests),
            flags: flags,
            hall_medal_count: intValue(raw.hall_medal_count, 0),
            current_scene_id: typeof raw.current_scene_id === "string" ? raw.current_scene_id : "title",
            run_started_at: optionalIntValue(raw.run_started_at),
            last_hall_medal_count: intValue(raw.last_hall_medal_count, 0),
            hint_levels: hintLevels,
            visited_options: normalizedVisitedOptions
        };

        const knownKeys = new Set(Object.keys(DEFAULT_RUN_STATE).concat(Object.keys(RUN_ALIASES)));
        Object.keys(raw).forEach((key) => {
            if (knownKeys.has(key)) {
                return;
            }
            // 兼容旧版提示等级
            if (key.indexOf("hint_level_") === 0) {
                const sceneId = key.slice("hint_level_".length);
                const hintValue = intValue(raw[key], null);
                if (hintValue !== null) {
                    normalized.hint_levels[sceneId] = hintValue;
                }
                return;
            }
            normalized.flags[String(key)] = clone(raw[key]);
        });

        return normalized;
    }

    /**
     * 标准化根状态
     * @param {any} data 
     * @returns {Object}
     */
    function normalizeRootState(data) {
        if (!isObject(data)) {
            return clone(DEFAULT_ROOT_STATE);
        }

        const hasRootShape = Object.prototype.hasOwnProperty.call(data, "profile")
            || Object.prototype.hasOwnProperty.call(data, "run")
            || Object.prototype.hasOwnProperty.call(data, "schema_version");

        if (!hasRootShape) {
            // 兼容旧版无根结构的数据
            return {
                schema_version: SCHEMA_VERSION,
                profile: clone(DEFAULT_PROFILE_STATE),
                run: normalizeRunState(data)
            };
        }

        return {
            schema_version: intValue(data.schema_version, SCHEMA_VERSION),
            profile: normalizeProfileState(data.profile),
            run: normalizeRunState(data.run)
        };
    }

    /**
     * 验证个人资料状态
     * @param {any} data 
     * @returns {Object[]}
     */
    function validateProfileState(data) {
        const issues = [];
        if (!isObject(data)) {
            return [{ path: "profile", message: "profile 必须是一个对象" }];
        }
        if (!Number.isInteger(data.save_version)) {
            issues.push({ path: "profile.save_version", message: "save_version 必须是整数" });
        }
        if (!Number.isInteger(data.play_count)) {
            issues.push({ path: "profile.play_count", message: "play_count 必须是整数" });
        }
        if (!Array.isArray(data.endings_reached)) {
            issues.push({ path: "profile.endings_reached", message: "endings_reached 必须是列表" });
        }
        if (!Array.isArray(data.achievements)) {
            issues.push({ path: "profile.achievements", message: "achievements 必须是列表" });
        }
        if (!isObject(data.visited_options)) {
            issues.push({ path: "profile.visited_options", message: "visited_options 必须是对象" });
        }
        return issues;
    }

    /**
     * 验证运行状态
     * @param {any} data 
     * @returns {Object[]}
     */
    function validateRunState(data) {
        const issues = [];
        if (!isObject(data)) {
            return [{ path: "run", message: "run 必须是一个对象" }];
        }

        ["medals", "rooms_completed", "items", "clues", "visited_options"].forEach((key) => {
            if (!Array.isArray(data[key])) {
                issues.push({ path: `run.${key}`, message: `${key} 必须是列表` });
            }
        });

        ["side_quests", "flags", "hint_levels"].forEach((key) => {
            if (!isObject(data[key])) {
                issues.push({ path: `run.${key}`, message: `${key} 必须是对象` });
            }
        });

        if (!Number.isInteger(data.hall_medal_count)) {
            issues.push({ path: "run.hall_medal_count", message: "hall_medal_count 必须是整数" });
        }
        if (typeof data.current_scene_id !== "string") {
            issues.push({ path: "run.current_scene_id", message: "current_scene_id 必须是字符串" });
        }
        if (!(data.run_started_at === null || Number.isInteger(data.run_started_at))) {
            issues.push({ path: "run.run_started_at", message: "run_started_at 必须是 null 或整数" });
        }
        if (!Number.isInteger(data.last_hall_medal_count)) {
            issues.push({
                path: "run.last_hall_medal_count",
                message: "last_hall_medal_count 必须是整数"
            });
        }

        return issues;
    }

    /**
     * 验证根状态
     * @param {any} data 
     * @returns {Object[]}
     */
    function validateRootState(data) {
        const issues = [];
        if (!isObject(data)) {
            return [{ path: "root", message: "根状态必须是一个对象" }];
        }
        if (!Number.isInteger(data.schema_version)) {
            issues.push({ path: "schema_version", message: "schema_version 必须是整数" });
        }
        return issues
            .concat(validateProfileState(data.profile))
            .concat(validateRunState(data.run));
    }

    /**
     * 定义属性别名
     * @param {Object} target 
     * @param {string} aliasKey 
     * @param {string} canonicalKey 
     */
    function defineAlias(target, aliasKey, canonicalKey) {
        if (Object.getOwnPropertyDescriptor(target, aliasKey)) {
            return;
        }
        Object.defineProperty(target, aliasKey, {
            configurable: true,
            enumerable: false,
            get() {
                return target[canonicalKey];
            },
            set(value) {
                target[canonicalKey] = value;
            }
        });
    }

    /**
     * 附加字段别名
     * @param {Object} root 
     * @returns {Object}
     */
    function attachAliases(root) {
        Object.keys(PROFILE_ALIASES).forEach((aliasKey) => {
            defineAlias(root.profile, aliasKey, PROFILE_ALIASES[aliasKey]);
        });
        Object.keys(RUN_ALIASES).forEach((aliasKey) => {
            defineAlias(root.run, aliasKey, RUN_ALIASES[aliasKey]);
        });
        return root;
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
    function createStore(initialState) {
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
        PROFILE_SAVE_VERSION: PROFILE_SAVE_VERSION,
        DEFAULT_ROOT_STATE: clone(DEFAULT_ROOT_STATE),
        normalizeProfileState: normalizeProfileState,
        normalizeRunState: normalizeRunState,
        normalizeRootState: normalizeRootState,
        validateProfileState: validateProfileState,
        validateRunState: validateRunState,
        validateRootState: validateRootState,
        createStore: createStore
    };

    /**
     * 从 localStorage 加载存档
     * @returns {Object} 标准化的根状态
     */
    function loadState() {
        const raw = localStorage.getItem("game_state");
        let parsed = null;
        try {
            if (raw) parsed = JSON.parse(raw);
        } catch(e) {}
        
        const stateStore = window.StateStore.createStore();
        if (parsed) {
            if (parsed.profile || parsed.run) {
                stateStore.replaceRoot(parsed);
            } else {
                // 从旧版格式迁移
                if (parsed.endings_reached || typeof parsed.play_count === 'number') {
                    stateStore.replaceProfile(parsed);
                }
                const oldRun = localStorage.getItem("riddle_auto_save");
                if (oldRun) {
                    try {
                        const parsedOldRun = JSON.parse(oldRun);
                        if (parsedOldRun.current_scene_id) {
                            stateStore.replaceRun(parsedOldRun);
                        }
                    } catch(e) {}
                }
            }
        }
        return stateStore.exportRoot();
    }

    /**
     * 保存存档到 localStorage
     * @param {Object} state 
     */
    function saveState(state) {
        localStorage.setItem("game_state", JSON.stringify(state));
    }

    window.loadState = loadState;
    window.saveState = saveState;
})();

export const loadState = window.loadState;
export const saveState = window.saveState;

