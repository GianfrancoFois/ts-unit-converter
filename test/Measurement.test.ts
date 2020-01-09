import { expect } from 'chai';
import {Measurement, TSUnitConverter} from "../src";

describe('Measurement', () => {
    afterEach(() => {
        TSUnitConverter.setUnitSystem('metric');
        TSUnitConverter.setDefaultSourceUnits([]);
    });

    it('should convert meters to feet', () => {
        const object = new TestClass();
        object.distance = 5;
        TSUnitConverter.setUnitSystem('imperial');
        expect(object.distance).to.be.approximately(16.4, 0.1);
    });

    it('should fail because no source unit is defined', () => {
       const object = new TestClass();
       expect(() => object.longDistance = 10).to.throw();
    });

    it('should convert using default source unit', () => {
        TSUnitConverter.setDefaultSourceUnit('long-distance', "yards");
        const object = new TestClass();
        expect(() => object.longDistance = 10).to.not.throw();
        expect(object.longDistance).to.be.approximately(0.009, 0.001)
    });

    it('should fail trying to convert distance to volume', () => {
        TSUnitConverter.setDefaultSourceUnit('long-distance', "liters");
        const object = new TestClass();
        object.longDistance = 5;
        expect(() => object.longDistance).to.throw();
    });

});


export class TestClass {
    @Measurement({type: "distance", sourceUnit: "meters"})
    distance: number;

    @Measurement({type: "long-distance"})
    longDistance: number;
}
