import {Report} from "./Report";
import {TSUnitConverter} from "./TSUnitConverter";

// TSUnitConverter.setDefaultSourceUnit('distance', "meters");
const report = new Report({distance: 50}); //50 meters
TSUnitConverter.setUnitSystem("metric");
console.log('distance: ', report.distance); // to meters
TSUnitConverter.setUnitSystem("imperial");
console.log('distance: ', report.distance); //to feet

