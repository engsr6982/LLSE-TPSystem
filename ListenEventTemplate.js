
// 导入 Listener 模块   下载地址: gitee.com/minimouse0/listenapi
import { Listener } from "./plugins/lib/listenAPI.js";

// 监听     被监听插件名        本插件名          TpSystem TPA请求发送事件    回调函数
Listener.on("TpSystem", "ListenEventTemplate", "onTpSystemTpaRequestSend", result => {
    /** onTpSystemTpaRequestSend 事件回调参数
        sender:<Player>,  time:{},      reciever:<Player>,  type:tpa,   lifespan:300000}
        请求者            请求发生时间    请求目标            请求种类     请求有效期
    */
});

