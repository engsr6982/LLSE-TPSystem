import { pluginFloder } from "./globalVars.js";

const __init = {
    config: {
        command: {
            command: "tps",
            describe: "TPSystem",
        },
        money: {
            Enable: true,
            /** 经济类型 */
            MoneyType: "score",
            /** 计分板经济名称 */
            ScoreType: "",
            /** 经济名称 */
            MoneyName: "",
        },
        tpa: {
            Enable: true,
            /** 玩家到玩家 */
            money: 0,
            /** 缓存过期时间 单位:毫秒 */
            CacheExpirationTime: 0,
        },
    },
    formJson: [
        {
            name: "家园传送",
            image: "textures/ui/village_hero_effect",
            type: "cmd",
            open: "tps gui home",
        },
        {
            name: "公共传送",
            image: "textures/ui/icon_best3",
            type: "cmd",
            open: "tps gui warp",
        },
        {
            name: "玩家传送",
            image: "textures/ui/icon_multiplayer",
            type: "cmd",
            open: "tps gui tpa",
        },
        {
            name: "死亡传送",
            image: "textures/ui/friend_glyph_desaturated",
            type: "cmd",
            open: "tps gui death",
        },
        {
            name: "随机传送",
            image: "textures/ui/mashup_world",
            type: "cmd",
            open: "tps gui tpr",
        },
        {
            name: "个人设置",
            image: "textures/ui/icon_setting",
            type: "cmd",
            open: "tps gui setting",
        },
    ],
};

export let config: ConfigType;

export let formJSON: Array<formJSON_Item>;

export class dataFile {
    static readFile(filePath: string, defData: string = JSON.stringify({})) {
        if (!file.exists(filePath)) {
            file.writeTo(filePath, defData);
        }
        return file.readFrom(filePath);
    }

    static writeFile(filePath: string, writeData: string) {
        return file.writeTo(filePath, writeData);
    }

    static initData() {
        config = JSON.parse(this.readFile(`${pluginFloder.global}Config.json`, JSON.stringify(__init.config)));
        formJSON = JSON.parse(this.readFile(`${pluginFloder.data}formJSON.json`, JSON.stringify(__init.formJson)));
    }
}
