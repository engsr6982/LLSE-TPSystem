import { SimpleFormWithPlayer } from "../tpa/SimpleFormWithPlayer.js";
import { dimidArray, tellTitle } from "../utils/globalVars.js";
import { leveldb } from "../utils/leveldb.js";
import {
    convertVec3ToPos,
    formatVec3ToString,
    getRegCommand,
    parseAxis,
    sendCloseFormTip,
    sendMessage,
    stringifyAxis,
} from "../utils/util.js";
import { warpCore_Instance } from "../warp/WarpCore.js";

class WarpManager {
    constructor() {}

    index(player: Player) {
        this.selectWarp(player);
    }

    private selectWarp(player: Player) {
        const fm = new SimpleFormWithPlayer(player, tellTitle);
        fm.addButton("返回上一页", () => {
            player.runcmd(`${getRegCommand} mgr`);
        });
        fm.addButton("创建传送点", () => {
            this.creatWarp(player);
        });

        const warps = leveldb.getWarp();
        for (const key in warps) {
            fm.addButton(`${key}\n${formatVec3ToString(warps[key])}`, () => {
                this.operationPage(player, key);
            });
        }

        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    private operationPage(player: Player, targetWarp: string) {
        const warp = leveldb.getWarp()[targetWarp];

        const fm = new SimpleFormWithPlayer(player, tellTitle, `正在编辑[${targetWarp}]\n${formatVec3ToString(warp)}`);

        fm.addButton("前往当前公共传送点", () => {
            player.teleport(convertVec3ToPos(warp));
            sendMessage(player, `传送家[${targetWarp}]成功!`);
        });
        fm.addButton("编辑当前公共传送点", () => {
            this.editWarp(player, targetWarp);
        });
        fm.addButton("删除当前公共传送点", () => {
            warpCore_Instance.deleteWarp_(targetWarp)
                ? sendMessage(player, `删除[${targetWarp}]成功！`)
                : sendMessage(player, `删除[${targetWarp}]失败！`);
        });
        fm.addButton("返回上一页", () => {
            this.selectWarp(player);
        });
        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    private creatWarp(player: Player) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput(`家名称`, "string"); // 0
        fm.addInput(`坐标 [使用英文逗号分隔坐标轴]`, "string"); //1
        fm.addDropdown("维度", dimidArray); //2
        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(pl);
            const axis = parseAxis(dt[0] as string); // 解析坐标
            // set
            warpCore_Instance.addWarp_(dt[0], {
                ...axis,
                dimid: <0 | 1 | 2>parseInt(dt[2]),
            })
                ? sendMessage(player, "成功!")
                : sendMessage(player, "失败!");
        });
    }

    private editWarp(player: Player, targetWarp: string) {
        const warpInformation = leveldb.getWarp()[targetWarp];

        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput(`家名称`, "string", targetWarp || ""); // 0
        fm.addInput(`坐标 [使用英文逗号分隔坐标轴]`, "string", stringifyAxis(warpInformation)); //1
        fm.addDropdown("维度", dimidArray, warpInformation.dimid); //2
        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(pl);
            const axis = parseAxis(dt[0] as string); // 解析坐标
            // set
            warpCore_Instance.editWarp_(targetWarp, {
                ...axis,
                dimid: <0 | 1 | 2>parseInt(dt[2]),
                name: dt[0],
            })
                ? sendMessage(player, "成功!")
                : sendMessage(player, "失败!");
        });
    }
}

export const warpMgr = new WarpManager();
