import { prCore_Instance } from "../pr/PrCore.js";
import { SimpleFormWithPlayer } from "../tpa/SimpleFormWithPlayer.js";
import { tellTitle } from "../utils/globalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { convertVec3ToPos, formatVec3ToString, getRegCommand, sendCloseFormTip, sendMessage } from "../utils/util.js";

class PrManager {
    constructor() {}

    index(player: Player) {
        this.selectPr(player);
    }

    private selectPr(player: Player) {
        const fm = new SimpleFormWithPlayer(player, tellTitle);
        fm.addButton("返回上一页", () => {
            player.runcmd(`${getRegCommand} mgr`);
        });

        const prs = leveldb.getPr();
        for (let i = 0; i < prs.length; i++) {
            fm.addButton(`[玩家] ${prs[i].playerRealName}\n${prs[i].data.name}  ${formatVec3ToString(prs[i].data)}`, () => {
                this.operationPage(player, i, prs[i].guid);
            });
        }

        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    private operationPage(player: Player, index: number, guid: string) {
        const pr = leveldb.getPr()[index];
        const fm = new SimpleFormWithPlayer(
            player,
            tellTitle,
            `[玩家]: ${pr.playerRealName}\n[时间]: ${pr.time}\n[GUID]: ${pr.guid}\n[坐标]: ${formatVec3ToString(pr.data)}\n[GUID匹配]: ${
                guid === pr.guid
            }`,
        );

        fm.addButton("同意并加入公共传送点", () => {
            prCore_Instance._acceptPr(pr.guid) ? sendMessage(player, "操作成功!") : sendMessage(player, "操作失败!");
        });
        fm.addButton("拒绝并删除", () => {
            prCore_Instance._deletePr(pr.guid) ? sendMessage(player, "操作成功!") : sendMessage(player, "操作失败!");
        });
        fm.addButton("前往此Pr的坐标", () => {
            player.teleport(convertVec3ToPos(pr.data)) ? sendMessage(player, "操作成功!") : sendMessage(player, "操作失败!");
        });

        fm.addButton("返回上一页", () => {
            this.index(player);
        });
        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }
}

export const prMgr = new PrManager();
