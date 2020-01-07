import {Unit, UnitSystem, UnitTypes} from "./Types";

export class TSUnitConverter {

    private static _unitSystem: UnitSystem = "metric";
    private static _defaultSourceUnits: string[] = [];

    static setUnitSystem = (unitSystem: UnitSystem) => {
        TSUnitConverter._unitSystem = unitSystem;
    };

    static getUnitSystem = (): UnitSystem => TSUnitConverter._unitSystem;

    static setDefaultSourceUnit = (type: UnitTypes, unit: Unit) => {
        TSUnitConverter._defaultSourceUnits[type] = unit;
    };

    static getDefaultSourceUnit = (type: UnitTypes): Unit | undefined => {
        return TSUnitConverter._defaultSourceUnits[type];
    }

}

export class GlobalFlags {
    static isSettingDisplayUnits = false;
}

export function setInDisplayUnits(func: () => any) {
    try{
        GlobalFlags.isSettingDisplayUnits = true;
        func();
    } finally {
        GlobalFlags.isSettingDisplayUnits = false;
    }
}

