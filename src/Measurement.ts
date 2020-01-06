import {convert} from "./Convert";
import {TSUnitConverter} from "./TSUnitConverter";
import {SpecificConfig, TypedConfig} from "./Types";
import {UnitTypesDefaults} from "./UnitTypesDefaults";

export function Measurement(config: TypedConfig | SpecificConfig) {
    return function (target: Object, key: string | symbol) {

        let val: any = target[key];

        const getter = (): number => {
            if (val == null) return val;

            const isString = typeof val === "string";
            if (isString) {
                val = parseFloat(val);
            }

            if (isNaN(val)) throw "@Measurement must be used only with numbers or parsable strings";

            let result;

            if (isTypedConfig(config)) {
                const sourceUnit = config.sourceUnit != undefined ? config.sourceUnit : TSUnitConverter.getDefaultSourceUnit(config.type);
                if (sourceUnit == undefined) throw `You must specify a source unit in @Measurement or set a default source unit using TSUnitConverter.setDefaultSourceUnit(type, unit)`;
                result = convert(val, sourceUnit, UnitTypesDefaults[config.type])
            } else {
                result = convert(val, config.sourceUnit, config);
            }

            return result;

        };

        const setter = (next) => {
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


function isTypedConfig(config: TypedConfig | SpecificConfig): config is TypedConfig {
    return (config as TypedConfig).type != undefined;
}
