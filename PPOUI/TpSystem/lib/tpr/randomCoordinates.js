// LiteLoader-AIDS automatic generated
/// <reference path="c:\Users\Administrator\Documents\aids/dts/HelperLib-master/src/index.d.ts"/> 

import { Config } from "../modules/cache.js";

const ZoneCheck_API = {};

/**
 * 生成随机坐标
 */
export function RandomCoordinates() {
    const { Min, Max, restrictedArea } = Config.TPR;// 获取配置项Config
    const _random = () => {
        const num = Math.floor(Math.random() * (Max - Min + 1)) + Min;
        return Math.random() < 0.5 ? -num : num;
    };

    // 根据配置进行生成对应随机坐标对象
    if (restrictedArea.Enable && ll.hasExported("_ZoneCheck_", "_RenamedClass_getRandomCoordinateInCircle")) {
        if (Object.keys(ZoneCheck_API).length == 0) {
            ZoneCheck_API.Circle = ll.imports("_ZoneCheck_", "_RenamedClass_getRandomCoordinateInCircle");
            ZoneCheck_API.Square = ll.imports("_ZoneCheck_", "_RenamedClass_getRandomCoordinateInSquare");
        }
        switch (restrictedArea.Type) {
            case "Circle": return ZoneCheck_API.Circle(restrictedArea.Pos.x, restrictedArea.Pos.z, restrictedArea.Pos.radius);
            case "Square": return ZoneCheck_API.Square(restrictedArea.Pos.x, restrictedArea.Pos.z, restrictedArea.Pos.radius);
        }
    }
    return { x: _random(), z: _random() };// default
}
