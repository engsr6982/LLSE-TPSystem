import { TPARequest } from "./TpaRequest.js";

interface requests_ {
    [key: string]: {
        [key: string]: TPARequest;
    };
}

/**
 * 全局请求池
 */
export class TPARequestPool {
    static requests: requests_ = {};
    constructor() {}

    // static async DeleteCache(pl) {
    //     for (let i = 0; i < TPACache.length; i++) {
    //         if (i.from == pl.realName || i.to == pl.realName) {
    //             let capl = mc.getPlayer(i.from); let name = i.to;
    //             if (i.type == 1) {
    //                 capl = mc.getPlayer(i.to);
    //                 name = i.from;
    //             }s
    //             if (capl) {
    //                 capl.tell(Gm_Tell + `传送失败！玩家[${name}]已离线!`);
    //             }
    //             TPACache.splice(i, 1);
    //         }
    //     }
    // }

    /**
     * 放入一个请求
     * @param request 要缓存的tpa请求
     */
    static add(request: TPARequest) {
        this.initPlayer(request.reciever.xuid);
        TPARequestPool.requests[request.reciever.xuid][request.sender.xuid] = request;
    }

    /**
     * 初始化请求池中的玩家格
     * @param xuid 玩家xuid
     */
    static initPlayer(xuid: string) {
        if (TPARequestPool.requests[xuid] == undefined) {
            TPARequestPool.requests[xuid] = {};
        }
    }

    /**
     * 从请求池中删除一个请求
     * @param sender 发送者的xuid
     * @param reciever 接收者的xuid
     */
    static delete(sender: string, reciever: string) {
        TPARequestPool.requests[reciever][sender] = null;
    }
}
