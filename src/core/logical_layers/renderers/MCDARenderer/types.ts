import type { MCDAConfig } from '../stylesConfigs/mcda/types';

export type PopupMCDAProps = {
  layers: MCDAConfig['layers'];
  normalized: {
    [key: string]: { norm: number; val: number };
  };
  resultMCDA: number;
};
