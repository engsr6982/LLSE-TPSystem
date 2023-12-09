import { Main } from "../Main.js";
import { Money_Mod } from "../modules/Money.js";
import { Other } from "../modules/Other.js";
import { Config, Gm_Tell, MainUI, PLUGIN_INFO } from "../modules/cache.js";
import { TPR_Core } from "./TPR_Core.js";


/**随机传送-表单 */
export function TPRForm(pl) {
    // 检查功能状态
    if (!Config.TPR.Enable) return pl.tell(Gm_Tell + '管理员关闭了此功能！');
    // 发送表单确认一下
    pl.sendModalForm(PLUGIN_INFO.Introduce, `确认执行此操作？\n${Money_Mod.getEconomyStr(pl, Config.TPR.Money)}`, '确认', '返回', (pl, res) => {
        switch (res) {
            // 调用传送函数
            case true: TPR_Core(pl); break;
            // 返回上一页
            case false: Main(pl, MainUI); break;
            // 关闭
            default: Other.CloseTell(pl); break;
        }
    })
}