import moneys from "../../../LLSE-Modules/src/moneys.js";
import { config } from "./data.js";
import { tellTitle } from "./globalVars.js";

// @ts-ignore
export let money_: moneys = undefined;
export const initMoneyModule = () => {
    money_ = new moneys(config.Money);
};

export const formatPrintingError = (err: Error) => {
    logger.error(`The plugin captures an error: \n${err}`);
    logger.error(`${err.stack}`);
    logger.warn(`If you encounter a persistent throwing error, please reload this plug-in`);
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
