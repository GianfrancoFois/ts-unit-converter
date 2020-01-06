This is a simple library intended to deal with metric/imperial units conversion with property decorators. 

Example:

```typescript
class MyClass {

    @Measurement({type: "long-distance", sourceUnit: 'meters'})
    distance: number;

    @Measurement({metric: "meters", imperial: "feet", sourceUnit: "inches"})
    radius: string;

    @Measurement({type: "volume"})
    volume: number;

    @Measurement({metric: "grams", imperial: "ounces", sourceUnit: "pounds"})
    weight: number;

}
```
