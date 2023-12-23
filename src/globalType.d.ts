interface formJSON_Item {
    name: string;
    image: string;
    type: "cmd" | "subform";
    open: string | Array<formJSON_Item>;
}

interface ConfigType {
    command: {
        command: "tps";
        describe: "TPSystem";
    };
    money: {
        Enable: true;
        /** 经济类型 */
        MoneyType: "score";
        /** 计分板经济名称 */
        ScoreType: "";
        /** 经济名称 */
        MoneyName: "";
    };
    tpa: {
        Enable: true;
        /** 玩家到玩家 */
        money: 0;
        /** 缓存过期时间 单位:毫秒 */
        CacheExpirationTime: 0;
    };
}
