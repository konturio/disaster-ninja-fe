import { createAtom } from '~utils/atoms';
import { Geometry } from 'geojson';
import { editTargetAtom } from './editTarget';

type FeaturePanelMode = 'Add feature' | 'Edit feature' | null;
type StateType = {
  featurePanelMode: FeaturePanelMode;
  geometry: Geometry | null;
  [featureProperties: string]: any;
};
const defaultState: StateType = {
  featurePanelMode: 'Add feature',
  geometry: null,
};

export const featurePanelControllerAtom = createAtom(
  {
    setPanelMode: (mode: FeaturePanelMode) => mode,
    setFeatureGeometry: (
      geometry: Geometry | null,
      mode: FeaturePanelMode = 'Add feature',
    ) => {
      return { geometry, mode };
    },
    setPropertyNames: (properties: string[]) => properties,
    changeProperty: (property: string, value: string) => {
      return { key: property, value };
    },
    startEditMode: (
      geometry: Geometry,
      properties: { [key: string]: string },
    ) => {
      return { geometry, properties };
    },
    resetPanel: () => null,
  },
  ({ onAction, schedule }, state: StateType = defaultState) => {
    onAction('startEditMode', ({ geometry, properties }) => {
      state = {
        featurePanelMode: 'Edit feature',
        geometry,
        ...properties,
      };
    });

    schedule((dispatch) => {
      dispatch(editTargetAtom.set('features'));
    });

    return state;
  },
  'featurePanelControllerAtom',
);
