import { SimpleFormWithPlayer } from "../tpa/SimpleFormWithPlayer.js";
import { dataFile } from "../utils/data.js";
import { tellTitle } from "../utils/globalVars.js";
import { sendCloseFormTip, sendMessageToPlayer } from "../utils/util.js";
import { permFormInstance } from "../include/permission.js";

export function ManagerEntry(player: Player) {
    const fm = new SimpleFormWithPlayer(player, tellTitle);

    fm.addButton("家园传送点管理", () => {});
    fm.addButton("公共传送点管理", () => {});
    fm.addButton("合并请求管理", () => {});
    fm.addButton("权限组管理", () => {
        permFormInstance.index(player);
    });
    fm.addButton("重载配置文件", () => {
        dataFile.initData();
        sendMessageToPlayer(player, "成功!");
    });
    fm.default = () => {
        sendCloseFormTip(player);
    };
    fm.send();
}
