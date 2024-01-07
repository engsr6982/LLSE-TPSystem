import { SimpleFormWithPlayer } from "../tpa/SimpleFormWithPlayer.js";
import { dataFile } from "../utils/data.js";
import { tellTitle } from "../utils/globalVars.js";
import { sendCloseFormTip, sendMessage } from "../utils/util.js";
import { permFormInstance } from "../include/permission.js";
import { homeMgr } from "./HomeManager.js";
import { warpMgr } from "./WarpManager.js";
import { prMgr } from "./PrManager.js";

export function ManagerEntry(player: Player) {
    const fm = new SimpleFormWithPlayer(player, tellTitle);

    fm.addButton("家园传送点管理", () => {
        homeMgr.index(player);
    });
    fm.addButton("公共传送点管理", () => {
        warpMgr.index(player);
    });
    fm.addButton("合并请求管理", () => {
        prMgr.index(player);
    });
    fm.addButton("权限组管理", () => {
        permFormInstance.index(player);
    });
    fm.addButton("重载配置文件", () => {
        dataFile.initData();
        sendMessage(player, "成功!");
    });
    fm.default = () => {
        sendCloseFormTip(player);
    };
    fm.send();
}
