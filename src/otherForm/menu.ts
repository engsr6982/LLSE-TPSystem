import { SimpleFormWithPlayer } from "../tpa/SimpleFormWithPlayer.js";
import { pluginInformation } from "../utils/globalVars.js";
import { sendCloseFormTip } from "../utils/util.js";

export function menu(player: Player, formJSON: Array<formJSON_Item>) {
    // const fm = mc.newSimpleForm();
    // fm.setTitle(pluginInformation.introduce);
    // fm.setContent("· 选择一个操作");
    // // Build the form
    // formJSON.forEach((i) => {
    //     fm.addButton(i.name || "", i.image || undefined);
    // });
    // // send
    // player.sendForm(fm, (pl, id: number | null | undefined) => {
    //     if (!id) return;
    //     const json = formJSON[id];
    //     switch (json.type) {
    //         case "cmd":
    //             return pl.runcmd(json.open as string);
    //         case "subform":
    //             return menu(pl, json.open as Array<formJSON_Item>);
    //     }
    // });
    const fm = new SimpleFormWithPlayer(player, pluginInformation.introduce, "· 选择一个操作");

    formJSON.forEach((i) => {
        fm.addButton(
            i.name || "",
            () => {
                i.type == "cmd" ? player.runcmd(i.open as string) : menu(player, i.open as Array<formJSON_Item>);
            },
            i.image || undefined,
        );
    });

    fm.default = () => {
        sendCloseFormTip(player);
    };
    fm.send();
}
