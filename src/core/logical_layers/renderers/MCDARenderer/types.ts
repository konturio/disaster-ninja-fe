import type { MCDAConfig } from '../stylesConfigs/mcda/types';

export type PopupMCDAProps = {
  layers: MCDAConfig['layers'];
  normalized: {
    [key: string]: {
      norm: number;
      val: number;
      numValue: number;
      denValue: number;
    };
  };
  resultMCDA: number;
};
