import { pluginFloder } from "./globalVars.js";

export const leveldb = new KVDatabase(pluginFloder.leveldb);

export class leveldbOperation {}

// leveldb data structure

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

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
interface leveldb_Data_Structure {
    home: {
        [xuid: string]: {
            [home_name: string]: Vec3 & dataDate;
        };
    };
    warp: {
        [warp_name: string]: Vec3 &
            dataDate & {
                /** 来源 */
                source: string;
            };
    };
    death: {
        [xuid: string]: [
            Vec3 & {
                time: string;
            },
        ];
    };
    mergerequest: {
        [guid: string]: {
            player: string; // 玩家真名
            xuid: string; // 玩家xuid
            time: string; // 创建时间
            data: Vec3 & {
                // 家数据
                name: string;
            };
        };
    };
    playersettings: {
        [xuid: string]: {
            [rule: string]: any;
        };
    };
}
