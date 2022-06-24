import type { Direction } from '~utils/bivariate';

export interface LayerMeta {
  copyrights?: string[];
  description?: string;
  hints?: {
    x: {
      label?: string;
      directions?: Direction;
    };
    y: {
      label?: string;
      directions?: Direction;
    };
  };
}
