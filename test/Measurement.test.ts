import { expect } from 'chai';
import {Measurement, setInDisplayUnits, TSUnitConverter} from "../src";
import {convertToUnit} from "../src/PropertyConfigStore";

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

    it('should set in display units', () => {
        const object = new TestClass();
        TSUnitConverter.setUnitSystem("imperial");
        setInDisplayUnits(() => {
           object.distance = 32.8 //feet
        });
        TSUnitConverter.setUnitSystem('metric');
        expect(object.distance).to.be.approximately(10, 0.1); //10 meters
    });

    it('should get unit in feet', () => {
        const object = new TestClass();
        object.distance = 5; //meters
        TSUnitConverter.setUnitSystem('imperial');
        const inFeet = convertToUnit<TestClass>(object, "distance", "feet");
        expect(inFeet).to.be.approximately(16.4, 0.1);
    });

    it('should keep source units in JSON.stringify', () => {
        const object = new TestClass();
        object.distance = 5; //meters
        TSUnitConverter.setUnitSystem('metric');
        setInDisplayUnits(() => object.volume = 1); //1 liter
        TSUnitConverter.setUnitSystem('imperial');
        const parsed = JSON.parse(JSON.stringify(object));
        expect(parsed.distance).to.be.equal(5);
        expect(parsed.volume).to.be.approximately(0.26, 0.01);
    });

});


export class TestClass {
    @Measurement({type: "distance", sourceUnit: "meters"})
    distance: number;

    @Measurement({type: "long-distance"})
    longDistance: number;

    @Measurement({type: "volume", sourceUnit: 'gallons'})
    volume: number;
}
