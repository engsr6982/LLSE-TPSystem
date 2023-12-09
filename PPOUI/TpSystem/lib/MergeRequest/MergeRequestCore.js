import { Money_Mod } from "../modules/Money.js";
import { Other } from "../modules/Other.js";
import { Config, Gm_Tell, db } from "../modules/cache.js";


export class MergeRequest_Core {
    /**
     * 创建请求
     * @param {object} pl 玩家对象
     * @param {number} id 家园传送点索引
     */
    static CerateRequest(pl, id) {
        // 获取已有合并请求
        let MergeRequest = db.get('MergeRequest');
        // 获取Home数据
        let Home = db.get('Home');
        // 检查经济
        if (Money_Mod.DeductEconomy(pl, Config.MergeRequest.sendRequest)) {
            // 添加（构建）请求
            MergeRequest.push({
                player: pl.realName,// 玩家名
                guid: Other.RandomID(),// 随机ID
                time: system.getTimeStr(),// 事件字符串
                data: Home[pl.realName][id]// 家园
            });
            db.set('MergeRequest', MergeRequest);
            pl.tell(Gm_Tell + '发送成功！');
        }
    }

    /**
     * 删除请求
     * @param {object} pl 玩家对象
     * @param {number} id 家园传送点索引
     */
    static RevokeRequest(pl, id) {
        let MergeRequest = db.get('MergeRequest');
        // 检查经济
        if (Money_Mod.DeductEconomy(pl, Config.MergeRequest.DeleteRequest)) {
            MergeRequest.splice(id, 1);
            db.set('MergeRequest', MergeRequest);
            pl.tell(Gm_Tell + '撤销成功！');
        }
    }
}