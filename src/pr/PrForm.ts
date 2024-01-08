import { homeForm_Instance } from "../home/HomeForm.js";
import { ModalForms } from "../modules/ModalForm.js";
import { SimpleFormWithPlayer } from "../tpa/SimpleFormWithPlayer.js";
import { config } from "../utils/data.js";
import { tellTitle } from "../utils/globalVars.js";
import { leveldb } from "../utils/leveldb.js";
import { formatVec3ToString, getRegCommand, sendCloseFormTip } from "../utils/util.js";
import { money_Instance } from "../include/money.js";
import { prCore_Instance } from "./PrCore.js";

class PrForm {
    constructor() {}

    index(player: Player) {
        const fm = new SimpleFormWithPlayer(player, tellTitle);

        fm.addButton("创建请求", () => {
            this.createPR(player);
        });
        fm.addButton("删除请求", () => {
            this.deletePr(player);
        });
        fm.addButton("返回", () => {
            player.runcmd(getRegCommand());
        });

        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    private createPR(player: Player) {
        homeForm_Instance._chooseHome(player, (dt) => {
            const md = new ModalForms(
                undefined,
                `名称: ${dt.name}\n${formatVec3ToString(dt.data)}\n${money_Instance.getPlayerMoneyStr(
                    player,
                    config.Pr.SendRequestMoney,
                )}\n\n并入成功后不会删除家园传送点且无法自行撤销`,
            );
            md.setButton_0_call("确认", () => {
                prCore_Instance.createPr(player.realName, {
                    name: dt.name,
                    ...dt.data,
                });
            });
            md.setButton_1_call("返回", () => {
                player.runcmd(`${getRegCommand()} pr`);
            });
            md.setDefault_call(() => {
                sendCloseFormTip(player);
            });
            md.send(player);
        });
    }

    private deletePr(player: Player) {
        const allPr = leveldb.getPr().filter((i) => i.playerRealName === player.realName);
        const fm = new SimpleFormWithPlayer(player, tellTitle);

        allPr.forEach((p) => {
            fm.addButton(p.time, () => {
                const md = new ModalForms(
                    undefined,
                    `名称: ${p.data.name}\n${formatVec3ToString(p.data)}\n创建时间: ${p.time}\n${money_Instance.getPlayerMoneyStr(
                        player,
                        config.Pr.DeleteRequestMoney,
                    )}`,
                );
                md.setButton_0_call("确认删除", () => {
                    prCore_Instance._deletePr(p.guid);
                });
                md.setButton_1_call("取消", () => {
                    player.runcmd(`${getRegCommand()} pr`);
                });
                md.setDefault_call(() => {
                    sendCloseFormTip(player);
                });
                md.send(player);
            });
        });

        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }
}

export const prForm_Instance = new PrForm();
