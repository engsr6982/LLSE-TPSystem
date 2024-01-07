import { leveldb } from "../utils/leveldb.js";
import { convertPosToVec3, convertVec3ToPos, hasOwnProperty_, sendMessage } from "../utils/util.js";
import { money_Instance } from "../include/money.js";
import { time } from "../../../LLSE-Modules/src/Time.js";
import { config } from "../utils/data.js";

class HomeCore {
    constructor() {}

    // 以下方法仅限管理Gui调用

    _addHome(realName: string, name: string, vec3: Vec3): boolean {
        logger.warn(vec3);
        const home = leveldb.getHome();
        if (!hasOwnProperty_(home, realName)) {
            // 初始化数据
            home[realName] = {};
        }
        if (hasOwnProperty_(home[realName], name)) return false; // 防止家名称重复（防重复创建
        home[realName][name] = {
            ...vec3,
            createdTime: time.formatDateToString(new Date()),
            modifiedTime: "",
        };
        return leveldb.setHome(home);
    }

    _deleteHome(realName: string, name: string): boolean {
        const home = leveldb.getHome();
        if (!hasOwnProperty_(home, realName)) return false; // no home
        delete home[realName][name];
        return leveldb.setHome(home);
    }

    _editHome(realName: string, name: string, newData: Vec3 & { name: string }): boolean {
        const h = leveldb.getHome();
        if (!hasOwnProperty_(h, realName) || !hasOwnProperty_(h[realName], name)) return false;
        // rename key
        if (newData.name !== name) {
            if (hasOwnProperty_(h[realName], newData.name)) return false; // 防新数据名称重复
            Object.defineProperty(h[realName], newData.name, Object.getOwnPropertyDescriptor(h[realName], name));
        }
        // update data
        newData.x !== null ? (h[realName][newData.name].x = newData.x) : null; // 为了兼容更新名称、坐标
        newData.x !== null ? (h[realName][newData.name].y = newData.y) : null;
        newData.x !== null ? (h[realName][newData.name].z = newData.z) : null;
        newData.x !== null ? (h[realName][newData.name].dimid = newData.dimid) : null;
        h[realName][newData.name].modifiedTime = time.formatDateToString(new Date());
        return leveldb.setHome(h);
    }

    // 以下方法供玩家调用

    creatHome(player: Player, name: string): boolean {
        if (!money_Instance.deductPlayerMoney(player, config.Home.CreatHomeMoney)) return false; // 检查经济
        const { realName } = player;
        if (Object.keys(leveldb.getHome()[realName] || {}).length >= config.Home.MaxHome) {
            return sendMessage(player, `创建家园传送点[${name}失败！\n最大家园数量：${config.Home.MaxHome}]`);
        }
        return this._addHome(realName, name, convertPosToVec3(player.blockPos));
    }

    goHome(player: Player, name: string): boolean {
        if (!money_Instance.deductPlayerMoney(player, config.Home.GoHomeMoney)) return false;
        const h = leveldb.getHome();
        if (!hasOwnProperty_(h[player.realName], name)) return false;
        return player.teleport(convertVec3ToPos(h[player.realName][name]));
    }

    updateName(player: Player, name: string, newName: string) {
        if (!money_Instance.deductPlayerMoney(player, config.Home.EditNameMoney)) return false;
        return this._editHome(player.realName, name, {
            name: newName,
            x: null,
            y: null,
            z: null,
            dimid: null,
        });
    }

    updatePos(player: Player, name: string) {
        if (money_Instance.deductPlayerMoney(player, config.Home.EditPosMoney)) return false;
        return this._editHome(player.realName, name, {
            ...convertPosToVec3(player.blockPos),
            name: name,
        });
    }

    deleteHome(player: Player, name: string) {
        if (!money_Instance.deductPlayerMoney(player, config.Home.DeleteHomeMoney)) return false;
        return this._deleteHome(player.realName, name);
    }

    getHomeListString(realName: string): string {
        const h = leveldb.getHome();
        if (!hasOwnProperty_(h, realName)) return null;
        return Object.keys(h[realName]).join(" | ");
    }
}

export const homeCore_Instance = new HomeCore();
