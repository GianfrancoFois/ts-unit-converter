import {TSUnitConverter} from "../src";
import {MyClass} from "./MyClass";

//lets say all the volumes without sourceUnit specified will be 'liters'
TSUnitConverter.setDefaultSourceUnit('volume', "liters");

const obj = new MyClass({
    distance: 5000, //sourceUnit: meters
    radius: "60", //sourceUnit: inches
    volume: 180, //sourceUnit: liters
    weight: 12 //sourceUnit: pounds
});

//by default the unit system is metric
console.log('metric distance: ', obj.distance + ' km'); // 5 kilometers
console.log('metric radius: ', obj.radius  + ' m'); // 1.524 meters
console.log('metric volume: ', obj.volume  + ' l'); // 180 liters
console.log('metric weight: ', obj.weight  + ' g'); // 5443 grams

TSUnitConverter.setUnitSystem("imperial");
console.log('imperial distance: ', obj.distance + ' mi'); // 3.1 miles
console.log('imperial radius: ', obj.radius  + ' f'); // 5 feet
console.log('imperial volume: ', obj.volume  + ' gal'); // 47 gallons
console.log('imperial weight: ', obj.weight  + ' ounces'); // 192 ounces

//The source units are preserved when converting to JSON
console.log("JSON:", JSON.stringify(obj)); //{"distance":5000,"radius":60,"volume":180,"weight":12}
