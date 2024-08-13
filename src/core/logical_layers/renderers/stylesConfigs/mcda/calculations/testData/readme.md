# calculateLayerPipeline unit test

The test uses `calculateLayerPipeline.testdata.csv` file to get the input data and expected values. This is a static CSV file based on `calculateLayerPipeline.formulas.xlsx` file.

## If you need to update CSV file

XLS-file contains two sheets:
`mcda_calc` - has actual calculations and formulas
`mcdaCalculations.testdata` - imports necessary fields from the `mcda_calc`

To update CSV file:

1. Open `calculateLayerPipeline.formulas.xlsx` (I recommend using LibreOffice)
2. Making necessary changes in `mcda_calc` sheet. Save XLS file.
3. Export updated `mcdaCalculations.testdata` as new CSV file.
4. Make sure unit-test works as expected

### Other notes

`MAX(MIN(x, rangeTo), rangeFrom)` - this expression implements clamp function.
Its logic:

- if (rangeFrom < x < rangeTo) => return x;
- if (x < rangeFrom) => return rangeFrom;
- if (x > rangeTo) => return rangeTo;
