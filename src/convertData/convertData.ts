export function convertData(oldData: _oldDatabase): {
    death: deathStructure;
    home: homeStructure;
    pr: prStructure;
    rule: ruleStructure;
    warp: warpStructure;
} {
    log("开始转换数据...");

    const death_Structure: deathStructure = {};
    for (const playerName in oldData.Death) {
        // @ts-ignore
        death_Structure[playerName] = oldData.Death[playerName].map((death) => ({
            ...death,
            time: death.time,
        }));
    }
    log("完成death_Structure转换");

    const home_Structure: homeStructure = {};
    for (const playerName in oldData.Home) {
        home_Structure[playerName] = oldData.Home[playerName].reduce((acc, home) => {
            const nn = home.name;
            delete home["name"];
            return {
                ...acc,
                [nn]: {
                    ...home,
                    createdTime: "",
                    modifiedTime: "",
                },
            };
        }, {});
    }
    log("完成home_Structure转换");

    // @ts-ignore
    const pr_Structure: prStructure = oldData.MergeRequest.map((request) => ({
        guid: request.guid,
        playerName: request.player,
        time: request.time,
        data: {
            ...request.data,
            name: request.data.name,
        },
    }));
    log("完成pr_Structure转换");

    const rule_Structure: ruleStructure = {};
    // @ts-ignore
    for (const playerName in oldData.PlayerSetting) {
        rule_Structure[playerName] = {
            // @ts-ignore
            DeathPopup: oldData.PlayerSetting[playerName].DeathPopup,
            allowTpa: true,
            tpaPopup: true,
        };
    }
    log("完成rule_Structure转换");

    const warp_Structure: warpStructure = {};
    for (const warp of oldData.Warp) {
        delete warp["name"];
        // @ts-ignore
        warp_Structure[warp.name] = {
            ...warp,
            createdTime: "",
            modifiedTime: "",
        };
    }
    log("完成warp_Structure转换");

    log("完成所有转换");
    return {
        death: death_Structure,
        home: home_Structure,
        pr: pr_Structure,
        rule: rule_Structure,
        warp: warp_Structure,
    };
}
