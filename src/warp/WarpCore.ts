import { time } from "../../../LLSE-Modules/src/Time.js";
import { permCoreInstance } from "../include/permission.js";
import { config } from "../utils/data.js";
import { leveldb } from "../utils/leveldb.js";
import { convertVec3ToPos, hasOwnProperty_ } from "../utils/util.js";
import { money_Instance } from "../include/money.js";

class WarpCore {
    constructor() {}

    addWarp_(name: string, vec3: Vec3) {
        const w = leveldb.getWarp();
        if (hasOwnProperty_(w, name)) return false;
        w[name] = { ...vec3, createdTime: time.formatDateToString(new Date()), modifiedTime: "" };
        return leveldb.setWarp(w);
    }

    deleteWarp_(name: string) {
        const w = leveldb.getWarp();
        if (!hasOwnProperty_(w, name)) return false;
        delete w[name];
        return leveldb.setWarp(w);
    }

    editWarp_(name: string, newData: Vec3 & { name: string }): boolean {
        const w = leveldb.getWarp();
        if (!hasOwnProperty_(w, name)) return false;
        // rename key
        if (newData.name !== name) {
            if (hasOwnProperty_(w, newData.name)) return false; // 防新数据名称重复
            // Object.defineProperty(w, newData.name, Object.getOwnPropertyDescriptor(w, name));
            w[newData.name] = w[name];
            delete w[name];
        }
        // update data
        newData.x !== null ? (w[newData.name].x = newData.x) : null; // 为了兼容更新名称、坐标
        newData.x !== null ? (w[newData.name].y = newData.y) : null;
        newData.x !== null ? (w[newData.name].z = newData.z) : null;
        newData.x !== null ? (w[newData.name].dimid = newData.dimid) : null;
        w[newData.name].modifiedTime = time.formatDateToString(new Date());
        return leveldb.setWarp(w);
    }

    goWarp(player: Player, name: string) {
        if (!money_Instance.deductPlayerMoney(player, config.Warp.GoWarpMoney)) return false;
        const w = leveldb.getWarp();
        if (!hasOwnProperty_(w, name)) return false;
        return player.teleport(convertVec3ToPos(w[name]));
    }

    getWarpListString(): string {
        const w = leveldb.getWarp();
        return Object.keys(w).join(" | ");
    }
}

// 注册权限
permCoreInstance.registerPermission("允许玩家添加Warp", "addWarp");
permCoreInstance.registerPermission("允许玩家删除Warp", "delWarp");

export const warpCore_Instance = new WarpCore();
