import { TPARequest } from "./TpaRequest.js";

/**
 * 全局请求池
 */
export class TPARequestPool {
    /** 请求池 */
    static requests: {
        [recieverXUID: string]: {
            [senderXUID: string]: TPARequest;
        };
    } = {};

    /**
     * 初始化请求池中的玩家格
     * @param xuid 玩家xuid
     */
    private static initPlayer(xuid: string) {
        if (this.requests[xuid] == undefined) {
            this.requests[xuid] = {};
        }
    }

    /** 基于时间的哈希表，用于存储请求 */
    private static requestMap: Map<number, TPARequest[]> = new Map();

    /**
     * 放入一个请求
     * @param request 要缓存的tpa请求
     */
    static addRequest(request: TPARequest) {
        this.initPlayer(request.reciever.xuid);
        this.requests[request.reciever.xuid][request.sender.xuid] = request;
        const expireTime = Math.ceil((request.time.getTime() + request.lifespan) / 1000);
        if (!this.requestMap.has(expireTime)) {
            this.requestMap.set(expireTime, []);
        }
        this.requestMap.get(expireTime).push(request);
        return true;
    }

    /**
     * 从请求池中删除一个请求
     * @param sender 发送者的xuid
     * @param reciever 接收者的xuid
     */
    static deleteRequest(sender: string, reciever: string) {
        this.requests[reciever][sender] = null;
        delete this.requests[reciever][sender];
        return true;
    }
    /**
     * 清理过期或失效的请求
     */
    static cleanup() {
        const now = Math.ceil(Date.now() / 1000);
        for (const [expireTime, requests] of this.requestMap.entries()) {
            if (expireTime <= now) {
                for (const request of requests) {
                    this.deleteRequest(request.sender.xuid, request.reciever.xuid);
                }
                this.requestMap.delete(expireTime);
            } else {
                break;
            }
        }
    }

    /**
     * 启动定时器，定期清理过期或失效的请求
     */
    static startCleanupInterval() {
        setInterval(() => this.cleanup(), 1000); // 每秒清理一次
    }
}

TPARequestPool.startCleanupInterval();
