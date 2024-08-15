# calculateLayerPipeline unit tests

The test uses `calculateLayerPipeline.testdata.csv` file to get the input data and expected values. This is a static CSV file exported from `calculateLayerPipeline.formulas.xlsx`.

## Test data files

- `calculateLayerPipeline.testdata.csv` is a plain CSV file. Headers are using dot notation (parent.child.grandchild) to create nested objects in tests.

- `calculateLayerPipeline.formulas.xlsx` contains two sheets:
  - `mcda_calc` has actual calculations and formulas
  - `mcdaCalculations.testdata` imports necessary fields from `mcda_calc`

## To update the CSV file

1. Open `calculateLayerPipeline.formulas.xlsx` (I recommend using LibreOffice)
2. Make necessary changes in `mcda_calc` sheet. Save XLS file.
3. Export updated `mcdaCalculations.testdata` sheet as new CSV file.
4. Make sure the unit-tests work as expected.

## Other notes

`MAX(MIN(x, rangeTo), rangeFrom)` - this expression implements clamp function.
Its logic:

- if (rangeFrom < x < rangeTo) => return x;
- if (x < rangeFrom) => return rangeFrom;
- if (x > rangeTo) => return rangeTo;
