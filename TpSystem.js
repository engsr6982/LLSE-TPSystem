/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 
import { FileOperation, PLUGIN_INFO, Config, __init } from "./plugins/PPOUI/TpSystem/lib/modules/cache.js";
import { RegEvent } from "./plugins/PPOUI/TpSystem/lib/modules/event.js";
import { RegInterval } from "./plugins/PPOUI/TpSystem/lib/modules/Interval.js";
import { RegCommand } from "./plugins/PPOUI/TpSystem/lib/command/RegCommand.js";
import KVDBTransformation from "./plugins/PPOUI/TpSystem/lib/modules/KVDB.js";
import { DeathCore } from "./plugins/PPOUI/TpSystem/lib/death/DeathCore.js";
import { BegCheckUpdate } from "./plugins/PPOUI/TpSystem/lib/modules/BegCheckUpdate.js";
import checkJSONElements from "./plugins/PPOUI/TpSystem/lib/modules/checkJSONElements.js";

// 往原型链添加新方法
Error.prototype.AError = function () {
    const msg = this.message;
    const st = this.stack;
    const m = `\n如果遇到大量刷屏bug，请输入"ll reload TpSystem"重载插件,请将报错内容(复现方法)提交到GitHub Issue\nLL:${ll.versionString()}  BDS:${mc.getBDSVersion()}  TPSystem: ${PLUGIN_INFO.Version}\n`;
    // eslint-disable-next-line no-console
    logger.error("捕获错误：" + msg + "\n" + st + m);
};


// 插件初始化
function init() {
    // 注册插件
    ll.registerPlugin(
            /* name */ PLUGIN_INFO.Name,
            /* introduction */ PLUGIN_INFO.Introduce,
            /* version */ PLUGIN_INFO.Version,
            /* otherInformation */ {
            "作者": PLUGIN_INFO.Author,
            "MineBBS": PLUGIN_INFO.MineBBS
        }
    );
    // 设置日志等级
    if (File.exists(`.\\plugins\\${PLUGIN_INFO.Author}\\debug`)) {
        logger.setTitle(PLUGIN_INFO.Name + ' Debug');
        logger.setLogLevel(5);
        logger.warn('你已开启Debug模式，将会输出Debug信息');
        mc.listen("onUseItemOn", (pl, it/* , bl, si */) => {
            if (it.type == 'minecraft:stick' && PLUGIN_INFO.DebugAntiShake == false) {
                pl.runcmd("tps ");
                PLUGIN_INFO.DebugAntiShake = true;// 防抖  不防抖可太尼玛难受了
            }
        });
    }

    // 读取文件
    FileOperation.readFile();
    // 注册监听器
    RegEvent();
    // 注册循环检查器
    RegInterval();
    mc.listen('onServerStarted', () => {
        // 注册命令
        RegCommand();
        // 初始化数据库
        new KVDBTransformation().init();
        // 检查配置文件
        new checkJSONElements(__init.Config, Config, true).check().then(newConfig => { FileOperation.setConfig(newConfig).saveFile(); }).catch(e => { logger.error(`${e}\n${e.stack}`); });
        // 转换玩家死亡数据
        DeathCore.convertPlayerData();
        // 检查版本更新  测试时不检查
        if (!File.exists(`.\\plugins\\${PLUGIN_INFO.Author}\\debug`)) {
            BegCheckUpdate(PLUGIN_INFO.Name, PLUGIN_INFO.MineBBS, PLUGIN_INFO.Version);
        }
    });

    logger.info(`版本: ${PLUGIN_INFO.Version.join().replace(/\,\d$/, '').replace(/,/g, '.')}`);
    logger.info(`作者: ${PLUGIN_INFO.Author}`);
    logger.info(`MineBBS: ${PLUGIN_INFO.MineBBS}`);
}

init();