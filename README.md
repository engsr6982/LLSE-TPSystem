# TPSystem --BDS传送系统

## 1. 安装
>
> 请确保你的服务器已安装并运行Liteloader BDS  

1. 下载TPSystem.zip  
2. 解压TpSystem.zip, 解压后会有以下文件  

```file
📁 TpSystem.zip
├── 📁 PPOUI 
│   └── 📁 TpSystem
│       ├── 📁 db   //插件数据库(此文件夹十分重要！请不要删除此文件夹下的文件！否则数据丢失)
│       ├── 📁 GUI  //主页表单
│       ├── 📁 json //数据库操作读取的json目录
│       │   └── 📁 out  //数据库操作输出的json目录
│       └── 📁 lib  //依赖库
├── 📄 TpSystem.js  //入口文件
└── 📄 README.md
```

3. 把上述文件复制到的Plugins文件夹(README.md文件不用复制)  
4. 启动或重启服务端，待Liteloader BDS输出JS插件TPSystem已加载，则代表安装成功

> 关于更新:  
> 你只需要下载新版插件，覆盖/替换掉上述的“入口文件”和“依赖库”  
> 无需担心**配置文件**版本，插件自带配置文件检查器，会全自动补全缺少配置项

## 2. 配置插件

> 通过配置**TPSystem**使它更好的为服务器提供传送功能
> 注意：编辑文件时请使用**VSCode**或其它编辑器编辑文件(**不要用记事本**)

**Config.json**

- 路径：./Plugins/PPOUI/TpSystem/Config.json  

```json
{
    /**命令配置*/
    "Command": {
        /**命令名称*/
        "name": "tps",
        /**命令描述*/
        "Describe": "传送系统"
    },
    /**经济配置*/
    "Money": {
        /**开关*/
        "Enable": true,
        /**经济类型  llmoney 或 score*/
        "MoneyType": "llmoney",
        /**计分板经济的计分板 llmomey模式不可用*/
        "ScoreType": "money",
        /**经济名称*/
        "MoneyName": "金币"
    },
    /**家园传送配置*/
    "Home": {
        "Enable": true,
        /**创建家 所需经济*/
        "CreateHome": 0,
        /**前往家 经济*/
        "GoHome": 0,
        /**编辑家（名称） 经济*/
        "EditHome_Name": 0,
        /** 编辑家（坐标） 经济*/
        "EditHome_Pos": 0,
        /**删除家 经济*/
        "DeleteHome": 0,
        /**最大家园数量*/
        "MaxHome": 10
    },
    /**公共传送点配置*/
    "Warp": {
        /**开关*/
        "Enable": true,
        /**前往传送点 经济*/
        "GoWarp": 0
    },
    "TPA": {
        /**启用*/
        "Enable": true,
        /**玩家传玩家所需花费*/
        "Player_Player": 0,
        /**缓存过期时间，以毫秒为单位*/
        "CacheExpirationTime": 300000
    },
    /**死亡传送配置*/
    "Death": {
        /**开关*/
        "Enable": true,
        /**前往死亡点 经济*/
        "GoDelath": 0,
        /**发送死亡返回传送点弹窗 总开关*/
        "sendBackGUI": true,
        /**记录死亡点上限 */
        "MaxDeathInfo": 1,
        /**无敌时间*/
        "InvincibleTime": 30,
        /**无敌时间单位 "second"秒 "minute"分钟*/
        "InvincibleTimeUnit": "second",
        /**查询死亡点 */
        "QueryDeath": true
    },
    /**随机传送配置*/
    "TPR": {
        /**开关*/
        "Enable": true,
        /**随机坐标最小值 (启用restrictedArea后无效)*/
        "Min": 1000,
        /**最大值 (启用restrictedArea后无效)*/
        "Max": 5000,
        /**所需经济*/
        "Money": 0,
        /**主世界*/
        "MainWorld": true,
        /**地狱*/
        "Infernal": true,
        /**末地*/
        "Terminus": true,
        /**限制区域  此功能依赖ZoneCheck API */
        "restrictedArea": {
            /**启用 */
            "Enable": true,
            /**类别 圆Circle 方Square */
            "Type": "Circle",
            /**中心坐标 */
            "Pos": {
                "x": 0,// 中心X
                "z": 0,// 中心 Z
                "radius": 10// 半径
            }
        }
    },
    /**并入公共传送点配置*/
    "MergeRequest": {
        /**开关*/
        "Enable": true,
        /**发送请求 经济*/
        "sendRequest": 0,
        /**删除请求 经济*/
        "DeleteRequest": 0
    },
    /**玩家配置默认*/
    "PlayerSeting": {
        /**接受传送请求*/
        "AcceptTransmission": true,
        /**传送二次确认*/
        "SecondaryConfirmation": true,
        /**传送请求弹窗*/
        "SendRequestPopup": true,
        /**死亡弹出返回死亡点 子开关*/
        "DeathPopup": true
    },
    /**自动补齐属性*/
    "AutoCompleteAttributes": true
}
```

