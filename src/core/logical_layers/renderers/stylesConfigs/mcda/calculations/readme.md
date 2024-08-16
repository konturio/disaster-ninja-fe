# calculateLayerPipeline function

`calculateLayerPipeline` creates a function which contains the logic for MCDA axis score calculation.

It's used in two cases:

- to calculate numerical MCDA axis score (used in MCDA popup when a hex was clicked)
- to create MapLibre expression for axis score calculation (used for coloring the hexes)

# calculateLayerPipeline unit tests

`calculateLayerPipline.test.ts` makes sure that MCDA axis (aka "MCDA layer") scores are calculated correctly.

The tests use `testData/calculateLayerPipeline.testdata.csv` file to get the parameters and expected values.
Each row of the CSV file contains MCDA axis parameters and expected scores for every transformation function.

## Test data files

- `testData/calculateLayerPipeline.formulas.xlsx` has two sheets:

  - `mcda_calc` contains step-by-step calculations of MCDA axis scores (each transformation function is calculated separately)
  - `mcdaCalculations.testdata` imports only the necessary fields from `mcda_calc` to use in tests

- `testData/calculateLayerPipeline.testdata.csv` is a plain CSV file exported from `calculateLayerPipeline.formulas.xlsx`:
  - Each row represents
  - Headers use dot notation (e.g. "parent.child.grandchild") to create nested objects in tests.

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
