import {convert} from "./Convert";
import {GlobalFlags, TSUnitConverter} from "./TSUnitConverter";
import {Config, TypedConfig, Unit} from "./Types";
import {UnitTypesDefaults} from "./UnitTypesDefaults";


/* @Measurement decorator factory function */
export function Measurement(config: Config) {
    return function (target: any, key: string | symbol) {
        let val: any = target[key];

        const getter = (): number => {
            if (val == null) return val;
            const isString = typeof val === "string";

            /* tries to parse the string to number. If its not parsable, throw an error */
            if (isString) {
                val = parseFloat(val);
            }
            if (isNaN(val)) throw "@Measurement must be used only with numbers or parsable strings";

            const sourceUnit = getSourceUnit(config);
            return isTypedConfig(config)
                ? convert(val, sourceUnit, UnitTypesDefaults[config.type])
                : convert(val, sourceUnit, config);

        };

        const setter = (next) => {
            if(GlobalFlags.isSettingDisplayUnits){
                const sourceUnit = getSourceUnit(config);
                val = isTypedConfig(config)
                    ? convert(next, sourceUnit, UnitTypesDefaults[config.type], true)
                    : convert(next, sourceUnit, config, true);
            } else {
                val = next;
            }
        };

        Object.defineProperty(target, key, {
            get: getter,
            set: setter,
            enumerable: true,
            configurable: true,
        });

        // This will be executed for each @Measurement decorator Typescript founds. So, we will be storing the
        // previous toJSON function (can be undefined) and then adding the conversion mechanism for each property
        // based on the config, in order to convert back to the sourceUnit.
        // The conversion is the same, but the reverse parameter is added
        const previousToJSON = target.toJSON;
        target.toJSON = function () {
            let obj = previousToJSON ? previousToJSON() : {};
            if (obj === undefined) {
                obj = {};
            }
            const sourceUnit = getSourceUnit(config);
            obj[key] = isTypedConfig(config)
                ? convert(target[key], sourceUnit, UnitTypesDefaults[config.type], true)
                : convert(target[key], sourceUnit, config, true);
            return obj;
        }

    };
}

function getSourceUnit(config: Config): Unit {
    if (isTypedConfig(config)) {
        const sourceUnit = config.sourceUnit != undefined ? config.sourceUnit : TSUnitConverter.getDefaultSourceUnit(config.type);
        /* if its still undefined or null, means that it was not in the config, nor in the defaults source units*/
        if (sourceUnit == undefined) throw `You must specify a source unit in @Measurement or set a default source unit using TSUnitConverter.setDefaultSourceUnit(type, unit)`;
        return sourceUnit;
    } else {
        return config.sourceUnit;
    }
}

// checks if the config provides a unit type
function isTypedConfig(config: Config): config is TypedConfig {
    return (config as TypedConfig).type != undefined;
}