**MainUI.json**

- 路径：./Plugins/PPOUI/TpSystem/GUI/MainUI.json

TPSystem的主页是按照菜单插件设计的，因此你可以自定义主页，也可以把它当作菜单插件使用

```json
[
    {
  "name": "家园传送",// 按钮名称
  "image": "textures/ui/village_hero_effect",// 图片路径 可留空
  "type": "command",// 类别 见下文解释
  "open": "tps gui home"// 要执行的操作
 },
    {
  "name": "子表单测试",
  "image": "",
  "type": "form",// form代表打开子表单
  "open": "test"// test为子表单文件名  路径为./plugins/ppoui/tpsystem/gui/test.json
 }
]
```

这是TPSystem主页的数据结构，其中 type表示类别，可选的值有：
| type 可选项   |   功能      |
| ---          | ---         |
|  `form`      |  打开子表单  |
|  `command`   |  执行命令    |

`open` --要执行的操作
如果`type`填写`command` 则`open`填写要执行的命令
如果`type`填写`form` 则`open`填写子表单json文件名(**注意不要加后缀.json**)

注意： 子表单的json文件和主表单文件都应放在TPSystem的GUI文件夹下  
如果未创建子表单或open填写不存在的文件名，插件将会自动创建json文件

## 3. 关于命令
>
> 注意： 默认的顶层命令为/**tps** 如有修改，请使用修改后的顶层命令  
> []为可选参数  <>为必选参数   输入命令时不要带上[]和<>  

#### 基础命令

```cmd
/tps [gui] [home,warp,tpa,tpr,death,setting,query]      --打开对应功能GUI
由于未知原因，后面的枚举在游戏中无法展开

/tps tpr     --随机传送（无GUI）

/tps back       --打开返回死亡点GUI

/tps mgr        --打开管理面板GUI(权限：OP)

/tps reload     --重载配置文件

/tps accept     --接受传送请求   初步实现(dev分支)

/tps deny       --拒绝传送请求   初步实现(dev分支)
```

#### 插件管理员命令

```cmd
/tps op <name: String>      --添加一个玩家为插件管理员

/tps deop <name: String>    --移除一个插件管理员
```

#### 数据库操作命令

```cmd
/tps db listkey    --列出数据库所有键

/tps db todb       --json转入数据库

/tps db tojson     --数据库数据转为json

/tps db list <key: string> [key1: string]       --列出某个键的值

/tps db delete <key: string> [key1: string]     --删除某个键的数据   成功显示1  失败0
```

- 操作示例

```cmd
/tps db listkey
使用上方命令获取所有键数据
输出：["Home", "Warp", ...]

/tps db list "Home" 
以Home举例，获取Home键的子键
输出：["engsr6982", "steve", ...]

/tps db list "Home" "engsr6982"
获取玩家engsr6982的家园数据
输出：家园数据 Array[Object, Object, ...]

/tps db delete "Home"
删除Home键的所有数据（不可逆）
输出：0或1

/tps db delete "Home" "engsr6982"
删除玩家engsr6982的家园数据（不可逆）
输出：0或1

/tps db tojson
把KVDB数据库的数据输出为json 保存到
./plugins/ppoui/tpsystem/json/out

/tps db todb
把./plugins/ppoui/tpsystem/json下的数据文件转入数据库（不可逆，覆盖）
如果你误操作导致数据丢失，在./plugins/ppoui/tpsystem/json/out目录下
会有一个名为KVDB_BackUP.bak的文件（json格式），需自行研究转入数据库(此文件为覆盖写入，因此只能保存一次)
```

## 开发者接口

### 事件系统

事件系统模版: [ListenEventTemplate.js](./ListenEventTemplate.js)
打不开请前往仓库获取(MineBBS见上方**版权链接**)

`"onTpSystemTpaRequestSend"` -TPA请求发送
返回数据:

- 类型: Object

```js
{sender:<Player>,  time:{},      reciever:<Player>,  type:tpa,   lifespan:300000}
请求者             请求发生时间    请求目标            请求种类     请求有效期
```

***

## TPSystem 更新日志

### 0.7.0

### 更改

1. 优化TPR
2. 更新**配置文件检查器**
3. TPR支持限定传送区域

***

### 0.6.3

#### fix

1. 对死亡后发送死亡表单进行延时

***

### 0.6.2

#### fix

1. 修复“编辑家GUI”经济显示错误[@ou150654](https://www.minebbs.com/threads/tpsystem-gui-gui.17968/post-122925)

***

### 0.6.1

#### 修复

1. 修复与`LLSE-FakePlayer`插件兼容性问题

***

### 0.6.0

#### 更改  

1. 更换权限组模块（可扩展子用户）  

注意：更新后请删除Perm.json文件，否则会导致报错  

***

### 0.5.4

#### 更改  

1. 解决多个玩家随机传送可能出现的隐性问题

***

### 0.5.3  

#### 更改  

1. 修复TPR时玩家退出导致控制台报错刷屏问题  

***

### 0.5.2

#### 更改  

1. 修复随机传送未正常扣除经济问题

***

### 0.5.1  

#### 更改  

1. 修复主世界随机传送失败Bug  
2. 随机传送支持地狱  

***

### 0.5.0

#### 添加

1. 支持权限组
2. 新增命令tps op和tps deop

#### 更改

1. TPR基本兼容地狱(容易传偏)
2. 增强TPR功能，使用try cacth语法避免一些问题
3. Debug模式下 不会检查版本更新
4. 管理页面权限从OP更改为权限组

#### 移除

1. 移除`拦截丢出物品`配置项和对应代码 (请在MineBBS下载修复插件)

***

### 0.4.0

#### 添加

1. 新版本检测

#### 更改

1. TPA请求页面按钮添加图片

***

### 0.3.0

#### 添加

1. 支持查询历史死亡记录(命令: tps gui query)
2. 配置文件新增配置项`QueryDeath`
3. 注册命令失败添加错误提示

#### 移除

1. GUI移除`inside`入口（请使用命令入口）

注意：此版本GUI/MainUI.json文件不通用

***

### 0.2.0

#### 添加  

1. 记录死亡点时会发送提示  
2. 配置文件 新增配置项 `MaxDeathInfo`  
3. 自动转换旧死亡点信息  

#### 更改  

1. GUI配置文件：内部函数`RandomUi、PlayerUi`更改为`TprUi、TpaUi`  
2. 对TPR的_run函数进行异步  
3. 重生后发送的返回死亡点表单第二个按钮为取消（主表单中打开不变）  

注意：由于更改了死亡点存储类型，不支持退版本！  
