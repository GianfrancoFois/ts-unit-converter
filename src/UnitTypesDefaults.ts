import {ImperialUnits, MetricUnits} from "./Types";

export const UnitTypesDefaults: {[key: string]: {metric: MetricUnits, imperial: ImperialUnits}} = {
    "distance": {metric: "meters", imperial: "feet"},
    "long-distance": {metric: "kilometers", imperial: "miles"},
    "short-distance": {metric: "centimeters", imperial: "inches"},
    "volume": {metric: "liters", imperial: "gallons" },
    "mass": {metric: "kilograms", imperial: "pounds" },
    "little-mass": {metric: "grams", imperial: "ounces" },
    "temperature": {metric: "celsius", imperial: "fahrenheit" }
};
