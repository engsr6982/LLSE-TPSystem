import { Main } from "../Main.js";
import { Money_Mod } from "../modules/Money.js";
import { Other } from "../modules/Other.js";
import { Config, Gm_Tell, MainUI, PLUGIN_INFO, db } from "../modules/cache.js";
import { DeathCore } from "./DeathCore.js";


export class DeathForm {
    static sendGoDeathForm(pl) {
        const error_stack = Error().stack;
        // 检查功能状态
        if (!Config.Death.Enable) return pl.tell(Gm_Tell + `此功能已被管理员关闭！`);
        // 获取死亡数据
        let Death = db.get('Death');
        // 检查键是否存在
        if (Death.hasOwnProperty(pl.realName)) {
            // 发送表单确认
            pl.sendModalForm(PLUGIN_INFO.Introduce, `时间： ${Death[pl.realName][0].time}\n维度： ${Other.DimidToDimension(Death[pl.realName][0].dimid)} \nX: ${Death[pl.realName][0].x}\nY: ${Death[pl.realName][0].y}\nZ: ${Death[pl.realName][0].z}\n${Money_Mod.getEconomyStr(pl, Config.Death.GoDelath)}`, '确认前往', '返回主页 / 取消', (pl, res) => {
                switch (res) {
                    // 前往
                    case true: DeathCore.GoDeath(pl); break;
                    // 返回上一页
                    case false:
                        if (RegExp(/event\.js/gm).test(error_stack)) {
                            Other.CloseTell(pl);
                        } else {
                            Main(pl, MainUI);
                        }
                        break;
                    // 关闭
                    default: Other.CloseTell(pl); break;
                }
            });
        } else {
            pl.tell(Gm_Tell + '你还没有死亡点信息！');
        }
    }

    static sendQueryDeathInfoForm(pl) {
        if (!Config.Death.QueryDeath) return pl.tell(Gm_Tell + `此功能已被管理员关闭！`);
        // 读取数据
        let Death = db.get('Death');
        if (Death.hasOwnProperty(pl.realName)) {
            const fm = Other.SimpleForm();
            // 遍历死亡点数组
            Death[pl.realName].forEach(i => {
                fm.addButton(`时间： ${i.time}\n维度： ${Other.DimidToDimension(i.dimid)} X: ${i.x} Y: ${i.y} Z: ${i.z}`);
            });
            // 发送表单
            pl.sendForm(fm, (pl, id) => {
                if (id == null) return Other.CloseTell(pl);
                //DeathForm.showQueryDeathInfoForm(pl, Death[pl.realName][id]);
            });
        } else {
            pl.tell(Gm_Tell + '你还没有死亡点信息！');
        }
    }

    static showQueryDeathInfoForm(pl, info) {
        const fm = Other.SimpleForm();
        fm.setContent(`时间： ${info.time}\n维度： ${Other.DimidToDimension(info.dimid)} X: ${info.x} Y: ${info.y} Z: ${info.z}`);
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        fm.addButton('传送至此死亡点');
        fm.addButton('获取到死亡点距离');
        const sendQueryDeathInfoForm = this.sendQueryDeathInfoForm;
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0:
                    sendQueryDeathInfoForm(pl);
                    break;
                case 1:
                    break;
                case 2:
                    pl.tell(Gm_Tell + pl.distanceTo(new IntPos(info.x, info.y, info.z, info.dimid)))
                    break;
                default:
                    Other.CloseTell(pl);
                    break;
            }
        })
    }
}