import {convert} from "./Convert";
import {GlobalFlags, TSUnitConverter} from "./TSUnitConverter";
import {Config, TypedConfig, Unit} from "./Types";
import {UnitTypesDefaults} from "./UnitTypesDefaults";
import {PropertyConfigStore} from "./PropertyConfigStore";

/* we use a weakMap to hold a set of converted properties for each instance
*  it is used in toJSON to set and convert those properties */
const instancesMap = new WeakMap<any, Set<string>>();

/* @Measurement decorator factory function */
export function Measurement(config: Config): any {
    return (target: any, propertyKey: string | symbol) => {

        //We need to generate a new key for each property, to avoid infinite recursion in getters and setters
        const key = Symbol();

        PropertyConfigStore.setConfig(target, propertyKey, config);

        function getter(): number {
            //@ts-ignore
            const instance = this as any;
            let value = instance[key];

            if (value == null) return value;
            const isString = typeof value === "string";

            /* tries to parse the string to number. If its not parsable, throw an error */
            if (isString) {
                value = parseFloat(value);
            }
            if (isNaN(value)) throw "@Measurement must be used only with numbers or parsable strings";

            const sourceUnit = getSourceUnit(config);
            return isTypedConfig(config)
                ? convert(value, sourceUnit, UnitTypesDefaults[config.type])
                : convert(value, sourceUnit, config);

        }

        function setter(next): void {
            //@ts-ignore
            const instance = this as any;
            const sourceUnit = getSourceUnit(config);

            if (GlobalFlags.isSettingDisplayUnits) {
                instance[key] = isTypedConfig(config)
                    ? convert(next, sourceUnit, UnitTypesDefaults[config.type], true)
                    : convert(next, sourceUnit, config, true);
            } else {
                instance[key] = next;
            }

            //keys that have been converted. We need to retrieve them manually and do the conversion.
            let keys = instancesMap.get(instance) ?? new Set<string>();
            keys.add(propertyKey.toString());
            instancesMap.set(instance, keys);

            instance.toJSON = function () {
                const json = {...instance};
                keys.forEach(key => {
                    const config = PropertyConfigStore.getConfig(instance, key);
                    if(config){
                        const sourceUnit = getSourceUnit(config);
                        json[key] = isTypedConfig(config)
                            ? convert(instance[key], sourceUnit, UnitTypesDefaults[config.type], true)
                            : convert(instance[key], sourceUnit, config, true);
                    }
                });
                return json;
            };
        }

        return {
            get: getter,
            set: setter
        };

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
export function isTypedConfig(config: Config): config is TypedConfig {
    return (config as TypedConfig).type != undefined;
}

