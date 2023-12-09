import { MAPPING_TABLE } from "../Main.js";
import { DeathCore } from "../death/DeathCore.js";
import { Config, DeathInvincible, Gm_Tell, PLUGIN_INFO, db } from "./cache.js";
import { Listener } from "./listenAPI.js";

/**注册监听器 */
export function RegEvent() {
    try {
        /* 监听进服事件 */
        mc.listen('onJoin', (pl) => {
            if (pl.isSimulatedPlayer()) return;
            let PlayerSeting = db.get('PlayerSeting');
            if (!PlayerSeting.hasOwnProperty(pl.realName)) {
                logger.warn(`玩家${pl.realName} 的配置不存在，正在新建配置...`);
                PlayerSeting[pl.realName] = Config.PlayerSeting;
                db.set('PlayerSeting', PlayerSeting);
            } else if (Config.AutoCompleteAttributes) {
                // 0.0.5版本新增属性检查
                for (let ps in Config.PlayerSeting) {
                    if (Config.PlayerSeting.hasOwnProperty(ps) && !PlayerSeting[pl.realName].hasOwnProperty(ps)) {
                        PlayerSeting[pl.realName][ps] = Config.PlayerSeting[ps];
                        logger.warn(`玩家[${pl.realName}] ${ps} 属性缺失，已自动补齐`);
                    }
                }
                db.set('PlayerSeting', PlayerSeting);
            }
        });

        /* 监听死亡事件 */
        if (Config.Death.Enable) {
            mc.listen('onPlayerDie', (pl) => {
                logger.debug(pl.isSimulatedPlayer());
                // 未知情况，pl => Null
                // 经过测试 使用LLSE-FakePlayer导致pl => Null  (2023年7月16日/1.20.11/2.15.0-beta2)
                // 其它假人插件无此问题
                if (pl.isSimulatedPlayer() /* 兼容LLSE-FakePlayer */ || !pl || !pl.pos) return;
                const data = {
                    time: system.getTimeStr(),
                    x: pl.blockPos.x,
                    y: pl.blockPos.y,
                    z: pl.blockPos.z,
                    dimid: pl.blockPos.dimid
                };
                pl.tell(Gm_Tell + `已记录死亡点<${pl.blockPos}>`);
                DeathCore.addDeathInfo(pl.realName, data);
            });
        }

        //玩家重生
        mc.listen('onRespawn', (pl) => {
            if (pl.isSimulatedPlayer() || !pl) return;
            if (pl.gameMode !== 0 && pl.gameMode !== 2) return;//非生存/冒险 模式不发送表单
            let count = 50;
            if (pl.pos.dimid == 0 || pl.getRespawnPosition().dimid == pl.pos.dimid) {
                // 在主世界 或 重生维度在当前维度
                send(pl);
            } else {
                // 不在主世界 注册循环检查器 
                const id = setInterval(() => {
                    if (pl !== null && count > 0) {
                        // 玩家对象不为null 且 count 大于0
                        if (pl.isInsidePortal == 0 && pl.pos.dimid == 0) {
                            // 玩家在主世界 且 不在传送门中
                            send(pl);
                            clearInterval(id);// 清理任务
                        } else {
                            count--;
                        }
                    } else {
                        // 玩家离线/count小于0   取消任务
                        clearInterval(id);
                    }
                }, 1000);
            }

            function send(pl) {
                let PlayerSeting = db.get('PlayerSeting');
                if (Config.Death.sendBackGUI == true && PlayerSeting[pl.realName].DeathPopup == true) {
                    setTimeout(() => {// 延时一下防止操作过快
                        MAPPING_TABLE["death"](pl);// 发送返回死亡点弹窗
                    }, 500);
                }
            }
        });

        // 受伤事件
        mc.listen("onMobHurt", function (mob/* , source, damage, cause */) {
            if (DeathInvincible.length == 0) return;// 无缓存
            if (mob.isPlayer()) {
                // 是玩家 获取玩家对象
                const pl = mc.getPlayer(mob.uniqueId);
                const index = DeathInvincible.findIndex(i => i.name === pl.realName);
                if (index !== -1) {
                    return false;
                }
            }
        });

        //注册监听器
        Listener.init(PLUGIN_INFO.Name);
    } catch (err) {
        logger.error(`注册监听器时遇到错误！\n ${err}\n${err.stack}`);
    }
}
export let TPARequestSendEvent = new Listener("onTpSystemTpaRequestSend");

