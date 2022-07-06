import { createAtom } from '~utils/atoms';

type StateType = {
  features: { [featureKey: string]: 'ready' | null };
  timeFromBegining?: number;
  removeTimeout?: any;
};

export const featureStatusAtom = createAtom(
  {
    setFeatures: (features: string[]) => features,
    markReady: (featureId: string) => featureId,
    markUnready: (featureId: string) => featureId,
  },
  ({ onAction }, state: StateType = { features: {} }) => {
    onAction('setFeatures', (features) => {
      const newFeatures: { [featureKey: string]: 'ready' | null } =
        // treat map as feature
        { [APPLICATION_MAP_KEY]: null };
      features.forEach((feature) => (newFeatures[feature] = null));
      state = { ...state, features: newFeatures };
    });

    onAction('markReady', (featureId) => {
      state = {
        ...state,
        features: { ...state.features, [featureId]: 'ready' },
      };
      if (
        Object.keys(state.features).length &&
        Object.values(state.features).every((value) => value === 'ready')
      ) {
        // eslint-disable-next-line
        console.log('%c⧭', 'color: #eeff00', 'APP IS READY EVENT');
      }
    });

    onAction(
      'markUnready',
      (featureId) =>
        (state = {
          ...state,
          features: { ...state.features, [featureId]: null },
        }),
    );

    return state;
  },
);

export const APPLICATION_MAP_KEY = 'application_map';
