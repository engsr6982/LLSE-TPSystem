import { deathForm_Instance } from "../death/DeathForm.js";
import { menu } from "../otherForm/menu.js";
import { homeCore_Instance } from "../home/HomeCore.js";
import { homeForm_Instance } from "../home/HomeForm.js";
import { permCoreInstance } from "../include/permission.js";
import { TPAEntrance } from "../tpa/form/TPAEntrance.js";
import { cmdTpaCall_accept_deny, cmdTpaCall_to_here } from "../tpa/form/cmdTpaCall.js";
import { TPRForm } from "../tpr/TPRForm.js";
import { config, dataFile, formJSON } from "../utils/data.js";
import { tellTitle } from "../utils/globalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { convertPosToVec3, hasOwnProperty_, sendMessage } from "../utils/util.js";
import { warpCore_Instance } from "../warp/WarpCore.js";
import { warpForm_Instance } from "../warp/WarpForm.js";
import { prForm_Instance } from "../pr/PrForm.js";
import { ManagerEntry } from "../manager/ManagerEntry.js";

const sendPlayersUse = (out: CommandOutput) => {
    return out.error(tellTitle + "此功能仅限玩家使用!");
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
        if (!config.Home.Enable) return sendMessage(player, "此功能已关闭!");
        switch (result.home) {
            case "list":
                const list = homeCore_Instance.getHomeListString(player.realName);
                if (list === null) return out.error(`你还没有家园传送点!`);
                out.success(`${tellTitle}家园: ${list}`);
                break;
            case "go":
                homeCore_Instance.goHome(player, result.name);
                break;
            case "add":
                homeCore_Instance.creatHome(player, result.name);
                break;
            case "del":
                homeCore_Instance.deleteHome(player, result.name);
                break;
            default:
                homeForm_Instance.index(player);
        }
    },
    warp: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (!ori.player) return sendPlayersUse(out);
        const { player } = ori;
        if (!config.Warp.Enable) return sendMessage(player, "此功能已关闭!");
        switch (result.warp) {
            case "list":
                const w = warpCore_Instance.getWarpListString() || "当前还没有任何公共传送点！";
                out.success(tellTitle + `${w}`);
                break;
            case "go":
                warpCore_Instance.goWarp(player, result.name);
                break;
            case "add":
                permCoreInstance.verifyUserPermission(player.xuid, "addWarp")
                    ? warpCore_Instance.addWarp_(result.name, convertPosToVec3(player.blockPos))
                    : out.error(tellTitle + "无权限添加公共传送点");
                break;
            case "del":
                permCoreInstance.verifyUserPermission(player.xuid, "delWarp")
                    ? warpCore_Instance.deleteWarp_(result.name)
                    : out.error(tellTitle + "无权限删除公共传送点");
                break;
            default:
                warpForm_Instance.index(player);
        }
    },
    tpa: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (!ori.player) return sendPlayersUse(out);
        const { player } = ori;
        if (!config.Tpa.Enable) return sendMessage(player, "此功能已关闭!");
        // log(result.player.map((i) => String(i)));
        switch (result.tpa) {
            case "accept":
                new cmdTpaCall_accept_deny(player, "accept");
                break;
            case "deny":
                new cmdTpaCall_accept_deny(player, "deny");
                break;
            case "here":
                new cmdTpaCall_to_here(player, result.player, "here");
                break;
            case "to":
                new cmdTpaCall_to_here(player, result.player, "to");
                break;
            default:
                TPAEntrance(player);
        }
    },
};

// eslint-disable-next-line complexity
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
            ori.player ? deathForm_Instance.sendQueryDeath(ori.player) : sendPlayersUse(out);
            break;
        case "pr":
            ori.player ? prForm_Instance.index(ori.player) : sendPlayersUse(out);
            break;
        case "rule":
            // todo OpenGUI
            break;
        case "back":
            ori.player ? deathForm_Instance.sendGoDeath(ori.player) : sendPlayersUse(out);
            break;
        case "tpr":
            ori.player ? TPRForm(ori.player) : sendPlayersUse(out);
            break;
        case "menu":
            ori.player ? menu(ori.player, formJSON) : sendPlayersUse(out);
            break;
        case "mgr":
            permCoreInstance.checkIfAdmin(ori.player.xuid) ? ManagerEntry(ori.player) : out.error(tellTitle + "无权限打开控制面板！");
            break;
    }
}
