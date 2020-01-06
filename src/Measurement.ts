import {convert} from "./convert";
import {TSUnitConverter} from "./TSUnitConverter";

export type TypedConfig = {
    type: UnitTypes,
    sourceUnit?: Unit
};

export type SpecificConfig = {
    metric: MetricUnits,
    imperial: ImperialUnits,
    sourceUnit: Unit
};

function isTypedConfig(config: TypedConfig | SpecificConfig): config is TypedConfig {
    return (config as TypedConfig).type != undefined;
}

export function Measurement(config: TypedConfig | SpecificConfig) {
    return function(target: Object, key: string | symbol) {

        let val: any = target[key];

        const getter = (): number =>  {
            if(val == null) return val;

            if(typeof val !== "number"){
                val = parseFloat(val);
            }

            if(isNaN(val)) throw "@Measurement must be used only with numbers or parsable strings";

            if(isTypedConfig(config)){
                const sourceUnit = config.sourceUnit != undefined ? config.sourceUnit : TSUnitConverter.getDefaultSourceUnit(config.type);

                if(sourceUnit == undefined) throw `You must specify a source unit in @Measurement or set a default source unit using TSUnitConverter.setDefaultSourceUnit(type, unit)`;

                return convert(val, sourceUnit, UnitTypesDefaults[config.type])
            } else {
                return convert(val, config.sourceUnit, config);
            }
        };

        const setter = (next: number) => {
            val = next;
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });

    };
}

export const UnitTypesDefaults: {[key: string]: {metric: MetricUnits, imperial: ImperialUnits}} = {
    "distance": {metric: "meters", imperial: "feet"},
    "long-distance": {metric: "kilometers", imperial: "miles"},
    "short-distance": {metric: "centimeters", imperial: "inches"},
    "volume": {metric: "liters", imperial: "gallons" },
    "mass": {metric: "kilograms", imperial: "pounds" },
    "little-mass": {metric: "grams", imperial: "ounces" },
    "temperature": {metric: "celsius", imperial: "fahrenheit" }
};

export type UnitSystem = 'metric' | 'imperial';
export type Unit = MetricUnits | ImperialUnits;
export type UnitTypes = "distance" | "long-distance" | "short-distance" | "volume" | "mass" | "little-mass" | "temperature"
export type ImperialUnits = "feet" | "yards" |"miles" | "inches" | "pounds" | "ounces" | "gallons" | "fahrenheit";
export type MetricUnits = "meters" | "kilometers" | "centimeters" | "kilograms" | "grams" | "liters" | "celsius";