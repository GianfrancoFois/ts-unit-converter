import {getUnit, getUnitAbbreviation, setInDisplayUnits, TSUnitConverter} from "../src";
import {MyClass} from "./MyClass";

//lets say all the volumes without sourceUnit specified will be 'liters'
TSUnitConverter.setDefaultSourceUnit('volume', "liters");

const obj = new MyClass({
    distance: 5000, //sourceUnit: meters
    radius: "60", //sourceUnit: inches
    volume: 180, //sourceUnit: liters
});

//by default the unit system is metric
console.log('metric distance: ', obj.distance + " " + getUnit<MyClass>(obj, "distance")); // 5 kilometers
console.log('metric radius: ', obj.radius + " " + getUnit<MyClass>(obj, "radius")); // 1.524 meters
console.log('metric volume: ', obj.volume + " " + getUnit<MyClass>(obj, "volume")); // 180 liters

//set weight to 12 grams, using the unit displayed
setInDisplayUnits(() => obj.weight = 12);
console.log('metric weight: ', obj.weight + " " + getUnitAbbreviation<MyClass>(obj, "weight")); // 5443 g

TSUnitConverter.setUnitSystem("imperial");
console.log('imperial distance: ', obj.distance + " " + getUnit<MyClass>(obj, "distance")); // 3.1 miles
console.log('imperial radius: ', obj.radius + " " + getUnit<MyClass>(obj, "radius")); // 5 feet
console.log('imperial weight: ', obj.weight + " " + getUnit<MyClass>(obj, "weight")); // 0.42 ounces

//set volume to 10 gallons
setInDisplayUnits(() => obj.volume = 10);
console.log('imperial volume: ', obj.volume + " " + getUnit<MyClass>(obj, "volume")); // 10 gallons

//The source units are preserved when converting to JSON
console.log("JSON:", JSON.stringify(obj)); //{"distance":5000,"radius":60,"volume":37.85,"weight":0.0264}

