import { Money_Mod } from "../modules/Money.js";
import { Other } from "../modules/Other.js";
import { SelectAction } from "../modules/SelectAction.js";
import { Config, Gm_Tell, PLUGIN_INFO, db } from "../modules/cache.js";
import { WarpCore } from "./WarpCore.js";



/**公共传送-表单 */
export function WarpForm(pl) {
    // 检查功能状态
    if (!Config.Warp.Enable) return pl.tell(Gm_Tell + `此功能已被管理员关闭！`);
    // 读取Warp数据
    let Warp = db.get('Warp');
    // 获取玩家设置
    let PlayerSeting = db.get('PlayerSeting');
    // 检查传送点数量
    if (Warp.length == 0) return pl.tell(Gm_Tell + '无公共传送点！无法继续执行操作！');
    // 调用函数 选择传送点
    SelectAction(pl, Warp, true, id => {
        // 创建目标坐标对象
        const Pos = new IntPos(Warp[id].x, Warp[id].y, Warp[id].z, Warp[id].dimid);
        // 判断是否需要发送表单
        if (PlayerSeting[pl.realName].SecondaryConfirmation) {
            // 发送表单
            pl.sendModalForm(PLUGIN_INFO.Introduce, `名称： ${Warp[id].name}\n坐标： ${Warp[id].x},${Warp[id].y},${Warp[id].z}\n维度： ${Other.DimidToDimension(Warp[id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.Warp.GoWarp)}`, '确认', '返回上一页', (_, res) => {
                switch (res) {
                    // 传送
                    case true: WarpCore.GoWarp(pl, Pos); break;
                    // 返回上一页
                    case false: WarpForm(pl); break;
                    // 关闭
                    default: Other.CloseTell(pl); break;
                }
            });
        } else {
            // 不发送 直接传送
            WarpCore.GoWarp(pl, Pos)
        }
    })
}