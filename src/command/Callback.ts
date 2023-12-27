import { homeInst } from "../home/homeCore.js";
import { TPAEntrance } from "../tpa/form/TPAEntrance.js";
import { TPRForm } from "../tpr/TPRForm.js";
import { dataFile } from "../utils/data.js";
import { hasOwnProperty_ } from "../utils/util.js";

const sendPlayersUse = (out: CommandOutput) => {
    return out.error("此功能仅限玩家使用!");
};

const call: {
    // eslint-disable-next-line no-unused-vars
    [key: string]: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => void;
} = {
    leveldb: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        switch (result.leveldb) {
            case "import":
            case "export":
            case "list":
            case "del":
        }
    },
    // eslint-disable-next-line prettier/prettier
    "home": (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        if (!ori.player) return sendPlayersUse(out);
        const { player } = ori;
        switch (result.home) {
            case "list":
                const list = homeInst.getHomeListStringArray(player.xuid);
                log(list);
                if (list === null) return out.error(`你还没有家园传送点!`);
                list.forEach((i) => {
                    out.success(i);
                });
                out.success(`共计: ${list.length}`);
                break;
            case "go":
                homeInst.goHome(player, result.name);
                break;
            case "add":
                homeInst.creatHome(player, result.name);
                break;
            case "del":
                homeInst.deleteHome(player, result.name);
                break;
        }
    },
    warp: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
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
            TPRForm(ori.player);
            break;
        case "menu":
            break;
        case "mgr":
            break;
    }
}
