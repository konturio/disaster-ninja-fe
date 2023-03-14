import { i18n } from '~core/localization';
import { toolbarControlsAtom } from '~core/shared_state';
import { controlGroup, controlVisualGroup } from '~core/shared_state/toolbarControls';
import { mcdaCalculationAtom } from './atoms/mcdaCalculation';
import { parseMCDA } from './parser';

const example = `
{
  "id":"MCDA",
  "version": 3,
  "layers":[
     {
        "axis": ["population", "area_km2"],
        "range": [0, 46200],
        "sentiment": ["good", "bad"],
        "coefficient": 1,
        "transformationFunction": "no",
        "normalization": "max-min"
     },
     {
        "axis": ["hazardous_days_count", "one"],
        "range": [0, 365],
        "sentiment": ["good", "bad"],
        "coefficient": 1,
        "transformationFunction": "natural_logarithm",
        "normalization": "max-min"
     },
     {
        "axis": ["highway_length", "total_road_length"],
        "range": [0, 1],
        "sentiment": ["bad", "good"],
        "coefficient": 1,
        "transformationFunction": "square_root",
        "normalization": "max-min"
     },
     {
      "axis": ["population", "area_km2"],
      "range": [0, 46200],
      "sentiment": ["good", "bad"],
      "coefficient": 1,
      "transformationFunction": "no",
      "normalization": "no"
   }
  ],
  "colors":{
     "good": "rgba(90, 200, 127, 0.5)",
     "bad": "rgba(228, 26, 28, 0.5)"
  }
}
`;

export function initMCDA() {
  toolbarControlsAtom.addControl.dispatch({
    id: 'MCDA',
    name: i18n.t('mcda.name'),
    title: i18n.t('mcda.title'),
    active: false,
    visualGroup: controlVisualGroup.noAnalytics,
    exclusiveGroup: controlGroup.mapTools,
    icon: (
      <div style={{ height: '24px', display: 'flex', alignItems: 'center' }}>
        {i18n.t('mcda.name')}
      </div>
    ),
    onClick: async () => {
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
        mcdaCalculationAtom.calcMCDA.dispatch(jsonParsed);
      } catch (e) {
        if (e instanceof Error && 'message' in e) {
          alert(e.message);
        } else {
          alert('JSON processing failed');
        }
      }
    },
  });
}
