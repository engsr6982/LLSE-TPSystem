import { pluginFloder } from "./globalVars.js";

const leveldb_Inst = new KVDatabase(pluginFloder.leveldb);

export class leveldb {
    // home
    static getHome(): home_Structure {
        return leveldb_Inst.get("home");
    }
    static setHome(newData: home_Structure): boolean {
        return leveldb_Inst.set("home", newData);
    }

    // warp
    static getWarp(): warp_Structure {
        return leveldb_Inst.get("warp");
    }
    static setWarp(newData: warp_Structure): boolean {
        return leveldb_Inst.set("warp", newData);
    }

    // death
    static getDeath(): death_Structure {
        return leveldb_Inst.get("death");
    }
    static setDeath(newData: death_Structure): boolean {
        return leveldb_Inst.set("death", newData);
    }

    // pr
    static getPr(): pr_Structure {
        return leveldb_Inst.get("pr");
    }
    static setPr(newData: pr_Structure): boolean {
        return leveldb_Inst.set("pr", newData);
    }

    // rule
    static getRule(): rule_Structure {
        return leveldb_Inst.get("rule");
    }
    static setRule(newData: rule_Structure): boolean {
        return leveldb_Inst.set("rule", newData);
    }

    // other
    static getLevelDB() {
        return leveldb_Inst;
    }

    static initLevelDB() {
        const leveldbKey = ["home", "warp", "death", "pr", "rule"];
        leveldbKey.forEach((k) => {
            if (leveldb_Inst.get(k) == null) {
                leveldb_Inst.set(k, {});
                logger.warn(`初始化<${k}>成功！`);
            }
        });
        return true;
    }
}
