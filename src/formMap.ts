import { TPAEntrance } from "./tpa/form/TPAEntrance.js";
import { pluginInformation } from "./utils/globalVars.js";

export const formMap = {
    tpa: TPAEntrance,
    // 主入口表单
    main: (player: Player, formJSON: Array<formJSON_Item>) => {
        const fm = mc.newSimpleForm();
        fm.setTitle(pluginInformation.introduce);
        fm.setContent("· 选择一个操作");
        // Build the form
        formJSON.forEach((i) => {
            fm.addButton(i.name || "", i.image || "");
        });
        // send
        player.sendForm(fm, (pl, id: number | null | undefined) => {
            if (!id) return;
            const json = formJSON[id];
            switch (json.type) {
                case "cmd":
                    return pl.runcmd(json.type);
                case "subform":
                    return formMap["main"](pl, json.open as Array<formJSON_Item>);
            }
        });
    },
};
