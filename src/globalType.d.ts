interface formJSON_Item {
    name: string;
    image: string;
    type: "cmd" | "subform";
    open: string | Array<formJSON_Item>;
}

interface ConfigType {
    Command: {
        Command: string;
        Describe: string;
    };
    Money: {
        Enable: boolean;
        /** 经济类型 */
        MoneyType: "llmoney" | "score";
        /** 计分板经济名称 */
        ScoreType: string;
        /** 经济名称 */
        MoneyName: string;
    };
    Tpa: {
        Enable: boolean;
        Money: number;
        CacheExpirationTime: number; // 缓存过期时间 单位:毫秒
        CacheCheckFrequency: number; // 缓存检查频率 单位:毫秒（小于等于0 则关闭） 异步
    };
    Home: {
        Enable: boolean;
        CreatHomeMoney: number; // 创建家
        GoHomeMoney: number; // 前往家
        EditNameMoney: number; // 编辑名称
        EditPosMoney: number; // 编辑坐标
        DeleteHomeMoney: number; // 删除家
        MaxHome: number; // 最大家数量
    };
    Warp: {
        Enable: boolean;
        // OpenWarp: boolean; // 是否开放给玩家
        GoWarpMoney: number;
    };
    Death: {
        Enable: boolean;
        sendGoDeathGUI: boolean; // 死亡后发送弹窗
        GoDeathMoney: number;
        MaxDeath: number; // 最大记录数量
        // InvincibleTime: {
        //     // 无敌时间配置
        //     unit: "second" | "minute";
        //     time: number;
        // };
    };
    Tpr: {
        Enable: boolean;
        randomRange: {
            min: number;
            max: number;
        };
        Dimension: {
            Overworld: boolean;
            TheNether: boolean;
            TheEnd: boolean;
        };
        restrictedArea: {
            Enable: true;
            Type: "Circle" | "Square";
            Pos: {
                x: 0; // 中心X
                z: 0; // 中心 Z
                radius: 10; // 半径
            };
        };
        Money: number;
    };
    Pr: {
        Enable: boolean;
        SendRequestMoney: number; // 发送请求
        DeleteRequestMoney: number; // 删除请求
    };
    Rule: ruleItem;
}

interface ruleItem {
    DeathPopup: boolean;
    allowTpa: boolean;
    tpaPopup: boolean;
}

interface Axis {
    x: number;
    y: number;
    z: number;
}

interface Vec3 extends Axis {
    /** 主世界|地狱|末地 */
    dimid: 0 | 1 | 2;
}

// ==================================== LevelDB

interface dataDate {
    /** 创建日期 */
    createdTime: string;
    /** 修改日期 */
    modifiedTime: string;
}

interface homeStructure {
    [realName: string]: {
        [home_name: string]: Vec3 & dataDate;
    };
}

interface warpStructure {
    [warp_name: string]: Vec3 & dataDate;
}

interface deathStructure {
    [realName: string]: Array<
        Vec3 & {
            /** 死亡时间 */
            time: string;
        }
    >;
}

interface prStructureItem {
    guid: string;
    playerRealName: string;
    time: string;
    data: Vec3 & {
        name: string;
    };
}

type prStructure = Array<prStructureItem>;

interface ruleStructure {
    [realName: string]: ruleItem;
}

interface _leveldbType {
    homeStructure: homeStructure;
    warpStructure: warpStructure;
    deathStructure: deathStructure;
    prStructure: prStructure;
    ruleStructure: ruleStructure;
}
