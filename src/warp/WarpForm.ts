import { permCoreInstance } from "../include/permission.js";
import { SimpleFormWithPlayer } from "../tpa/SimpleFormWithPlayer.js";
import { tellTitle } from "../utils/globalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { formatVec3ToString, getRegCommand, sendCloseFormTip, sendMessage } from "../utils/util.js";

class WarpForm {
    constructor() {}

    index(player: Player) {
        const fm = new SimpleFormWithPlayer(player, tellTitle);
        fm.addButton("新建传送点", () => {
            permCoreInstance.verifyUserPermission(player.xuid, "addWarp") ? this.newWarp(player) : sendMessage(player, "无权限!");
        });
        fm.addButton("前往传送点", () => {
            this.goWarp(player);
        });
        fm.addButton("删除传送点", () => {
            permCoreInstance.verifyUserPermission(player.xuid, "delWarp") ? this.deleteWarp(player) : sendMessage(player, "无权限!");
        });
        // fm.addButton("返回", () => {
        //     player.runcmd(getRegCommand());
        // });
        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    private selectWarp(player: Player, call: (warp: { name: string; data: Vec3 & dataDate }) => void) {
        const w = leveldb.getWarp();
        const fm = new SimpleFormWithPlayer(player, tellTitle);

        for (const key in w) {
            fm.addButton(`${key}\n${formatVec3ToString(w[key])}`, () => {
                call({
                    name: key,
                    data: w[key],
                });
            });
        }

        fm.send();
    }

    private newWarp(player: Player) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);

        fm.addInput("输入公共点名称", "string");

        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(player);
            if (dt[0] == "") return this.newWarp(pl);
            player.runcmd(`${getRegCommand()} warp add ${dt[0]}`);
        });
    }

    private deleteWarp(player: Player) {
        this.selectWarp(player, (dt) => {
            player.runcmd(`${getRegCommand()} warp del ${dt.name}`);
        });
    }

    private goWarp(player: Player) {
        this.selectWarp(player, (dt) => {
            player.runcmd(`${getRegCommand()} warp go ${dt.name}`);
        });
    }
}
export const warpForm_Instance = new WarpForm();
