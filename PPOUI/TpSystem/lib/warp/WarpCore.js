import { Money_Mod } from "../modules/Money.js";
import { Config, Gm_Tell } from "../modules/cache.js";


export class WarpCore {
    static GoWarp(pl, pos) {
        // 检查经济
        if (Money_Mod.DeductEconomy(pl, Config.Warp.GoWarp)) {
            // 判断传送是否成功
            if (pl.teleport(pos)) {
                pl.tell(Gm_Tell + '传送成功！');
            } else {
                // 传送失败 加回经济
                pl.tell(Gm_Tell + '传送失败!');
                Money_Mod.addMoney(pl, Config.Warp.GoWarp);
            }
        }
    }
}