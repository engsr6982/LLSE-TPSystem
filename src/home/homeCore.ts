import { leveldb } from "../utils/leveldb.js";
import { hasOwnProperty_, money_ } from "../utils/util.js";
import { time } from "../../../LLSE-Modules/src/Time.js";
import { config } from "../utils/data.js";

class homeCore {
    constructor() {}

    addHome(player: Player, name: string, vec3: Vec3): boolean {
        const home = leveldb.getHome();
        const { xuid } = player;
        if (!hasOwnProperty_(home, xuid)) {
            // 初始化数据
            home[xuid] = {};
        }
        if (hasOwnProperty_(home[xuid], name)) return false; // 防止家名称重复（防重复创建
        if (!money_.deductPlayerMoney(player, config)) return false; // 检查经济
        const { x, y, z, dimid } = vec3;
        home[xuid][name] = {
            x: x,
            y: y,
            z: z,
            dimid: dimid,
            createdTime: time.formatDateToString(new Date()),
            modifiedTime: "",
        };
        return leveldb.setHome(home);
    }

    goHome(player: Player, pos: IntPos | FloatPos): boolean {}
}

export const homeInst = new homeCore();
