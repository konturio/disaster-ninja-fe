import { toolbarControlsAtom } from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import { mcdaCalculationAtom } from './atoms/mcdaCalculation';
import type { JsonMCDA } from './atoms/mcdaCalculation';

const example = `
{
  "id":"MCDA",
  "layers":[
     {
        "axis":["population", "area_km2"],
        "range":[0, 46200],
        "sentiment":["good", "bad"],
        "coefficient":1
     },
     {
        "axis":["hazardous_days_count", "one"],
        "range":[0, 365],
        "sentiment":["good", "bad"],
        "coefficient":1
     },
     {
        "axis":["highway_length", "total_road_length"],
        "range":[0, 1],
        "sentiment":["bad", "good"],
        "coefficient":1
     }
  ],
  "colors":{
     "good":"rgba(90, 200, 127, 0.5)",
     "bad":"rgba(228, 26, 28, 0.5)"
  }
}
`;

export function initMCDA() {
  toolbarControlsAtom.addControl.dispatch({
    id: 'MCDA',
    name: 'MCDA',
    title: 'MCDA',
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    exclusiveGroup: controlGroup.mapTools,
    icon: (
      <div style={{ height: '24px', display: 'flex', alignItems: 'center' }}>MCDA</div>
    ),
    onClick: () => {
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

      if (!jsonString) {
        alert('Empty input');
        return;
      }

      let jsonParsed = null;
      try {
        jsonParsed = JSON.parse(jsonString.trim());
      } catch (e) {
        alert(`JSON parsing failed: ${e}`);
      }

      if (jsonParsed) {
        const { layers, colors } = jsonParsed;
        if (!(layers && colors)) {
          alert('JSON must have layers and colors fields inside');
          return;
        }
        try {
          mcdaCalculationAtom.calcMCDA.dispatch(jsonParsed as JsonMCDA);
        } catch (e) {
          alert('JSON processing failed');
        }
      }
    },
  });
}
