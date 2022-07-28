import { createAtom } from '~utils/atoms';
import { bivariateColorManagerResourceAtom } from './bivariateColorManagerResource';
import type { TableDataValue } from './bivariateColorManagerResource';
import type { BivariateColorManagerData } from './bivariateColorManagerResource';

export type BivariateColorManagerAtomState = {
  data?: BivariateColorManagerData | null;
  layersSelection?: LayerSelectionInput;
};

export type LayerSelectionInput = {
  key: string;
  vertical?: TableDataValue;
  horizontal?: TableDataValue;
};

export type BivariateColorManagerAtom = typeof bivariateColorManagerAtom;

export const bivariateColorManagerAtom = createAtom(
  {
    setLayersSelection: (input: LayerSelectionInput) => input,
    bivariateColorManagerResourceAtom,
  },
  (
    { onAction, onChange },
    state: BivariateColorManagerAtomState = {
      data: null,
    },
  ) => {
    onChange('bivariateColorManagerResourceAtom', (resource) => {
      if (!resource.data) return (state = { data: null });

      state = {
        data: resource.data,
      };

      if (!state.data) state.data = null;
    });

    onAction('setLayersSelection', (input) => {
      const prevSelection = state.layersSelection;

      if (!prevSelection) {
        state = { ...state, layersSelection: input };
        return;
      }

      if (prevSelection.key !== input.key) {
        state = { ...state, layersSelection: input };
      } else {
        const nextSelection = { ...prevSelection, ...input };
        state = { ...state, layersSelection: nextSelection };
      }
    });

    return state;
  },
);
