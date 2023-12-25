import { config } from "../utils/data.js";
import { formatPrintingError } from "../utils/util.js";
import { commandCallback } from "./Callback.js";

export function regCommand(): boolean {
    try {
        const cmd = mc.newCommand(config.Command.Command, config.Command.Describe, PermType.Any);

        // ======================================================================== 全局

        cmd.mandatory("name", ParamType.String); // <name: string>
        cmd.mandatory("key_m", ParamType.String); // <key_m: string>
        cmd.optional("key", ParamType.String); // [key: string]
        cmd.optional("key2", ParamType.String); // [key2: string]

        // ======================================================================== 家园

        cmd.setEnum("home", ["home"]);
        cmd.mandatory("action", ParamType.Enum, "home"); // ... home

        // tps home
        cmd.overload(["home"]);

        // tps home list
        cmd.setEnum("list", ["list"]);
        cmd.mandatory("home", ParamType.Enum, "list");
        cmd.overload(["home", "list"]);

        // tps home go <name: string>
        cmd.setEnum("go", ["go"]);
        cmd.mandatory("home", ParamType.Enum, "go");
        cmd.overload(["home", "go", "name"]);

        // tps home add <name: string>
        cmd.setEnum("add", ["add"]);
        cmd.mandatory("home", ParamType.Enum, "add");
        cmd.overload(["home", "add", "name"]);

        // tps home del <name: string>
        cmd.setEnum("del", ["del"]);
        cmd.mandatory("home", ParamType.Enum, "del");
        cmd.overload(["home", "del", "name"]);

        // ======================================================================== 公共点

        cmd.setEnum("warp", ["warp"]);
        cmd.mandatory("action", ParamType.Enum, "warp"); // ... warp

        // tps warp
        cmd.overload(["warp"]);

        // tps warp list
        cmd.setEnum("list_", ["list"]); // 加下划线是为了防止报错
        cmd.mandatory("warp", ParamType.Enum, "list_");
        cmd.overload(["warp", "list_"]);

        // tps warp go <name: string>
        cmd.setEnum("go_", ["go"]);
        cmd.mandatory("warp", ParamType.Enum, "go_");
        cmd.overload(["warp", "go_", "name"]);

        // tps warp add <name: string>
        cmd.setEnum("add_", ["add"]);
        cmd.mandatory("warp", ParamType.Enum, "add_");
        cmd.overload(["warp", "add_", "name"]);

        // tps warp del <name: string>
        cmd.setEnum("del_", ["del"]);
        cmd.mandatory("warp", ParamType.Enum, "del_");
        cmd.overload(["warp", "del_", "name"]);

        // ======================================================================== 控制台

        // tps reload
        cmd.setEnum("reload", ["reload"]);
        cmd.mandatory("action", ParamType.Enum, "reload");
        cmd.overload(["reload"]);

        // ======================================================================== 数据库操作

        cmd.setEnum("leveldb", ["leveldb"]);
        cmd.mandatory("action", ParamType.Enum, "leveldb"); // ... leveldb

        // tps leveldb import
        cmd.setEnum("import", ["import"]);
        cmd.mandatory("leveldb", ParamType.Enum, "import");
        cmd.overload(["leveldb", "import"]);

        // tps leveldb export
        cmd.setEnum("export", ["export"]);
        cmd.mandatory("leveldb", ParamType.Enum, "export");
        cmd.overload(["leveldb", "export"]);

        // tps leveldb list [key: string] [key2: string]
        cmd.setEnum("list_db", ["list"]);
        cmd.mandatory("leveldb", ParamType.Enum, "list_db");
        cmd.overload(["leveldb", "list_db", "key", "key2"]);

        // tps leveldb del <key: string> [key2: string]
        cmd.setEnum("del_db", ["del"]);
        cmd.mandatory("leveldb", ParamType.Enum, "del_db");
        cmd.overload(["leveldb", "del_db", "key_m", "key2"]);

        // ======================================================================== 玩家传送

        cmd.setEnum("tpa", ["tpa"]);
        cmd.mandatory("action", ParamType.Enum, "tpa"); // ... tpa

        // tps tpa
        cmd.overload(["tpa"]);

        // tps tpa deny
        cmd.setEnum("deny", ["deny"]);
        cmd.mandatory("tpa", ParamType.Enum, "deny");
        cmd.overload(["tpa", "deny"]);

        // tps tpa accept
        cmd.setEnum("accept", ["accept"]);
        cmd.mandatory("tpa", ParamType.Enum, "accept");
        cmd.overload(["tpa", "accept"]);

        // tps tpa to <name: string>
        cmd.setEnum("to", ["to"]);
        cmd.mandatory("tpa", ParamType.Enum, "to");
        cmd.overload(["tpa", "to", "name"]);

        // tps tpa here <name: string>
        cmd.setEnum("here", ["here"]);
        cmd.mandatory("tpa", ParamType.Enum, "here");
        cmd.overload(["tpa", "here", "name"]);

        // ======================================================================== 其他

        // tps death
        cmd.setEnum("death", ["death"]);
        cmd.mandatory("action", ParamType.Enum, "death");
        cmd.overload(["death"]);

        // tps pr
        cmd.setEnum("pr", ["pr"]);
        cmd.mandatory("action", ParamType.Enum, "pr");
        cmd.overload(["pr"]);

        // tps rule
        cmd.setEnum("rule", ["rule"]);
        cmd.mandatory("action", ParamType.Enum, "rule");
        cmd.overload(["rule"]);

        // tps back
        cmd.setEnum("back", ["back"]);
        cmd.mandatory("action", ParamType.Enum, "back");
        cmd.overload(["back"]);

        // tps tpr
        cmd.setEnum("tpr", ["tpr"]);
        cmd.mandatory("action", ParamType.Enum, "tpr");
        cmd.overload(["tpr"]);

        // tps menu
        cmd.setEnum("menu", ["menu"]);
        cmd.mandatory("action", ParamType.Enum, "menu");
        cmd.overload(["menu"]);

        // tps mgr
        cmd.setEnum("mgr", ["mgr"]);
        cmd.mandatory("action", ParamType.Enum, "mgr");
        cmd.overload(["mgr"]);

        // 回调
        cmd.setCallback(commandCallback);
        return cmd.setup();
    } catch (err) {
        formatPrintingError(err);
    }
}
