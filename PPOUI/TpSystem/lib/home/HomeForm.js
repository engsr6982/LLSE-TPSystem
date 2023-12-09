import { Main } from "../Main.js";
import { Money_Mod } from "../modules/Money.js";
import { Other } from "../modules/Other.js";
import { Config, Gm_Tell, MainUI, PLUGIN_INFO, db } from "../modules/cache.js";
import { HomeCore } from "./HomeCore.js";
import { SelectAction } from "../modules/SelectAction.js";
import { MergeRequestForm } from "../MergeRequest/MergeRequestForm.js";


/**家园传送-表单 */
export class HomeForm {
    /**总面板 */
    static Panel(pl) {
        if (!Config.Home.Enable) return pl.tell(Gm_Tell + `此功能已被管理员关闭！`);
        const fm = Other.SimpleForm();
        fm.addButton('新建家', 'textures/ui/color_plus');
        fm.addButton('前往家', 'textures/ui/send_icon');
        fm.addButton('编辑家', 'textures/ui/book_edit_default');
        fm.addButton('删除家', 'textures/ui/trash_default');
        fm.addButton('并入公共传送点', 'textures/ui/share_microsoft');
        fm.addButton('返回上一页', 'textures/ui/icon_import');
        pl.sendForm(fm, (pl, id) => {
            switch (id) {
                case 0: HomeForm.CreateHome(pl); break;
                case 1: HomeForm.GoHome(pl); break;
                case 2: HomeForm.Edit_Panel(pl); break;
                case 3: HomeForm.DeleteHome(pl); break;
                case 4: MergeRequestForm.MergeRequest_Panel(pl); break;
                case 5: Main(pl, MainUI); break;
                default: Other.CloseTell(pl); break;
            }
        })
    }

    /**创建家 */
    static CreateHome(pl) {
        const fm = Other.CustomForm();
        fm.addLabel(Money_Mod.getEconomyStr(pl, Config.Home.CreateHome));
        fm.addInput("输入家园名称", "String");
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            if (dt[1] == '') return pl.tell(Gm_Tell + "输入框为空！");
            HomeCore.CreateHome(pl, dt[1]);
        })
    }

    /**前往家 */
    static GoHome(pl) {
        let Home = db.get('Home');
        let PlayerSeting = db.get('PlayerSeting');
        if (Home.hasOwnProperty(pl.realName) && Home[pl.realName].length !== 0) {
            SelectAction(pl, Home[pl.realName], false, id => {
                // 创建坐标对象
                const Pos = new IntPos(Home[pl.realName][id].x, Home[pl.realName][id].y, Home[pl.realName][id].z, Home[pl.realName][id].dimid);
                if (PlayerSeting[pl.realName].SecondaryConfirmation) {
                    pl.sendModalForm(PLUGIN_INFO.Introduce, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.Home.GoHome)}`, '确认', '返回上一页', (_, res) => {
                        switch (res) {
                            case true: HomeCore.GoHome(pl, Pos); break;
                            case false: HomeForm.GoHome(pl); break;
                            default: Other.CloseTell(pl); break;
                        }
                    });
                } else {
                    HomeCore.GoHome(pl, Pos);
                }
            })
        } else {
            NoHome(pl);
        }
    }

    /**编辑家 */
    static Edit_Panel(pl) {
        let Home = db.get('Home');
        if (Home.hasOwnProperty(pl.realName) && Home[pl.realName].length !== 0) {
            SelectAction(pl, Home[pl.realName], false, id => {
                const fm = Other.SimpleForm();
                fm.addButton('修改名称', 'textures/ui/book_edit_default');
                fm.addButton('更新坐标到当前位置', 'textures/ui/refresh');
                fm.addButton('返回上一页', 'textures/ui/icon_import');
                pl.sendForm(fm, (pl, id1) => {
                    switch (id1) {
                        case 0: HomeForm.Edit_Name(pl, id); break;
                        case 1: HomeCore.UpdatePos(pl, id, pl.blockPos); break;
                        case 2: HomeForm.Edit_Panel(pl); break;
                        default: Other.CloseTell(pl); break;
                    }
                })
            })
        } else {
            NoHome(pl);
        }
    }

    /**编辑家-名称 */
    static Edit_Name(pl, id) {
        let Home = db.get('Home');
        const fm = Other.CustomForm();
        fm.addLabel(`当前正在编辑:\n名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}`)
        fm.addInput('输入新名称', 'String', Home[pl.realName][id].name);
        fm.addLabel(Money_Mod.getEconomyStr(pl, Config.Home.EditHome_Name));
        pl.sendForm(fm, (pl, dt) => {
            if (dt == null) return Other.CloseTell(pl);
            if (dt[1] == '') return pl.tell(Gm_Tell + '输入框为空！');
            HomeCore.UpdateName(pl, id, dt[1]);
        })
    }

    /**删除家 */
    static DeleteHome(pl) {
        let Home = db.get('Home');
        if (Home.hasOwnProperty(pl.realName) && Home[pl.realName].length !== 0) {
            SelectAction(pl, Home[pl.realName], false, id => {
                pl.sendModalForm(PLUGIN_INFO.Introduce, `名称： ${Home[pl.realName][id].name}\n坐标： ${Home[pl.realName][id].x},${Home[pl.realName][id].y},${Home[pl.realName][id].z}\n维度： ${Other.DimidToDimension(Home[pl.realName][id].dimid)}\n${Money_Mod.getEconomyStr(pl, Config.Home.DeleteHome)}`, '确认删除', '返回上一页', (_, res) => {
                    switch (res) {
                        case true: HomeCore.DeleteHome(pl, id); break;
                        case false: HomeForm.GoHome(pl); break;
                        default: Other.CloseTell(pl); break;
                    }
                });
            })
        } else {
            NoHome(pl);
        }
    }
}


function NoHome(pl) {
    return pl.tell(Gm_Tell + '你还没有家园传送点,无法继续执行操作！');
}