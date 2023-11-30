import { parseMCDA } from './parser';

const example = `
{
  "id": "MCDA",
  "version": 4,
  "layers": [
     {
        "axis": [
           "population",
           "area_km2"
        ],
        "range": [
           0,
           46200
        ],
        "sentiment": [
           "good",
           "bad"
        ],
        "coefficient": 1,
        "transformationFunction": "no",
        "normalization": "no"
     }
  ],
  "colors": {
     "type": "mapLibreExpression",
     "parameters": {
        "fill-color": [
           [
              "step",
              [
                 "var",
                 "mcdaResult"
              ],
              "#51bbd6",
              100,
              "#f1f075",
              24100,
              "#f28cb1"
           ]
        ],
        "fill-opacity": 0.7
     }
  }
}
`;

export async function promptMCDAConfig() {
  const jsonString = prompt(
    `
    Enter MCDA json
    Example:
    - sentiments can be only ["bad", "good"] or ["good", "bad"]
    - colors set is fixed to "good" and "bad"

    ${example}
  `,
    example,
  );

  if (jsonString === null) {
    console.warn('MCDA Prompt canceled');
    return;
  }

  try {
    const jsonParsed = await parseMCDA(jsonString);
    return jsonParsed;
  } catch (e) {
    if (e instanceof Error && 'message' in e) {
      alert(e.message);
    } else {
      alert('JSON processing failed');
    }
  }
}
