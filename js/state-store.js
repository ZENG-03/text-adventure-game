(function () {
    const SCHEMA_VERSION = 1;
    const PROFILE_SAVE_VERSION = 4;

    const DEFAULT_PROFILE_STATE = {
        save_version: PROFILE_SAVE_VERSION,
        play_count: 0,
        endings_reached: [],
        achievements: [],
        visited_options: {}
    };

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

    const DEFAULT_ROOT_STATE = {
        schema_version: SCHEMA_VERSION,
        profile: DEFAULT_PROFILE_STATE,
        run: DEFAULT_RUN_STATE
    };

    const PROFILE_ALIASES = {
        saveVersion: "save_version",
        playCount: "play_count",
        endingsReached: "endings_reached",
        visitedOptions: "visited_options"
    };

    const RUN_ALIASES = {
        currentSceneId: "current_scene_id",
        runStartedAt: "run_started_at",
        lastHallMedalCount: "last_hall_medal_count",
        hintLevels: "hint_levels",
        visitedOptions: "visited_options"
    };

    function clone(value) {
        if (typeof structuredClone === "function") {
            return structuredClone(value);
        }
        if (value === null || value === undefined || typeof value !== "object") {
            return value;
        }
        return JSON.parse(JSON.stringify(value));
    }

    function isObject(value) {
        return Boolean(value) && typeof value === "object" && !Array.isArray(value);
    }

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

    function intValue(value, fallback) {
        if (typeof value === "number" && Number.isFinite(value)) {
            return Math.trunc(value);
        }
        return fallback;
    }

    function optionalIntValue(value) {
        if (value === null || value === undefined) {
            return null;
        }
        return intValue(value, null);
    }

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

    function normalizeKeys(data, aliases) {
        const result = {};
        Object.keys(data).forEach((key) => {
            result[aliases[key] || key] = data[key];
        });
        return result;
    }

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

    function normalizeRootState(data) {
        if (!isObject(data)) {
            return clone(DEFAULT_ROOT_STATE);
        }

        const hasRootShape = Object.prototype.hasOwnProperty.call(data, "profile")
            || Object.prototype.hasOwnProperty.call(data, "run")
            || Object.prototype.hasOwnProperty.call(data, "schema_version");

        if (!hasRootShape) {
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

    function validateProfileState(data) {
        const issues = [];
        if (!isObject(data)) {
            return [{ path: "profile", message: "profile must be an object" }];
        }
        if (!Number.isInteger(data.save_version)) {
            issues.push({ path: "profile.save_version", message: "save_version must be an integer" });
        }
        if (!Number.isInteger(data.play_count)) {
            issues.push({ path: "profile.play_count", message: "play_count must be an integer" });
        }
        if (!Array.isArray(data.endings_reached)) {
            issues.push({ path: "profile.endings_reached", message: "endings_reached must be a list" });
        }
        if (!Array.isArray(data.achievements)) {
            issues.push({ path: "profile.achievements", message: "achievements must be a list" });
        }
        if (!isObject(data.visited_options)) {
            issues.push({ path: "profile.visited_options", message: "visited_options must be an object" });
        }
        return issues;
    }

    function validateRunState(data) {
        const issues = [];
        if (!isObject(data)) {
            return [{ path: "run", message: "run must be an object" }];
        }

        ["medals", "rooms_completed", "items", "clues", "visited_options"].forEach((key) => {
            if (!Array.isArray(data[key])) {
                issues.push({ path: `run.${key}`, message: `${key} must be a list` });
            }
        });

        ["side_quests", "flags", "hint_levels"].forEach((key) => {
            if (!isObject(data[key])) {
                issues.push({ path: `run.${key}`, message: `${key} must be an object` });
            }
        });

        if (!Number.isInteger(data.hall_medal_count)) {
            issues.push({ path: "run.hall_medal_count", message: "hall_medal_count must be an integer" });
        }
        if (typeof data.current_scene_id !== "string") {
            issues.push({ path: "run.current_scene_id", message: "current_scene_id must be a string" });
        }
        if (!(data.run_started_at === null || Number.isInteger(data.run_started_at))) {
            issues.push({ path: "run.run_started_at", message: "run_started_at must be null or an integer" });
        }
        if (!Number.isInteger(data.last_hall_medal_count)) {
            issues.push({
                path: "run.last_hall_medal_count",
                message: "last_hall_medal_count must be an integer"
            });
        }

        return issues;
    }

    function validateRootState(data) {
        const issues = [];
        if (!isObject(data)) {
            return [{ path: "root", message: "root state must be an object" }];
        }
        if (!Number.isInteger(data.schema_version)) {
            issues.push({ path: "schema_version", message: "schema_version must be an integer" });
        }
        return issues
            .concat(validateProfileState(data.profile))
            .concat(validateRunState(data.run));
    }

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

    function attachAliases(root) {
        Object.keys(PROFILE_ALIASES).forEach((aliasKey) => {
            defineAlias(root.profile, aliasKey, PROFILE_ALIASES[aliasKey]);
        });
        Object.keys(RUN_ALIASES).forEach((aliasKey) => {
            defineAlias(root.run, aliasKey, RUN_ALIASES[aliasKey]);
        });
        return root;
    }

    function createStore(initialState) {
        let root = attachAliases(normalizeRootState(initialState));

        function hasRunListValue(key, value) {
            return root.run[key].includes(value);
        }

        function addRunListValue(key, value) {
            if (typeof value !== "string" || root.run[key].includes(value)) {
                return false;
            }
            root.run[key].push(value);
            return true;
        }

        function addRunListValues(key, values) {
            let changed = false;
            for (let i = 0; i < values.length; i += 1) {
                changed = addRunListValue(key, values[i]) || changed;
            }
            return changed;
        }

        function removeRunListValue(key, value) {
            const index = root.run[key].indexOf(value);
            if (index === -1) {
                return false;
            }
            root.run[key].splice(index, 1);
            return true;
        }

        function hasProfileListValue(key, value) {
            return root.profile[key].includes(value);
        }

        function addProfileListValue(key, value) {
            if (typeof value !== "string" || root.profile[key].includes(value)) {
                return false;
            }
            root.profile[key].push(value);
            return true;
        }

        return {
            get root() {
                return root;
            },
            get profile() {
                return root.profile;
            },
            get run() {
                return root.run;
            },
            replaceRoot(payload) {
                root = attachAliases(normalizeRootState(payload));
                return root;
            },
            replaceProfile(payload) {
                root.profile = normalizeProfileState(payload);
                attachAliases(root);
                return root.profile;
            },
            replaceRun(payload) {
                root.run = normalizeRunState(payload);
                attachAliases(root);
                return root.run;
            },
            resetRun(overrides) {
                root.run = normalizeRunState(overrides || {});
                attachAliases(root);
                return root.run;
            },
            exportRoot() {
                return clone(root);
            },
            exportProfile() {
                return clone(root.profile);
            },
            exportRun() {
                return clone(root.run);
            },
            getPlayCount() {
                return root.profile.play_count;
            },
            incrementPlayCount(delta = 1) {
                root.profile.play_count += intValue(delta, 1);
                return root.profile.play_count;
            },
            getEndingsReached() {
                return root.profile.endings_reached;
            },
            hasEnding(name) {
                return hasProfileListValue("endings_reached", name);
            },
            addEnding(name) {
                return addProfileListValue("endings_reached", name);
            },
            getAchievementIds() {
                return root.profile.achievements;
            },
            hasAchievement(id) {
                return hasProfileListValue("achievements", id);
            },
            addAchievement(id) {
                return addProfileListValue("achievements", id);
            },
            hasVisitedOption(key) {
                return Boolean(root.profile.visited_options[key]);
            },
            markVisitedOption(key, visited = true) {
                root.profile.visited_options[key] = Boolean(visited);
                return root.profile.visited_options[key];
            },
            hasItem(item) {
                return hasRunListValue("items", item);
            },
            addItem(item) {
                return addRunListValue("items", item);
            },
            addItems() {
                return addRunListValues("items", Array.from(arguments));
            },
            removeItem(item) {
                return removeRunListValue("items", item);
            },
            hasClue(clue) {
                return hasRunListValue("clues", clue);
            },
            addClue(clue) {
                return addRunListValue("clues", clue);
            },
            addClues() {
                return addRunListValues("clues", Array.from(arguments));
            },
            hasMedal(medal) {
                return hasRunListValue("medals", medal);
            },
            addMedalEntry(medal) {
                return addRunListValue("medals", medal);
            },
            incrementHallMedalCount(delta = 1) {
                root.run.hall_medal_count += intValue(delta, 1);
                return root.run.hall_medal_count;
            },
            getHallMedalCount() {
                return root.run.hall_medal_count;
            },
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
            getFlag(key, fallback = false) {
                if (!Object.prototype.hasOwnProperty.call(root.run.flags, key)) {
                    return fallback;
                }
                return root.run.flags[key];
            },
            setFlag(key, value) {
                root.run.flags[key] = value;
                return root.run.flags[key];
            },
            incrementFlag(key, delta = 1) {
                const current = Number(root.run.flags[key]) || 0;
                root.run.flags[key] = current + intValue(delta, 1);
                return root.run.flags[key];
            },
            getHintLevel(sceneId) {
                return root.run.hint_levels[sceneId] || 0;
            },
            setHintLevel(sceneId, level) {
                root.run.hint_levels[sceneId] = intValue(level, 0);
                return root.run.hint_levels[sceneId];
            },
            validate() {
                return validateRootState(root);
            }
        };
    }

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
})();
