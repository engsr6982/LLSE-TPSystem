import { TPAEntrance } from "../tpa/form/TPAEntrance.js";
import { TPRForm } from "../tpr/TPRForm.js";
import { dataFile } from "../utils/data.js";
import { hasOwnProperty_ } from "../utils/util.js";

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
    home: (_: Command, ori: CommandOrigin, out: CommandOutput, result: commandResult) => {
        switch (result.home) {
            case "list":
                break;
            case "go":
                break;
            case "add":
                break;
            case "del":
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
