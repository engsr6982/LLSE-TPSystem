import moneys from "../../../LLSE-Modules/src/moneys.js";
import { config } from "./data.js";

// @ts-ignore
export let money_ = null;
export const initMoneyModule = () => {
    money_ = new moneys(config.money);
};

export const formatPrintingError = (err: Error) => {
    logger.error(`The plugin captures an error: ${err}`);
    logger.error(`Stack information: ${err.stack}`);
    logger.warn(`If you encounter a persistent throwing error, please reload this plug-in`);
};

export const hasOwnProperty = (obj: object, key: string): boolean => {
    return Object.prototype.hasOwnProperty.call(obj, key);
};
