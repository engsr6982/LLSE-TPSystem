export function commandCallback(_: Command, ori: CommandOrigin, out: CommandOutput, result: any) {
    logger.info(JSON.stringify(result, null, 2));
    switch (result) {
    }
}