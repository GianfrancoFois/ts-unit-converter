import {getUnit, setInDisplayUnits, TSUnitConverter} from "../src";
import {MyClass} from "./MyClass";
import {getUnitAbbreviation} from "../src/PropertyConfigStore";

//lets say all the volumes without sourceUnit specified will be 'liters'
TSUnitConverter.setDefaultSourceUnit('volume', "liters");

const obj = new MyClass({
    distance: 5000, //sourceUnit: meters
    radius: "60", //sourceUnit: inches
    volume: 180, //sourceUnit: liters
});

//by default the unit system is metric
console.log('metric distance: ', obj.distance + ' km'); // 5 kilometers
console.log('metric radius: ', obj.radius  + ' m'); // 1.524 meters
console.log('metric volume: ', obj.volume  + ' l'); // 180 liters

//set weight to 12 grams, using the unit displayed
setInDisplayUnits(() => obj.weight = 12);

console.log('metric weight: ', obj.weight  + ' g'); // 5443 grams

TSUnitConverter.setUnitSystem("imperial");
console.log('imperial distance: ', obj.distance + ' mi'); // 3.1 miles
console.log('imperial radius: ', obj.radius  + ' f'); // 5 feet
console.log('imperial weight: ', obj.weight  + ' ounces'); // 0.42 ounces

//set volume to 10 gallons
setInDisplayUnits(() => obj.volume = 10);
console.log('imperial volume: ', obj.volume  + ' gal'); // 10 gallons

//The source units are preserved when converting to JSON
console.log("JSON:", JSON.stringify(obj)); //{"distance":5000,"radius":60,"volume":37.85,"weight":0.0264}

//Get the unit name and abbreviation for that property, in the displayed unit system.
console.log("imperial radius unit abbreviation: ", getUnitAbbreviation<MyClass>(obj, "radius")); //ft
console.log("imperial radius unit name: ", getUnit<MyClass>(obj, "radius")); //feet
