import { pluginFloder } from "./globalVars.js";

const __config__: ConfigType = {
    Command: {
        Command: "tps",
        Describe: "TPSystem Command",
    },
    Money: {
        Enable: false,
        MoneyType: "llmoney",
        ScoreType: "",
        MoneyName: "金币",
    },
    Tpa: {
        Enable: true,
        Money: 0,
        CacheExpirationTime: 0,
    },
    Home: {
        Enable: true,
        CreatHomeMoney: 0,
        GoHomeMoney: 0,
        EditNameMoney: 0,
        EditPosMoney: 0,
        DeleteHomeMoney: 0,
        MaxHome: 10,
    },
    Warp: {
        Enable: true,
        OpenWarp: true,
        GoWarpMoney: 0,
    },
    Death: {
        Enable: true,
        sendGoDeathGUI: true,
        GoDeathMoney: 0,
        MaxDeath: 0,
        InvincibleTime: {
            unit: "second",
            time: 0,
        },
    },
    Tpr: {
        Enable: true,
        randomRange: {
            min: 100,
            max: 1000,
        },
        Dimension: {
            Overworld: true,
            TheNether: true,
            TheEnd: true,
        },
        restrictedArea: {
            Enable: true,
            Type: "Circle",
            Pos: {
                x: 0,
                z: 0,
                radius: 10,
            },
        },
        Money: 0,
    },
    Pr: {
        Enable: true,
        SendRequestMoney: 0,
        DeleteRequestMoney: 0,
    },
    Rule: {
        DeathPopup: true,
        allowTpa: true,
        tpaPopup: true,
    },
};
const __formJson__: Array<formJSON_Item> = [
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
];

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
        config = JSON.parse(this.readFile(`${pluginFloder.global}Config.json`, JSON.stringify(__config__)));
        formJSON = JSON.parse(this.readFile(`${pluginFloder.data}formJSON.json`, JSON.stringify(__formJson__)));
        return true;
    }
}
