interface _oldDeath {
    [playerName: string]: Array<{
        time: string;
        x: number;
        y: number;
        z: number;
        dimid: number;
    }>;
}

interface _oldHome {
    [playerName: string]: Array<{
        name: string;
        x: number;
        y: number;
        z: number;
        dimid: number;
    }>;
}

interface _oldMergeRequestItem {
    player: string;
    guid: string;
    time: string;
    data: {
        name: string;
        x: number;
        y: number;
        z: number;
        dimid: number;
    };
}

interface _oldPlayerSetting {
    [playerName: string]: {
        AcceptTransmission: boolean;
        SecondaryConfirmation: boolean;
        DeathPopup: boolean;
    };
}

interface _oldWarpItem {
    name: string;
    x: number;
    y: number;
    z: number;
    dimid: number;
}

interface _oldDatabase {
    Death: _oldDeath;
    Home: _oldHome;
    MergeRequest: _oldMergeRequestItem[];
    PlayerSeting: _oldPlayerSetting;
    Warp: _oldWarpItem[];
}
