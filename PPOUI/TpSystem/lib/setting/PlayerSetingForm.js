import { Other } from "../modules/Other.js";
import { Gm_Tell, db } from "../modules/cache.js";


/**玩家设置-表单 */
export function PlayerSetingForm(pl) {
    let PlayerSeting = db.get('PlayerSeting');
    const fm = Other.CustomForm();
    fm.addSwitch('接受传送请求', PlayerSeting[pl.realName].AcceptTransmission);
    fm.addSwitch('传送时二次确认', PlayerSeting[pl.realName].SecondaryConfirmation);
    //fm.addSwitch('收到传送请求时是否弹窗', PlayerSeting[pl.realName].SendRequestPopup);
    fm.addSwitch('死亡后弹出返回死亡点弹窗', PlayerSeting[pl.realName].DeathPopup);
    pl.sendForm(fm, (pl, dt) => {
        if (dt == null) return Other.CloseTell(pl);
        // 创建新数据
        const data = {
            AcceptTransmission: Boolean(dt[0]).valueOf(),
            SecondaryConfirmation: Boolean(dt[1]).valueOf(),
            //SendRequestPopup: Boolean(dt[3]).valueOf(),
            DeathPopup: Boolean(dt[2]).valueOf()
        };
        // 替换之前的数据，并保存
        PlayerSeting[pl.realName] = data;
        db.set('PlayerSeting', PlayerSeting);
        pl.tell(Gm_Tell + '操作已保存');
    })
}