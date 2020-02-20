import {Config, Unit} from "./Types";
import {isTypedConfig} from "./Measurement";
import {TSUnitConverter} from "./TSUnitConverter";
import {UnitTypesDefaults} from "./UnitTypesDefaults";
import {converter} from "./Convert";

export class PropertyConfigStore {

    static setConfig(target: any, key: string | symbol, config: Config) {
        if (target.__unitsConfig) return;
        Object.defineProperty(target, '__unitsConfig-' + key.toString(), {
            value: config,
            writable: false,
            enumerable: false
        });
    }

    static getConfig(target: any, key: string | symbol): Config | undefined {
        return target['__unitsConfig-' + key.toString()];
    }
}

export function getUnit<T>(obj: T, property: keyof T): Unit | "" {
    const config = PropertyConfigStore.getConfig(obj, property as string);
    if (config == undefined) return "";
    if (isTypedConfig(config)) {
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
        case "celsius":
            return "°C";
        case "fahrenheit":
            return "°F";
        case "centimeters":
            return "cm";
        case "feet":
            return "ft";
        case "gallons":
            return "gal";
        case "grams":
            return "g";
        case "inches":
            return "in";
        case "kilograms":
            return "kg";
        case "kilometers":
            return "km";
        case "liters":
            return "l";
        case "meters":
            return "m";
        case "miles":
            return "mi";
        case "ounces":
            return "oz";
        case "pounds":
            return "lb";
        case "yards":
            return "yd";
        case "kmh":
            return "km/h";
        case "mph":
            return "mph";
        default:
            return "";
    }
}

export function convertToUnit<T>(obj: T, property: keyof T, unit: Unit): number | undefined {
    if (obj == null || obj[property] == null) return undefined;
    const config = PropertyConfigStore.getConfig(obj, property as string);
    if (config == undefined) throw "Property '" + property + "' is not configured";
    const displayUnit = getUnit<T>(obj, property);
    if (displayUnit === unit) return obj[property] as any;
    return converter[displayUnit][unit](obj[property]);
}
