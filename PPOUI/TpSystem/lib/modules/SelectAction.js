import { Main } from "../Main.js";
import { HomeForm } from "../home/HomeForm.js";
import { Other } from "./Other.js";
import { MainUI } from "./cache.js";


/**
 * 选择家园/公共 传送点
 * @param {object} pl 玩家对象
 * @param {Array} Array Home/Warp 数据
 * @param {boolean} Warp 是否为Warp
 * @param {number} callback 返回索引
 */
export function SelectAction(pl, Array, Warp = false, callback) {
    const fm = Other.SimpleForm();
    if (Warp) {
        fm.setContent('· 选择一个公共传送点');
    } else {
        fm.setContent('· 选择一个家');
    }

    Array.forEach(i => {
        fm.addButton(`${i.name}\n${Other.DimidToDimension(i.dimid)}  X: ${i.x} Y: ${i.y} Z: ${i.z}`);
    });

    fm.addButton('返回上一页', 'textures/ui/icon_import');
    pl.sendForm(fm, (pl, id) => {
        if (id == null) return Other.CloseTell(pl);
        if (id == Array.length) {
            if (Warp) {
                //warp
                return Main(pl, MainUI);
            } else {
                //home
                return HomeForm.Panel(pl);
            }
        }
        callback(id);
    })
}