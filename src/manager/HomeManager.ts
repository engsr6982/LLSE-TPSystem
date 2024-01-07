import { homeCore_Instance } from "../home/HomeCore.js";
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

class HomeManager {
    constructor() {}

    index(player: Player) {
        this.selectPlayer(player);
    }

    // Step 1
    private selectPlayer(player: Player) {
        const fm = new SimpleFormWithPlayer(player, tellTitle);
        fm.addButton("返回上一页", () => {
            player.runcmd(`${getRegCommand()} mgr`);
        });

        const allPlayerHome = leveldb.getHome();
        for (const key in allPlayerHome) {
            fm.addButton(`${key}\n家园数量: ${Object.keys(allPlayerHome[key]).length}`, () => {
                this.chooseHome(player, key);
            });
        }

        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    // step 2
    private chooseHome(player: Player, targetPlayer: string) {
        const fm = new SimpleFormWithPlayer(player, tellTitle, `当前正在编辑玩家[${targetPlayer}]`);
        fm.addButton("返回上一页", () => {
            this.index(player);
        });
        fm.addButton("新建家", () => {
            this.createHome(player, targetPlayer);
        });

        const allHome = leveldb.getHome()[targetPlayer];
        for (const key in allHome) {
            fm.addButton(`${key}\n${formatVec3ToString(allHome[key])}`, () => {
                this.operationPage(player, targetPlayer, key);
            });
        }
        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    // step 3
    private operationPage(player: Player, targetPlayer: string, targetHome: string) {
        const home = leveldb.getHome()[targetPlayer][targetHome];

        const fm = new SimpleFormWithPlayer(
            player,
            tellTitle,
            `正在编辑玩家[${targetPlayer}]的家[${targetHome}]\n${formatVec3ToString(home)}`,
        );

        fm.addButton("前往家", () => {
            player.teleport(convertVec3ToPos(home));
            sendMessage(player, `传送家[${targetHome}]成功!`);
        });
        fm.addButton("编辑家", () => {
            this.editor(player, targetPlayer, targetHome);
        });
        fm.addButton("删除家", () => {
            homeCore_Instance._deleteHome(targetPlayer, targetHome)
                ? sendMessage(player, `删除玩家[${targetPlayer}]的家[${targetHome}]成功！`)
                : sendMessage(player, `删除玩家[${targetPlayer}]的家[${targetHome}]失败！`);
        });
        fm.addButton("返回上一页", () => {
            this.chooseHome(player, targetPlayer);
        });
        fm.default = () => {
            sendCloseFormTip(player);
        };
        fm.send();
    }

    // step 4
    private createHome(player: Player, targetPlayer: string) {
        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput(`家名称`, "string"); // 0
        fm.addInput(`坐标 [使用英文逗号分隔坐标轴]`, "string"); //1
        fm.addDropdown("维度", dimidArray); //2
        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(pl);
            const axis = parseAxis(dt[0] as string); // 解析坐标
            // set
            homeCore_Instance._addHome(targetPlayer, dt[0], {
                ...axis,
                dimid: <0 | 1 | 2>parseInt(dt[2]),
            })
                ? sendMessage(player, "成功!")
                : sendMessage(player, "失败!");
        });
    }

    // step 5
    private editor(player: Player, targetPlayer: string, targetHome: string) {
        const homeInformation = leveldb.getHome()[targetPlayer][targetHome];

        const fm = mc.newCustomForm();
        fm.setTitle(tellTitle);
        fm.addInput(`家名称`, "string", targetHome || ""); // 0
        fm.addInput(`坐标 [使用英文逗号分隔坐标轴]`, "string", stringifyAxis(homeInformation)); //1
        fm.addDropdown("维度", dimidArray, homeInformation.dimid); //2
        player.sendForm(fm, (pl, dt) => {
            if (!dt) return sendCloseFormTip(pl);
            const axis = parseAxis(dt[0] as string); // 解析坐标
            // set
            homeCore_Instance._editHome(targetPlayer, targetHome, {
                ...axis,
                dimid: <0 | 1 | 2>parseInt(dt[2]),
                name: dt[0],
            })
                ? sendMessage(player, "成功!")
                : sendMessage(player, "失败!");
        });
    }
}

export const homeMgr = new HomeManager();
