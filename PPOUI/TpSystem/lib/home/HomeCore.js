import { Money_Mod } from "../modules/Money.js";
import { Config, Gm_Tell, db } from "../modules/cache.js";



export class HomeCore {
    /**
     * 创建家
     * @param {Object} pl 玩家对象
     * @param {String} name 家园名称
     */
    static CreateHome(pl, name) {
        let Home = db.get('Home');
        // 检查玩家数据
        if (!Home.hasOwnProperty(pl.realName)) {
            // 无数据 初始化为 array
            Home[pl.realName] = [];
        }
        // 检查是否超出数量限制
        if (Home[pl.realName].length <= Config.Home.MaxHome) {
            // 家园数量通过 检查经济
            if (Money_Mod.DeductEconomy(pl, Config.Home.CreateHome)) {
                Home[pl.realName].push({
                    "name": name,
                    "x": pl.blockPos.x,
                    "y": pl.blockPos.y,
                    "z": pl.blockPos.z,
                    "dimid": pl.blockPos.dimid
                });
                db.set('Home', Home);
                pl.tell(Gm_Tell + '家园已保存');
            }
        } else {
            pl.tell(Gm_Tell + `创建家园传送点[${name}失败！\n最大家园数量：${Config.Home.MaxHome}]`);
        }
    }
    /**
     * 前往家
     * @param {Object} pl 玩家对象
     * @param {IntPos | FloatPos} Pos 坐标对象
     */
    static GoHome(pl, Pos) {
        // 检查经济
        if (Money_Mod.DeductEconomy(pl, Config.Home.GoHome)) {
            if (pl.teleport(Pos)) {
                pl.tell(Gm_Tell + '传送成功！');
            } else {
                pl.tell(Gm_Tell + '传送失败!');
                // 加回经济
                Money_Mod.addMoney(pl, Config.Home.GoHome);// 加回被扣经济
            }
        }
    }
    /**
     * 更新家园名称
     * @param {Object} pl 玩家对象 
     * @param {Number} id 家园数组索引
     * @param {String} newname 新名称
     */
    static UpdateName(pl, id, newname) {
        let Home = db.get('Home');
        if (Money_Mod.DeductEconomy(pl, Config.Home.EditHome_Name)) {
            Home[pl.realName][id].name = newname;
            db.set('Home', Home);
            pl.tell(Gm_Tell + '操作已保存');
        }
    }
    /**
     * 更新家园坐标
     * @param {Object} pl 玩家对象
     * @param {Number} id 家园数组索引
     * @param {IntPos | FloatPos} pos 坐标对象
     */
    static UpdatePos(pl, id, pos) {
        let Home = db.get('Home');
        if (Money_Mod.DeductEconomy(pl, Config.Home.EditHome_Pos)) {
            Home[pl.realName][id].x = pos.x;
            Home[pl.realName][id].y = pos.y;
            Home[pl.realName][id].z = pos.z;
            Home[pl.realName][id].dimid = pos.dimid;
            db.set('Home', Home);
            pl.tell(Gm_Tell + '更新完成！');
        }
    }
    /**
     * 删除家
     * @param {Object} pl 玩家对象
     * @param {Number} id 家园数组索引
     */
    static DeleteHome(pl, id) {
        let Home = db.get('Home');
        if (Money_Mod.DeductEconomy(pl, Config.Home.DeleteHome)) {
            Home[pl.realName].splice(id, 1);
            db.set("Home", Home);
            pl.tell(Gm_Tell + '删除成功！');
        }
    }
}