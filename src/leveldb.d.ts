interface Vec3 {
    x: number;
    y: number;
    z: number;
    /** 主世界|地狱|末地 */
    dimid: 0 | 1 | 2;
}

interface dataDate {
    /** 创建日期 */
    createdTime: string;
    /** 修改日期 */
    modifiedTime: string;
}

interface home_Structure {
    [realName: string]: {
        [home_name: string]: Vec3 & dataDate;
    };
}

interface warp_Structure {
    [warp_name: string]: Vec3 &
        dataDate & {
            /** 来源 */
            source: string;
        };
}

interface death_Structure {
    [realName: string]: [
        Vec3 & {
            /** 死亡时间 */
            time: string;
        },
    ];
}

interface pr_Structure {
    [guid: string]: {
        /** 玩家真名 */
        playerName: string;
        /** 创建时间 */
        time: string;
        /** 家数据 */
        data: Vec3 & {
            name: string;
        };
    };
}

interface rule_Structure {
    [realName: string]: {
        [rule: string]: any;
    };
}
