import moneys from "../../../LLSE-Modules/src/moneys.js";
import { config } from "./data.js";
import { tellTitle } from "./globalVars.js";

// @ts-ignore
export let money_: moneys = undefined;
export const initMoneyModule = () => {
    money_ = new moneys(config.Money);
};

export const formatPrintingError = (err: Error) => {
    logger.error(`The plugin captures an error: \n${err}\n${err.stack}`);
    logger.warn(`If you encounter a persistent throwing error, please reload this plugin`);
};

export const hasOwnProperty_ = (obj: object, key: string): boolean => {
    return Object.prototype.hasOwnProperty.call(obj, key);
};

export const sendCloseFormTip = (player: Player) => {
    return player.tell(`${tellTitle}表单已放弃`);
};

export const sendMessageToPlayer = (player: Player, msg: string): boolean => {
    return player.tell(tellTitle + msg);
};

// export const formatPosToString = (pos: IntPos | FloatPos) => {
//     const { x, y, z, dim } = pos;
//     return `${dim} | X:${x} | Y:${y} | Z:${z}`;
// };

export const formatVec3ToString = (vec3: Vec3) => {
    const dim = {
        0: "主世界",
        1: "地狱",
        2: "末地",
    };
    const { x, y, z, dimid } = vec3;
    return `${dim[dimid]} | X:${x} | Y:${y} | Z:${z}`;
};

export const isFloat = (n: number): boolean => {
    return n % 1 !== 0;
};

export const convertPosToVec3 = (pos: IntPos | FloatPos): Vec3 => {
    const t = JSON.parse(JSON.stringify(pos));
    delete t["dim"];
    return t;
};

export const convertVec3ToPos = (vec3: Vec3) => {
    const { x, y, z, dimid } = vec3;
    if (isFloat(x) || isFloat(y) || isFloat(z)) {
        return new FloatPos(x, y, z, dimid);
    }
    return new IntPos(x, y, z, dimid);
};
