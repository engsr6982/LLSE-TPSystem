import { Config, db, DeathInvincible, Gm_Tell } from "../modules/cache.js";
import { Money_Mod } from "../modules/Money.js";
import { Time_Mod } from "../modules/Time.js";


export class DeathCore {
    static GoDeath(pl) {
        let Death = db.get('Death');
        if (Money_Mod.DeductEconomy(pl, Config.Death.GoDelath)) {
            if (pl.teleport(new IntPos(Death[pl.realName][0].x, Death[pl.realName][0].y, Death[pl.realName][0].z, Death[pl.realName][0].dimid))) {
                pl.tell(Gm_Tell + '传送完成！');
                // 加入无敌时间
                DeathInvincible.push({
                    "name": pl.realName,
                    "end": Time_Mod.getEndTimes(Config.Death.InvincibleTime, Config.Death.InvincibleTimeUnit)
                })
            } else {
                pl.tell(Gm_Tell + '传送失败！');
                Money_Mod.addMoney(Config.Death.GoDelath);
            }
        }
    }

    /**
     * 添加死亡信息
     * @param {String} realName 玩家名
     * @param {Object} info 死亡信息
     * @returns {Boolean}
     */
    static addDeathInfo(realName, info) {
        // 读取死亡信息
        let tmp = db.get('Death');
        // 初始化,防止underfined
        if (!tmp.hasOwnProperty(realName)) {
            tmp[realName] = [];
        }
        // 添加进第一位
        tmp[realName].unshift(info);
        // 判断是否超出规定长度
        if (tmp[realName].length > Config.Death.MaxDeathInfo) {
            // 移除最后一位
            tmp[realName].pop();
        }
        // 保存
        return db.set("Death", tmp);
    }

    /**
     * 转换玩家死亡数据
     */
    static convertPlayerData() {
        // 读取数据
        let Death = db.get('Death');
        // 遍历对象
        for (const player_D in Death) {
            // logger.debug(player_D, Object.prototype.toString.call(Death[player_D]));
            // 判断数据类型
            if (Object.prototype.toString.call(Death[player_D]) === '[object Object]') {
                // 备份数据
                const backup = Death[player_D];
                // 修改数据类型
                Death[player_D] = [];
                // 写入备份数据
                Death[player_D].unshift(backup);
                logger.info(`转换玩家<${player_D}>死亡数据完成！  [object Object] => ${Object.prototype.toString.call(Death[player_D])}`);
            }
        }
        db.set("Death", Death);
    }
}