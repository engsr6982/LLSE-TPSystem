import moneys from "../../../LLSE-Modules/src/moneys.js";
import { config } from "../utils/data.js";

// @ts-ignore

export let money_Instance: moneys = undefined;
export const initMoneyModule = () => {
    money_Instance = new moneys(config.Money);
};
