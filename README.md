## ts-unit-converter

This is a simple library intended to deal with metric/imperial units conversion with property decorators.

### Install

`yarn add ts-unit-converter`

`npm install ts-unit-converter`

### Usage

To perform the conversion of a class property, use ```@Measurement ```. You can indicate the type of unit (see table below) for common pairs of units, or specify the imperial and metric units individually.

Also, this library needs to know the ```sourceUnit``` of each property. Tipically this is the unit coming from an REST API or similar. This is the unit used in the setters and constructors.
The ```sourceUnit``` can be ommited if you specify a default source unit for the unit type. To do so, use ```TSUnitConverter.setDefaultSourceUnit(type, unit)``` the earliest you can. Usually in main.ts or index.ts.

If you want to set a property in the displayed units (for example, when taking user input), you have to wrap the set operations inside ```setInDisplayUnits()```.

To change the **unit system**, use ```TSUnitConverter.setUnitSystem```. It can be 'metric' or 'imperial'. By default it is 'metric' To get the current unit system use ```TSUnitConverter.getUnitSystem()```.

**About JSON.stringify**

When parsing an object with decorated properties, **all the properties  will be converted back to the source unit**, to keep consistency when sending data back to the API.

### Example:

```typescript
import {Measurement, TSUnitConverter, setInDisplayUnits} from 'ts-unit-converter';

class MyClass {

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
console.log("JSON:", JSON.stringify(obj));
//{"distance":5000,"radius":60,"volume":37.85,"weight":0.0264}

```

### Unit types

| Type  | Metric  | Imperial  |
| :------------ | :------------ | :------------ |
| **distance**  | meters  | feet  |
| **long-distance**  | kilometers  | miles  |
| **short-distance**  | centimeters  | inches  |
| **volume**  | liters | gallons  |
| **mass**  | kilograms  | pounds  |
| **little-mass**   | grams  | ounces  |
| **temperature**  | celsius  | fahrenheit  |

### Supported units

**Metric:** "meters" | "kilometers" | "centimeters" | "kilograms" | "grams" | "liters" | "celsius"

**Imperial:** "feet" | "yards" |"miles" | "inches" | "pounds" | "ounces" | "gallons" | "fahrenheit"
