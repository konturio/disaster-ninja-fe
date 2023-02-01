import { toolbarControlsAtom } from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import { mcdaCalculationAtom } from './atoms/mcdaCalculation';
import type { JsonMCDA } from './atoms/mcdaCalculation';

const example = `
{
  "id": "MCDA",
  "axes":[
    ["population", "area_km2"],
    ["hazardous_days_count", "one"],
    ["highway_length", "total_road_length"]
  ],
  "ranges":[
    [0, 46200],
    [0, 365],
    [0, 1]
  ],
  "sentiments":[
    ["good", "bad"],
    ["good", "bad"],
    ["bad", "good"]
  ],
  "coefficients":[
    1,
    1,
    1
  ],
  "colors": {
    "good": "rgba(90, 200, 127, 0.5)",
    "bad": "rgba(228, 26, 28, 0.5)"
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
        const { axes, ranges, sentiments, coefficients, colors } = jsonParsed;
        if (!(axes && ranges && sentiments && coefficients && colors)) {
          alert(
            'JSON must have axes, ranges, sentiments, colors and coefficients fields inside',
          );
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
