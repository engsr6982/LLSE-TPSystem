import { config } from "../utils/data.js";
import { formatPrintingError } from "../utils/util.js";
import { commandCallback } from "./Callback.js";

export function regCommand(): boolean {
    try {
        const cmd = mc.newCommand(config.command.command, config.command.describe, PermType.Any);

        // ======================================================================== 全局

        cmd.mandatory("name", ParamType.String); // <name: string>

        // ======================================================================== 家园

        // tps home
        // tps home list
        // tps home go <name: string>
        // tps home add <name: string>
        // tps home del <name: string>

        // ======================================================================== 公共点

        // tps warp
        // tps warp list
        // tps warp go <name: string>
        // tps warp add <name: string>
        // tps warp del <name: string>

        // ======================================================================== 控制台

        // tps reload

        // ======================================================================== 数据库操作

        // tps leveldb import
        // tps leveldb export
        // tps leveldb list [key: string] [key2: string]
        // tps leveldb del <key: string> [key2: string]

        // ======================================================================== 玩家传送

        // tps tpa
        // tps tpa deny
        // tps tpa accept
        // tps tpa to <name: string>
        // tps tpa here <name: string>

        // ======================================================================== 其他

        // tps death
        // tps pr
        // tps setting
        // tps back
        // tps tpr
        // tps menu
        // tps mgr
        // 回调
        cmd.setCallback(commandCallback);
        return cmd.setup();
    } catch (err) {
        formatPrintingError(err);
    }
}
