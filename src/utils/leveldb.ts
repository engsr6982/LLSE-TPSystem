import { time } from "../../../LLSE-Modules/src/Time.js";
import { convertData } from "../convertData/convertData.js";
import { pluginFloder } from "./globalVars.js";

const leveldb_Inst = new KVDatabase(pluginFloder.leveldb);

export class leveldb {
    // home
    static getHome(): homeStructure {
        return leveldb_Inst.get("home");
    }
    static setHome(newData: homeStructure): boolean {
        return leveldb_Inst.set("home", newData);
    }

    // warp
    static getWarp(): warpStructure {
        return leveldb_Inst.get("warp");
    }
    static setWarp(newData: warpStructure): boolean {
        return leveldb_Inst.set("warp", newData);
    }

    // death
    static getDeath(): deathStructure {
        return leveldb_Inst.get("death");
    }
    static setDeath(newData: deathStructure): boolean {
        return leveldb_Inst.set("death", newData);
    }

    // pr
    static getPr(): prStructure {
        return leveldb_Inst.get("pr");
    }
    static setPr(newData: prStructure): boolean {
        return leveldb_Inst.set("pr", newData);
    }

    // rule
    static getRule(): ruleStructure {
        return leveldb_Inst.get("rule");
    }
    static setRule(newData: ruleStructure): boolean {
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
    static importDataType(isOld: boolean = true): boolean {
        return isOld ? this.importOldData() : this.importNewData();
    }

    private static importOldData() {
        const generationConversionData = {}; // 待转换数据
        const oldFileName = ["Home", "Warp", "Death", "PlayerSeting", "MergeRequest"]; // 旧文件名

        for (let i = 0; i < oldFileName.length; i++) {
            try {
                const readPath = pluginFloder.import_ + oldFileName[i];
                // @ts-ignore
                generationConversionData[oldFileName[i]] = JSON.parse(file.readFrom(readPath));
                logger.info(`[旧数据转换] 读取解析文件 ${oldFileName[i]} 成功. ${i}/${oldFileName.length}`);
            } catch (e) {
                continue;
            }
        }
        // @ts-ignore
        const convertCompletedData = convertData(generationConversionData); // 调用转换函数
        const saveFileName = `convertCompletedData_${new Date().getTime()}`; // 确认要保存的文件名
        logger.info("保存转换完成的数据为 => " + saveFileName);
        file.writeTo(pluginFloder.import_ + saveFileName, JSON.stringify(convertCompletedData)); // 保存转换完成数据
        return this.importNewData(saveFileName); // 调用新数据导入函数
    }

    private static importNewData(fileName?: string) {
        !fileName ? (fileName = "imp.json") : null; // 确定文件名
        const filePath = pluginFloder.import_ + fileName; // 确定文件路径
        // 检查文件
        if (!file.exists(filePath)) {
            logger.warn(`找不到导入文件<${fileName}> 请将要导入的文件重命名为 ${fileName}`);
            logger.error(`无法导入不存在的文件：${filePath}`);
            return false;
        }
        // 解析文件
        const obj = JSON.parse(file.readFrom(filePath));
        const k = Object.keys(obj); // 获取key
        // 备份数据库
        logger.warn("为了操作安全，备份数据库...");
        this.exportLevelDB();
        // 遍历key 写入数据库
        k.forEach((i) => {
            leveldb_Inst.set(i, obj[i]);
        });
        return true;
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
