import {Measurement} from "./Measurement";

export class Report {

    @Measurement({type: "long-distance", sourceUnit: 'meters'})
    distance: number;

    @Measurement({metric: "meters", imperial: "feet", sourceUnit: "inches"})
    radius: string;

    constructor(o?: Partial<Report>) {
        Object.assign(this, o);
    }

}