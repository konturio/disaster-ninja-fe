## MCDA - Multi Criteria Decision Analysis

MCDA is a basic tool to answer localization questions with GIS ("where better do or not to do something").
Users have a need to perform a spatial analysis based on a variety of criteria.
Previously Kontur allowed combining only 2 layers in bivariate-manager feature.
In MCDA feature we can allow users to select as many layers as they need.

## How to use

To start using this feature user needs:

- feature flag "mcda" is turned on for current user

### Activation

In Toolbar user will see a MCDA button.
By clicking it in activated prompt window user needs to enter JSON of next structure:

```json
{
  "id": "MCDA",
  "layers": [
    {
      "axis": ["population", "area_km2"],
      "range": [0, 46200],
      "sentiment": ["good", "bad"],
      "coefficient": 1
    },
    {
      "axis": ["hazardous_days_count", "one"],
      "range": [0, 365],
      "sentiment": ["good", "bad"],
      "coefficient": 1
    },
    {
      "axis": ["highway_length", "total_road_length"],
      "range": [0, 1],
      "sentiment": ["bad", "good"],
      "coefficient": 1
    }
  ],
  "colors": {
    "good": "rgba(90, 200, 127, 0.5)",
    "bad": "rgba(228, 26, 28, 0.5)"
  }
}
```

### JSON structure

1. id - name of layer on layers panel and in layers related atoms (non required)
2. colors - coloring of sentiments (required)
3. layers - all configured layers in analysis (all fields are required)
   - axis: [numerator: string, denominator: string] - numerator, denominator
   - range: [min: number, max: number] - min, max values for specific axis
   - sentiment: only 2 options here - ["bad", "good"] as deafult direction and ["good", "bad"] as a reversed
   - coefficient: weight of layer in analysis, could be >=0 and <=1

## How it calculates

MCDA uses data from bivariate tiles that have large amount of indicators inside.
In every hexagon for every layer from provided JSON it's calculted:

```
V_norm = (V_current - V_min)/(V_max - V_min)
```

Where `V_current = (numerator/denominator)`, V_min, V_max are values from the range field.
If direction of layer is reversed (["good", "bad"]) `V_norm = 1 - V_norm`.
And in the end:

```
V_total = Σ(V_norm(1) · weight(1), V_norm(2) · weight(2), V_norm(n) · weight(n)) / Σweight
```

V_total is a result value of MCDA analysis (it's >=0 and <= 1), it's interpolated in color from colors field of JSON, where 0 is bad color, 1 is good color.
If value is out of [0,1] range, it's painted as transparent.

### Layers panel placement

MCDA layers are automatically placed at the top of the **Kontur analytics** group in the Layers panel so newly created analyses are easy to find.
