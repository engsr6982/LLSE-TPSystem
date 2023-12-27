import { time } from "../../../LLSE-Modules/src/Time.js";
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

    // command
    static importOldData(isOld: boolean = true): boolean {
        if (isOld) {
        } else {
            const filePath = pluginFloder.import_ + `imp.json`;
            if (!file.exists(filePath)) {
                logger.warn(`找不到导入文件<imp.json> 请将要导入的文件重命名为 imp.json`);
                logger.error(`无法导入不存在的文件：${filePath}`);
                return false;
            }
            const obj = JSON.parse(file.readFrom(filePath));
            const k = Object.keys(obj); // 获取key

            logger.warn("为了操作安全，备份数据库...");
            this.exportLevelDB(); // 备份一下

            k.forEach((i) => {
                leveldb_Inst.set(i, obj[i]); // 遍历key 写入数据库
            });
            return true;
        }
    }

    static exportLevelDB(): boolean {
        const key = leveldb_Inst.listKey();
        const cache: any = {};
        key.forEach((i) => {
            cache[i] = leveldb_Inst.get(i);
        });
        const filePath = pluginFloder.export_ + `${time.formatDateToString(new Date()).replace(/:/g, "-")}.bak`;
        file.writeTo(filePath, JSON.stringify(cache, null, 2));
        logger.info(`输出文件到：${filePath}`);
        return true;
    }
}
