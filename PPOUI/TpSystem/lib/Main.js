import { HomeForm } from "./home/HomeForm.js";
import { WarpForm } from "./warp/WarpForm.js";
import { TPAEntrance } from "./tpa/form/TPAEntrance.js";
import { TPRForm } from "./tpr/TPRForm.js";
import { DeathForm } from "./death/DeathForm.js";
import { PlayerSetingForm } from "./setting/PlayerSetingForm.js";
import { Other } from "./modules/Other.js";
import { PLUGIN_INFO, _filePath } from "./modules/cache.js";

/**映射表 
 * 通过键数据获取对应函数名，实现方便调用
 * 由于import关系，此方法在本模块中无实际功能
 */
export const MAPPING_TABLE = {
    home: HomeForm.Panel,
    warp: WarpForm,
    tpa: TPAEntrance,
    tpr: TPRForm,
    death: DeathForm.sendGoDeathForm,
    setting: PlayerSetingForm,
    query: DeathForm.sendQueryDeathInfoForm
};

/**
 * GUI主页
 * @param {Object} pl 玩家对象
 * @param {Array} Array 菜单数组
 */
export function Main(pl, Array = []) {
    const fm = Other.SimpleForm();
    fm.setContent(`· 选择一个操作`);
    // 根据传入参数构建按钮
    Array.forEach((i) => {
        fm.addButton(i.name, i.image);
    });
    // 检查数组
    if (Array.length == 0) return pl.tell(`数组为空！ 无法发送表单！`);
    pl.sendForm(fm, (pl, id) => {
        // Debug防抖为true  设置false
        if (PLUGIN_INFO.DebugAntiShake == true) PLUGIN_INFO.DebugAntiShake = false;
        if (id == null) return Other.CloseTell(pl);
        try {
            // 简短变量，方便调用
            const sw = Array[id];
            switch (sw.type) {
                // 执行命令
                case "command": return pl.runcmd(sw.open);
                // 打开子表单
                case "form":
                    if (!File.exists(_filePath + `GUI\\${sw.open}.json`)) {
                        File.writeTo(_filePath + `GUI\\${sw.open}.json`, '[]');
                        return pl.tell(`§c§l文件<${sw.open}.json>不存在！`, 5);
                    };
                    let Menu_Arry = JSON.parse(File.readFrom(_filePath + `GUI\\${sw.open}.json`));
                    logger.debug(Menu_Arry);
                    Main(pl, Menu_Arry);
                    break;
            }
        } catch (e) {
            pl.tell(`§c§l未知错误！`, 5);
            logger.error(`${e}\n${e.stack}`);
        };
    })
}
