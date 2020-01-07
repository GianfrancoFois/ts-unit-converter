export type UnitSystem = 'metric' | 'imperial';
export type Unit = MetricUnits | ImperialUnits;
export type UnitTypes = "distance" | "long-distance" | "short-distance" | "volume" | "mass" | "little-mass" | "temperature"
export type ImperialUnits = "feet" | "yards" |"miles" | "inches" | "pounds" | "ounces" | "gallons" | "fahrenheit";
export type MetricUnits = "meters" | "kilometers" | "centimeters" | "kilograms" | "grams" | "liters" | "celsius";

export type TypedConfig = {
    type: UnitTypes,
    sourceUnit?: Unit
};

export type SpecificConfig = {
    metric: MetricUnits,
    imperial: ImperialUnits,
    sourceUnit: Unit
};

export type Config = TypedConfig | SpecificConfig;
