export const pluginInformation = {
    /**插件名 */
    name: "TpSystem",
    /**插件描述 */
    introduce: "TpSystem 传送系统",
    /**版本 */
    version: [1, 0, 0, Version.Dev],
    /**作者 */
    author: "PPOUI",
    /**MineBBS资源地址 */
    mineBBS: "https://www.minebbs.com/resources/tpsystem-gui-gui.5755/",
};

// plugin
//  - leveldb
//      any...
//  - data
//      ui.json
//      perm.json
//  - import
//      any...
//  - export
//      any...
//  - build
//      any...
//  config.json

export enum pluginFloder {
    /** 根路径 */
    "global" = ".\\plugins\\PPOUI\\LLSE-TPSystem\\",
    "data" = global + "data\\",
    "leveldb" = global + "leveldb\\",
    "import_" = global + "import\\",
    "export_" = global + "export\\",
}

export const tellTitle = `§e§l[§d${pluginInformation.name}§e]§r§a `;
