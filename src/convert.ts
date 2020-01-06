import {ImperialUnits, MetricUnits, Unit, UnitSystem} from "./Measurement";
import {TSUnitConverter} from "./TSUnitConverter";

export function convert(value: number,
                        from: Unit,
                        units: { metric: MetricUnits, imperial: ImperialUnits }): number {
    const system = TSUnitConverter.getUnitSystem();
    const to = system === "metric" ? units.metric : units.imperial;
    if(from === to){
        return value;
    }

    if(converter[units.metric][units.imperial] == undefined){
        throw `Cannot convert between ${units.metric} and ${units.imperial} or vice versa`;
    }

    return converter[from][to](value);

}

const converter = {
    'meters': {
        'kilometers': (val) => val / 1000,
        'centimeters': (val) => val * 100,
        'yards': (val) => val * 1.094,
        'miles': (val) => val / 1609,
        'inches': (val) => val * 39.37,
        'feet': (val) => val * 3.281,
    },
    'kilometers': {
        'meters': (val) => val * 1000,
        'centimeters': (val) => val * 100000,
        'yards': (val) => val * 1094,
        'miles': (val) => val / 1.609,
        'inches': (val) => val * 39370,
        'feet': (val) => val * 3281,
    },
    'centimeters': {
        'meters': (val) => val / 100,
        'kilometers': (val) => val / 100000,
        'yards': (val) => val / 91.44,
        'miles': (val) => val / 160934,
        'inches': (val) => val / 2.54,
        'feet': (val) => val / 30.48,
    },
    'yards': {
        'meters': (val) => val / 1.094,
        'kilometers': (val) => val / 1094,
        'centimeters': (val) => val * 91.44,
        'miles': (val) => val / 1760,
        'inches': (val) => val * 36,
        'feet': (val) => val * 3,
    },
    'miles': {
        'meters': (val) => val * 1609,
        'kilometers': (val) => val * 1.609,
        'centimeters': (val) => val * 160934,
        'yards': (val) => val * 1760,
        'inches': (val) => val * 63360,
        'feet': (val) => val * 5280,
    },
    'inches': {
        'meters': (val) => val / 39.37,
        'kilometers': (val) => val / 39370,
        'centimeters': (val) => val * 2.54,
        'yards': (val) => val / 36,
        'miles': (val) => val / 63360,
        'feet': (val) => val / 12,
    },
    'feet': {
        'meters': (val) => val / 3.281,
        'kilometers': (val) => val / 3281,
        'centimeters': (val) => val * 30.48,
        'yards': (val) => val / 3,
        'miles': (val) => val / 5280,
        'inches': (val) => val * 12,
    },
    'liters': {
        'gallons': (val) => val / 3.785,
    },
    'gallons': {
        'liters': (val) => val * 3.785,
    },
    'grams': {
        'kilograms': (val) => val / 1000,
        'pounds': (val) => val / 454,
        'ounces': (val) => val / 28.35,
    },
    'kilograms': {
        'grams': (val) => val * 1000,
        'pounds': (val) => val * 2.205,
        'ounces': (val) => val * 35.274,
    },
    'pounds': {
        'kilograms': (val) => val / 2.205,
        'grams': (val) => val * 454,
        'ounces': (val) => val * 16,
    },
    'ounces': {
        'kilograms': (val) => val / 35.274,
        'grams': (val) => val * 28.35,
        'pounds': (val) => val / 16,
    },
    'celsius': {
        'fahrenheit': (val) => ((val * (9/5)) + 32),
    },
    'fahrenheit': {
        'celsius': (val) => ((val - 32) * (5/9)),
    },


};


