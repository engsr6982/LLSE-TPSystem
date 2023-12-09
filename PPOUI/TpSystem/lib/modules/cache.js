
/**插件信息 */
export const PLUGIN_INFO = {
    /**插件名 */
    Name: 'TpSystem',
    /**插件描述 */
    Introduce: 'TpSystem 传送系统',
    /**版本 */
    Version: [0, 7, 0, Version.Release],
    /**作者 */
    Author: 'PPOUI',
    /**MineBBS资源地址 */
    MineBBS: 'https://www.minebbs.com/resources/tpsystem-gui-gui.5755/',
    /**Debug监听器防抖 */
    DebugAntiShake: false//
};

/**文件路径 */
export const _filePath = `.\\Plugins\\${PLUGIN_INFO.Author}\\${PLUGIN_INFO.Name}\\`;
/**游戏tell开头 */
export const Gm_Tell = `§e§l[§d${PLUGIN_INFO.Name}§e]§r§a `;

/**待释放配置文件 */
export const __init = {
    /**配置文件 */
    Config: {
        /**命令配置*/
        "Command": {
            /**命令名称*/
            "name": "tps",
            /**命令描述*/
            "Describe": "传送系统"
        },
        /**经济配置*/
        "Money": {
            /**开关*/
            "Enable": true,
            /**经济类型  llmoney 或 score*/
            "MoneyType": "llmoney",
            /**计分板经济的计分板 llmomey模式不可用*/
            "ScoreType": "money",
            /**经济名称*/
            "MoneyName": "金币"
        },
        /**家园传送配置*/
        "Home": {
            "Enable": true,
            /**创建家 所需经济*/
            "CreateHome": 0,
            /**前往家 经济*/
            "GoHome": 0,
            /**编辑家（名称） 经济*/
            "EditHome_Name": 0,
            /** 编辑家（坐标） 经济*/
            "EditHome_Pos": 0,
            /**删除家 经济*/
            "DeleteHome": 0,
            /**最大家园数量*/
            "MaxHome": 10
        },
        /**公共传送点配置*/
        "Warp": {
            /**开关*/
            "Enable": true,
            /**前往传送点 经济*/
            "GoWarp": 0
        },
        "TPA": {
            /**启用*/
            "Enable": true,
            /**玩家传玩家所需花费*/
            "Player_Player": 0,
            /**缓存过期时间，以毫秒为单位*/
            "CacheExpirationTime": 300000
            /**缓存过期时间单位 "second"秒 "minute"分钟*/
            // "CacheExpirationTimeUnit": "second"
        },
        /**死亡传送配置*/
        "Death": {
            /**开关*/
            "Enable": true,
            /**前往死亡点 经济*/
            "GoDelath": 0,
            /**发送死亡返回传送点弹窗 总开关*/
            "sendBackGUI": true,
            /**记录死亡点上限 */
            "MaxDeathInfo": 1,
            /**无敌时间*/
            "InvincibleTime": 30,
            /**无敌时间单位 "second"秒 "minute"分钟*/
            "InvincibleTimeUnit": "second",
            /**查询死亡点 */
            "QueryDeath": true
        },
        /**随机传送配置*/
        "TPR": {
            /**开关*/
            "Enable": true,
            /**随机坐标最小值 (启用restrictedArea后无效)*/
            "Min": 1000,
            /**最大值 (启用restrictedArea后无效)*/
            "Max": 5000,
            /**所需经济*/
            "Money": 0,
            /**主世界*/
            "MainWorld": true,
            /**地狱*/
            "Infernal": true,
            /**末地*/
            "Terminus": true,
            /**限制区域  依赖ZoneCheck API */
            "restrictedArea": {
                /**启用 */
                "Enable": true,
                /**类别 圆Circle 方Square */
                "Type": "Circle",
                /**中心坐标 */
                "Pos": {
                    "x": 0,// 中心X
                    "z": 0,// 中心 Z
                    "radius": 10// 半径
                }
            }
        },
        /**并入公共传送点配置*/
        "MergeRequest": {
            /**开关*/
            "Enable": true,
            /**发送请求 经济*/
            "sendRequest": 0,
            /**删除请求 经济*/
            "DeleteRequest": 0
        },
        /**玩家配置默认*/
        "PlayerSeting": {
            /**接受传送请求*/
            "AcceptTransmission": true,
            /**传送二次确认*/
            "SecondaryConfirmation": true,
            /**传送请求弹窗*/
            "SendRequestPopup": true,
            /**死亡弹出返回死亡点 子开关*/
            "DeathPopup": true
        },
        /**自动补齐属性*/
        "AutoCompleteAttributes": true
    },
    /**主页表单 */
    MainUI: [
        { "name": '家园传送', "image": 'textures/ui/village_hero_effect', "type": "command", "open": "tps gui home" },
        { "name": '公共传送', "image": 'textures/ui/icon_best3', "type": "command", "open": "tps gui warp" },
        { "name": '玩家传送', "image": 'textures/ui/icon_multiplayer', "type": "command", "open": "tps gui tpa" },
        { "name": '死亡传送', "image": 'textures/ui/friend_glyph_desaturated', "type": "command", "open": "tps gui death" },
        { "name": '随机传送', "image": 'textures/ui/mashup_world', "type": "command", "open": "tps gui tpr" },
        { "name": '个人设置', "image": 'textures/ui/icon_setting', "type": "command", "open": "tps gui setting" }
    ]
};

/**KVDB数据库 */
export const db = new KVDatabase(_filePath + 'db');

/**配置文件 */
export let Config = /* {} */__init.Config;

/**主页UI */
export let MainUI = [];
/**返回死亡点无敌 */
export let DeathInvincible = [];

export class FileOperation {
    // 配置文路径
    static _Config = _filePath + 'Config.json';
    static _MainUI = _filePath + 'GUI\\MainUI.json';

    /**检查文件 */
    static async auditFile() {
        if (!file.exists(this._Config)) file.writeTo(this._Config, JSON.stringify(__init.Config, null, '\t'));
        if (!file.exists(this._MainUI)) file.writeTo(this._MainUI, JSON.stringify(__init.MainUI, null, '\t'));
    }

    static setConfig(newConfig) {
        Config = newConfig;
        return FileOperation;
    }

    /**读取文件 */
    static async readFile() {
        try {
            this.auditFile();
            Config = JSON.parse(file.readFrom(this._Config));
            MainUI = JSON.parse(file.readFrom(this._MainUI));
        } catch (e) {
            logger.error(`[FileOperation] 捕获错误：\n${e}\n${e.stack}`);
        }
    }

    /**保存文件 */
    static async saveFile() {
        try {
            file.writeTo(this._Config, JSON.stringify(Config, null, '\t'));
            file.writeTo(this._MainUI, JSON.stringify(MainUI, null, '\t'));
            this.readFile();
        } catch (e) {
            logger.error(`[FileOperation] 捕获错误：\n${e}\n${e.stack}`);
        }
    }
}

