import PermissionCore from "../../../LLSE-Modules/src/Permission/PermissionCore.js";
import PermissionForm from "../../../LLSE-Modules/src/Permission/PermissionForm.js";
import { pluginFloder } from "../utils/globalVars.js";

export const permCoreInstance = new PermissionCore(pluginFloder.data + "permission.json", true);

export const permFormInstance = new PermissionForm(pluginFloder.global + "lang\\", () => {
    return permCoreInstance;
});
