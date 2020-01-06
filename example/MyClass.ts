import {Measurement} from "../src/Measurement";

export class MyClass {

    @Measurement({type: "long-distance", sourceUnit: 'meters'})
    distance: number;

    @Measurement({metric: "meters", imperial: "feet", sourceUnit: "inches"})
    radius: string;

    @Measurement({type: "volume"})
    volume: number;

    @Measurement({metric: "grams", imperial: "ounces", sourceUnit: "pounds"})
    weight: number;

    constructor(o: Partial<MyClass>) {
        Object.assign(this, o)
    }

}