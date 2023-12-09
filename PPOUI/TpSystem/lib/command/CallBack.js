/* eslint-disable complexity */
//关闭圈复杂度检查

import { SetingForm_Mgr } from "../setting/SetingForm_Mgr.js";
import { FileOperation, MainUI, db } from "../modules/cache.js";
import { MAPPING_TABLE, Main } from "../Main.js";
import { TPR_Core } from "../tpr/TPR_Core.js";
import KVDBTransformation from "../modules/KVDB.js";
import { Perm } from "../modules/PermissionGroup.js";

export function CallBack(_, ori, out, res) {
    logger.debug(JSON.stringify(res)); let plxuid;
    switch (res.action) {
        case "mgr":
            if (ori.type !== 0) return out.error('此命令仅限玩家执行');
            SetingForm_Mgr(ori.player);
            break;
        case "reload":
            if (ori.type !== 7) return out.error('此命令仅限控制台执行');
            FileOperation.readFile();
            out.success('---操作完成---');
            break;
        case "tpr":
            if (!ori.player) return out.error('获取玩家对象失败！');
            TPR_Core(ori.player);
            break;
        case 'back':
            if (!ori.player) return out.error('获取玩家对象失败！');
            MAPPING_TABLE['death'](ori.player);
            break;
        case 'gui':
            if (!ori.player) return out.error('获取玩家对象失败！');
            if (res.gui_name) {
                MAPPING_TABLE[res.gui_name](ori.player);
            } else {
                Main(ori.player, MainUI);
            }
            break;
        case 'accept':
            break;
        case "deny":
            break;
        case "op":
            if (ori.type !== 7) return out.error("Please on Console use this Command");
            plxuid = data.name2xuid(res.name);
            logger.debug(Object.prototype.toString.call(plxuid), plxuid);
            if (plxuid == null || plxuid == "") {
                return out.error(`获取玩家[${res.name}]的XUID失败!`);
            }
            if (Perm.addOP(plxuid)) {
                logger.info(`已添加管理员: ${res.name}`);
            } else {
                logger.error(`添加管理员失败，玩家${res.name} 已是插件管理员`);
            }
            break;
        case "deop":
            if (ori.type !== 7) return out.error("Please on Console use this Command");
            plxuid = data.name2xuid(res.name);
            logger.debug(Object.prototype.toString.call(plxuid), plxuid);
            if (plxuid == null || plxuid == "") {
                return out.error(`获取玩家[${res.name}]的XUID失败!`);
            }
            if (Perm.deOP(plxuid)) {
                logger.info(`已移除管理员: ${res.name}`);
            } else {
                logger.error(`移除管理员失败，玩家${res.name} 不是插件管理员`);
            }
            break;
        case "db": action_db(_, ori, out, res); break;
        default: Main(ori.player, MainUI);
    }
}

// 数据库操作
function action_db(_, ori, out, res) {
    if (ori.type !== 7) return out.error('此命令仅限控制台执行');
    const KVDB = new KVDBTransformation();// 实例化KVDB转换类
    switch (res.acdb) {
        case 'listkey':
            logger.info('[KVDB数据库] 键：', db.listKey());
            break;
        case 'list':
            try {
                if (res.key1) {
                    logger.info('[KVDB数据库] ', db.get(res.key)[res.key1]);
                } else {
                    logger.info('[KVDB数据库] ', db.get(res.key));
                }
            } catch (e) {
                logger.error(`${e}\n${e.stack}`);
            }
            break;
        case 'todb':
            if (KVDB.todb()) {
                out.success('---操作完成---');
            }
            break;
        case 'tojson':
            if (KVDB.tojson()) {
                out.success('---操作完成---');
            }
            break;
        case 'delete':
            try {
                if (res.key1) {
                    let tmp = db.get(res.key); const key1 = res.key1;
                    logger.info('[KVDB数据库] ', delete tmp[key1]);
                    db.set(res.key, tmp);
                } else {
                    logger.info('[KVDB数据库] ', db.delete(res.key));
                }
            } catch (e) {
                logger.error(`${e}\n${e.stack}`);
            }
            break;
    }
}