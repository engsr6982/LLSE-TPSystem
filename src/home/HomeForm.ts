import { SimpleFormWithPlayer } from "../tpa/SimpleFormWithPlayer.js";
import { config } from "../utils/data.js";
import { tellTitle } from "../utils/globalVars";
import { leveldb } from "../utils/leveldb.js";
import { formatVec3ToString, getRegCommand, hasOwnProperty_, sendCloseFormTip, sendMessage } from "../utils/util";
import { money_Instance } from "../include/money.js";
import { homeCore_Instance } from "./HomeCore.js";

class HomeForm {
    constructor() {}

    index(player: Player) {
        const fm = new SimpleFormWithPlayer(player, tellTitle, `选择一个操作`);

        fm.addButton(
            "新建家",
            () => {
                this.newHome(player);
            },
            "",
        );
        fm.addButton(
            "前往家",
            () => {
                this.goHome(player);
            },
            "",
        );
        fm.addButton(
            "编辑家",
            () => {
                this.editHome(player);
            },
            "",
        );
        fm.addButton(
            "删除家",
            () => {
                this.deleteHome(player);
            },
            "",
        );
        fm.addButton("返回", () => {
            player.runcmd(getRegCommand());
        });

        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    private newHome(player: Player) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput("请输入家园名称", "String");
        fm.addLabel(money_Instance.getPlayerMoneyStr(player, config.Home.CreatHomeMoney));
        player.sendForm(fm, (pl, dt: Array<string | null>) => {
            if (!dt) return sendCloseFormTip(pl);
            if (dt[0] == "") return sendMessage(pl, "输入框为空");
            pl.runcmd(`${getRegCommand()} home add ${dt[0]}`);
        });
    }

    _chooseHome(player: Player, call: (home: { name: string; data: Vec3 & dataDate }) => void) {
        const fm = new SimpleFormWithPlayer(player, tellTitle);
        const allHome = leveldb.getHome();

        if (!hasOwnProperty_(allHome, player.realName)) return sendMessage(player, "你还没有家园传送点！");
        const home = allHome[player.realName];

        for (const key in home) {
            fm.addButton(`${key}\n${formatVec3ToString(home[key])}`, () => {
                call({
                    name: key,
                    data: home[key],
                });
            });
        }
        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    private goHome(player: Player) {
        this._chooseHome(player, (dt) => {
            player.runcmd(`${getRegCommand()} home go ${dt.name}`);
        });
    }

    private editHome(player: Player) {
        this._chooseHome(player, (dt) => {
            const fm = new SimpleFormWithPlayer(player, tellTitle);

            fm.addButton("更新坐标到当前位置", () => {
                homeCore_Instance.updatePos(player, dt.name) ? sendMessage(player, "成功!") : sendMessage(player, "失败!");
            });
            fm.addButton("编辑家名称", () => {
                this.inputNewName(player, dt, dt.name);
            });
            fm.addButton("返回", () => {});
            fm.default = () => {
                sendCloseFormTip(player);
            };
            fm.send();
        });
    }

    private inputNewName(player: Player, dt: { name: string; data: Vec3 & dataDate }, name?: string) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput("输入新名称", "String", name || dt.name);
        fm.addLabel(money_Instance.getPlayerMoneyStr(player, config.Home.EditNameMoney));
        player.sendForm(fm, (pl, n) => {
            if (!n) return sendCloseFormTip(player);
            if (n[0] == dt.name) return;
            homeCore_Instance.updateName(player, dt.name, n[0]) ? sendMessage(player, "操作成功！") : this.inputNewName(player, dt, n[0]);
        });
    }

    private deleteHome(player: Player) {
        this._chooseHome(player, (dt) => {
            player.runcmd(`${getRegCommand()} home del ${dt.name}`);
        });
    }
}

export const homeForm_Instance = new HomeForm();
