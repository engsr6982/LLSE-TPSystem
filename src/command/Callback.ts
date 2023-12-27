import { formMap } from "../formMap.js";
import { homeCore_ } from "../home/HomeCore.js";
import { TPAEntrance } from "../tpa/form/TPAEntrance.js";
import { TPRForm } from "../tpr/TPRForm.js";
import { dataFile, formJSON } from "../utils/data.js";
import { tellTitle } from "../utils/globalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { hasOwnProperty_ } from "../utils/util.js";

const sendPlayersUse = (out: CommandOutput) => {
    return out.error("此功能仅限玩家使用!");
};

const call: {
    // eslint-disable-next-line no-unused-vars
    [key: string]: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => void;
} = {
    leveldb: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (ori.type !== 7) return out.error("请在控制台执行此命令!");
        switch (result.leveldb) {
            case "import":
                leveldb.importOldData(result.isOldData) ? logger.info(`导入成功！`) : logger.error(`导入失败！`);
                break;
            case "export":
                leveldb.exportLevelDB() ? logger.info(`导出成功！`) : logger.error(`导出失败！`);
                break;
            case "list":
                {
                    const level = leveldb.getLevelDB();
                    if (result["key"] != null) {
                        return logger.info(level.get(result.key)); // key
                    }
                    if (result["key"] != null && result["key2"] != null) {
                        return logger.info(level.get(result.key)[result.key2]); // key key2
                    }
                    logger.info(`${level.listKey().join(" | ")}`); // all key
                }
                break;
            case "del":
                {
                    const level = leveldb.getLevelDB();
                    if (result["key2"] != null) {
                        const t = level.get(result.key_m);
                        delete t[result.key2];
                        level.set(result.key_m, t);
                        return logger.info(`删除数据 ${result.key_m}.${result.key2} 成功`);
                    }
                    level.delete(result.key_m);
                    leveldb.initLevelDB(); // 防止把根删除
                    logger.info(`删除数据 ${result.key_m} 成功！`);
                }
                break;
        }
    },
    home: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (!ori.player) return sendPlayersUse(out);
        const { player } = ori;
        switch (result.home) {
            case "list":
                const list = homeCore_.getHomeListStringArray(player.realName);
                if (list === null) return out.error(`你还没有家园传送点!`);
                out.success(`${tellTitle}家园: ${list}`);
                break;
            case "go":
                homeCore_.goHome(player, result.name);
                break;
            case "add":
                homeCore_.creatHome(player, result.name);
                break;
            case "del":
                homeCore_.deleteHome(player, result.name);
                break;
        }
    },
    warp: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (!ori.player) return sendPlayersUse(out);
        switch (result.warp) {
            case "list":
            case "go":
            case "add":
            case "del":
        }
    },
    tpa: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        switch (result.tpa) {
            case "accept":
                break;
            case "deny":
                break;
            case "here":
                break;
            case "to":
                break;
            default:
                TPAEntrance(ori.player);
        }
    },
};

export function commandCallback(_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) {
    logger.info(JSON.stringify(result, null, 2));
    if (hasOwnProperty_(call, result.action)) {
        return call[result.action](_, ori, out, result);
    }
    // other
    switch (result.action) {
        case "reload":
            if (ori.type !== 7) return out.error("请在控制台执行此命令!");
            dataFile.initData() ? logger.info("成功") : logger.error("重载失败");
            break;
        case "death":
            break;
        case "pr":
            break;
        case "rule":
            break;
        case "back":
            break;
        case "tpr":
            ori.player ? TPRForm(ori.player) : sendPlayersUse(out);
            break;
        case "menu":
            ori.player ? formMap["main"](ori.player, formJSON) : sendPlayersUse(out);
            break;
        case "mgr":
            break;
    }
}
