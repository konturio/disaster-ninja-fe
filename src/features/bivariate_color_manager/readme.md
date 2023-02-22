## Bivariate Color Manager

Currently, we apply colors to sentiments manually via DB but don't have a full picture is this works good or bad.
The main idea was to create a tool to give users control over managing sentiments and their colors for bivariate layers.

### How to activate

It requires beta feature bivariate_color_manager turned on.
Then through sidebar you can go on /bivariate-manager route and use it.

### How data is processed

Data fetching and postprocessing happens in bivariateColorManagerResourceAtom.

1. To fetch all the data '/bivariate_matrix' endpoint is used for the whole world (no geometry).
   As a result we have `{ correlationRates, indicators, axis, colors, meta }`.
2. We loop through axis, get rid of those with bad quality (< 0.5), and then make an object `axisNumeratorInfo` with key pairs: { axis numerators : axis most quality denominator}. The main goal of `axisNumeratorInfo` is to get most quality denominator for every axis. We use pair numerator + its most quality denominator when you select an item in sublist.
3. Then we loop through correlationRates (axis intersectons), each correlationRate has x and y quotient. We accumulate unique combinations in the object `bivariateColorManagerData`, key - "{vertical: "x.direction", horizontal: "y.direction"}", value - {vertical, horizontal, maps}. For each combination legend is created to be possible to paint it on combination selection in the list.
   This object `bivariateColorManagerData` represents a main data structure you see on color manager feature's ui.
   Its keys are table's rows, its values' fields `horizontal` and `vertical` are row's sublists, that are sorted descending by quality.
   `Maps` count is a multiplication of vertical and horizontal rows count.
