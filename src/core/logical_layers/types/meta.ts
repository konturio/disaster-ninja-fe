import type { Direction } from '~utils/bivariate';

export interface LayerMeta {
  copyrights?: string[];
  description?: string;
  hints?: {
    x: {
      label?: string;
      direction?: Direction;
    };
    y: {
      label?: string;
      direction?: Direction;
    };
  };
}
