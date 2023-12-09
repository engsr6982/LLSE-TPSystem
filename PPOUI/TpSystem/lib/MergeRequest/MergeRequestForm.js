import { HomeForm } from "../home/HomeForm.js";
import { Money_Mod } from "../modules/Money.js";
import { Other } from "../modules/Other.js";
import { SelectAction } from "../modules/SelectAction.js";
import { Config, Gm_Tell, PLUGIN_INFO, db } from "../modules/cache.js";
import { MergeRequest_Core } from "./MergeRequestCore.js";

export class MergeRequestForm {
    /**合并请求-面板 */
    static MergeRequest_Panel(pl) {
        if (!Config.MergeRequest.Enable) return pl.tell(Gm_Tell + `此功能已被管理员关闭！`);
        const fm = Other.SimpleForm();
        fm.addButton('发送请求', 'textures/ui/backup_replace');
        fm.addButton('撤销请求', 'textures/ui/redX1');
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0: MergeRequestForm.SendRequest(pl); break;
                case 1: MergeRequestForm.RevokeRequest(pl); break;
                case 2: HomeForm.Panel(pl); break;
                default: Other.CloseTell(pl); break;
            }
        })
    }

    /**发送请求 */
    static SendRequest(pl) {
        let Home = db.get('Home');
        if (Home.hasOwnProperty(pl.realName) && Home[pl.realName].length !== 0) {
            SelectAction(pl, Home[pl.realName], false, id => {
                pl.sendModalForm(PLUGIN_INFO.Introduce, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.MergeRequest.sendRequest)}\n\n并入成功后不会删除家园传送点且无法自行撤销\n请谨慎操作`, '发送申请', '返回上一页', (_, res) => {
                    switch (res) {
                        case true: MergeRequest_Core.CerateRequest(pl, id); break;
                        case false: HomeForm.MergeRequest_Panel(pl); break;
                        default: Other.CloseTell(pl); break;
                    }
                });
            })
        } else {
            NoHome(pl);
        }
    }

    /**删除请求 */
    static RevokeRequest(pl) {
        let MergeRequest = db.get('MergeRequest');
        const fm = Other.SimpleForm();
        let AllButtons = [];

        // 创建按钮
        MergeRequest.forEach(i => {
            if (i.player == pl.realName) {
                fm.addButton(`时间： ${i.time}b`)
                AllButtons.push(i);
            }
        });

        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            if (id == null) return Other.CloseTell(pl);
            if (id == AllButtons.length) return HomeForm.MergeRequest_Panel(pl);
            // 获取GUID
            const GUID = AllButtons[id].guid;
            // 根据GUID查询获取索引
            const index = MergeRequest.findIndex(i => i.guid === GUID);
            // 发送确认表单
            pl.sendModalForm(PLUGIN_INFO.Introduce, `时间: ${MergeRequest[index].time}\nGUID: ${MergeRequest[index].guid}\n\n名称： ${MergeRequest[index].data.name}\n坐标： ${MergeRequest[index].data.x},${MergeRequest[index].data.y},${MergeRequest[index].data.z}\n维度： ${Other.DimidToDimension(MergeRequest[index].data.dimid)}\n${Money_Mod.getEconomyStr(pl, Config.MergeRequest.DeleteRequest)}`, '撤销此请求', '返回上一页', (_, res) => {
                switch (res) {
                    case true: MergeRequest_Core.RevokeRequest(pl, index); break;
                    case false: HomeForm.MergeRequest_Panel(pl); break;
                    default: Other.CloseTell(pl); break;
                }
            });
        })
    }
}


function NoHome(pl) {
    return pl.tell(Gm_Tell + '你还没有家园传送点,无法继续执行操作！');
}