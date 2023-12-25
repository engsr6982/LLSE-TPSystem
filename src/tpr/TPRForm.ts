import { config } from "../utils/data.js";
import { pluginInformation, tellTitle } from "../utils/globalVars.js";
import { money_, sendCloseFormTip } from "../utils/util.js";
import { TPR_Core } from "./TPR_Core.js";

/**随机传送-表单 */
export function TPRForm(player: Player) {
    // 检查功能状态
    if (!config.Tpr.Enable) return player.tell(tellTitle + "管理员关闭了此功能！");
    // 发送表单确认一下
    player.sendModalForm(
        pluginInformation.introduce,
        `确认执行此操作？\n${money_.getPlayerMoneyStr(player, config.Tpr.Money)}`,
        "确认",
        "返回",
        (pl, res) => {
            switch (res) {
                // 调用传送函数
                case true:
                    TPR_Core(pl);
                    break;
                // 返回上一页
                case false:
                    // Main(pl, MainUI);
                    break;
                default:
                    sendCloseFormTip(pl);
                    break;
            }
        },
    );
}