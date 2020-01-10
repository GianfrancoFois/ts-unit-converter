import {Config, Unit} from "./Types";
import {isTypedConfig} from "./Measurement";
import {TSUnitConverter} from "./TSUnitConverter";
import {UnitTypesDefaults} from "./UnitTypesDefaults";
import {convert, converter} from "./Convert";

export class PropertyConfigStore {

    static _map = new Map<string, Config>();

    static setConfig(target: any, key: string | symbol, config: Config){
        this._map.set(target.constructor.name + "." + key.toString(), config);
    }

    static getConfig(target: any, key: string | symbol): Config | undefined {
        return this._map.get(target.constructor.name + "." + key.toString());
    }
}

export function getUnit<T>(obj: T, property: keyof T): Unit | "" {
    const config = PropertyConfigStore.getConfig(obj, property as string);
    if(config == undefined) return "";
    if(isTypedConfig(config)){
        return TSUnitConverter.getUnitSystem() === "metric" ?
            UnitTypesDefaults[config.type].metric :
            UnitTypesDefaults[config.type].imperial
    } else {
        return TSUnitConverter.getUnitSystem() === "metric" ?
            config.metric : config.imperial
    }
}

export function getUnitAbbreviation<T>(obj: T, property: keyof T): string {
    return getAbbreviation(getUnit<T>(obj, property))
}

function getAbbreviation(unit: Unit | "") {
    switch (unit) {
        case "celsius": return "°C";
        case "fahrenheit": return "°F";
        case "centimeters": return "cm";
        case "feet": return "ft";
        case "gallons": return "gal";
        case "grams": return "g";
        case "inches": return "in";
        case "kilograms": return "kg";
        case "kilometers": return "km";
        case "liters": return "l";
        case "meters": return "m";
        case "miles": return "mi";
        case "ounces": return "oz";
        case "pounds": return "lb";
        case "yards": return "yd";
        default: return "";
    }
}
export function convertToUnit<T>(obj: T, property: keyof T, unit: Unit): number {
    const config = PropertyConfigStore.getConfig(obj, property as string);
    if(config == undefined) throw "Property '" + property + "' is not configured";
    const displayUnit = getUnit<T>(obj, property);
    return converter[displayUnit][unit](obj[property]);
}
