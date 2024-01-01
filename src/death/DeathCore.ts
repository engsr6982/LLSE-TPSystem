import { time } from "../../../LLSE-Modules/src/Time.js";
import { config } from "../utils/data.js";
import { leveldb } from "../utils/leveldb.js";
import { convertPosToVec3, convertVec3ToPos, hasOwnProperty_, sendMessageToPlayer } from "../utils/util.js";
import { money_Instance } from "../include/money.js";

function initListen() {
    if (config.Death.Enable) {
        mc.listen("onPlayerDie", (player) => {
            deathCore_Instance.addDeathInfo(player.realName, convertPosToVec3(player.blockPos));
        });
        logger.info(`玩家死亡事件已注册！`);
    }
}

class DeathCore {
    constructor() {
        initListen();
    }

    addDeathInfo(realName: string, vec3: Vec3) {
        const d = leveldb.getDeath();

        if (!hasOwnProperty_(d, realName)) {
            d[realName] = [];
        }

        d[realName].unshift({
            ...vec3,
            time: time.formatDateToString(new Date()),
        });

        if (d[realName].length > config.Death.MaxDeath) {
            d[realName].pop();
        }

        return leveldb.setDeath(d);
    }

    goDeath(player: Player, index: number = 0) {
        const d = leveldb.getDeath();

        if (d[player.realName].length === 0) {
            sendMessageToPlayer(player, "你还没有死亡点信息！");
        }

        if (money_Instance.deductPlayerMoney(player, config.Death.GoDeathMoney)) {
            player.teleport(convertVec3ToPos(d[player.realName][index]))
                ? sendMessageToPlayer(player, "传送成功！")
                : sendMessageToPlayer(player, "传送失败！");
        }
    }
}

export const deathCore_Instance = new DeathCore();
