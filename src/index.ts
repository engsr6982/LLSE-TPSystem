import { regCommand } from "./command/regCommand.js";
import { dataFile } from "./utils/data.js";
import { leveldb } from "./utils/leveldb.js";
import { initMoneyModule } from "./utils/util.js";

dataFile.initData();

initMoneyModule();

regCommand();

leveldb.initLevelDB();
