import { createMCDAStyle } from './mcda/mcdaStyle';
import type { MCDALayerStyle } from './mcda/types';

export const styleConfigs = {
  mcda: (config: MCDALayerStyle['config']) => {
    return new Array(createMCDAStyle(config));
  },
};
