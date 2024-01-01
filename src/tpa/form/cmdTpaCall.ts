import { config } from "../../utils/data.js";
import { TPARequestSendEvent } from "../../modules/ListenerEvent.js";
import { hasOwnProperty_, sendMessageToPlayer } from "../../utils/util.js";
import { SimpleFormWithPlayer } from "../SimpleFormWithPlayer.js";
import { TPARequestPool } from "../core/TPARequestPool.js";
import { AvailDescription, Available, TPARequest } from "../core/TpaRequest.js";

export class cmdTpaCall_accept_deny extends SimpleFormWithPlayer {
    constructor(player: Player, type: "accept" | "deny") {
        super(player, "TPA | 选择表单");

        this.type = type;
        this.player = player;

        // 请求池没有初始化玩家，故没有请求
        if (!hasOwnProperty_(TPARequestPool.requests, player.xuid)) {
            sendMessageToPlayer(player, "你还没有任何TPA请求！");
        }

        // 获取所有请求者
        const key = Object.keys(TPARequestPool.requests[player.xuid]);
        if (key.length === 0) {
            sendMessageToPlayer(player, "你还没有任何TPA请求！"); // 没有请求者
        } else if (key.length === 1) {
            TPARequestPool.requests[player.xuid][key[0]]; // 只有一个请求，也就是 [0]
        } else {
            this.select(); // 多个请求
        }
    }

    type: "accept" | "deny";
    player: Player;

    select() {
        const allReq = TPARequestPool.requests[this.player.xuid]; // 取出所有请求
        // 遍历请求
        for (const req in allReq) {
            super.addButton(allReq[req].sender.realName, () => {
                // 检查请求是否有效
                if (allReq[req].available == Available.Available) {
                    if (this.type === "accept") {
                        allReq[req].accept();
                    } else if (this.type === "deny") {
                        allReq[req].deny();
                    } else {
                        sendMessageToPlayer(this.player, "插件错误，请重试！");
                    }
                }
            });
        }
    }
}

export class cmdTpaCall_to_here {
    constructor(sendPlayer: Player, targetPlayer: Array<Player>, type: "to" | "here") {
        this.type = type;
        this.sendPlayer = sendPlayer;
        this.targetPlayer = targetPlayer;

        this.action();
    }

    sendPlayer: Player;
    targetPlayer: Array<Player>;
    type: "to" | "here";
    tpaCoreType = {
        to: "tpa",
        here: "tpahere",
    };

    checkTarget() {
        if (this.targetPlayer.length === 0) {
            sendMessageToPlayer(this.sendPlayer, "目标玩家选择器错误！");
            return false;
        } else if (this.targetPlayer.length !== 1) {
            sendMessageToPlayer(this.sendPlayer, "仅支持对一位玩家发起TPA！");
        }
        return true;
    }

    action() {
        // A => B
        // A <= B
        if (!this.checkTarget()) return;
        const req = new TPARequest(this.sendPlayer, this.targetPlayer[0], this.tpaCoreType[this.type], config.Tpa.CacheExpirationTime);
        const askResult = req.ask();
        if (askResult != Available.Available) {
            this.sendPlayer.tell(AvailDescription(askResult));
        }
        TPARequestSendEvent.exec(req, askResult == Available.Available);
    }
}
