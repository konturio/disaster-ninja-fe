import type { JsonMCDA } from './types';

/** TODO: Use some library for check ts interface in runtime */
export const createValidator = () => {
  const errors: Array<string> = [];
  function isJsonMCDA(obj: Record<string, any>): obj is JsonMCDA {
    if (!('layers' in obj)) {
      errors.push('Json must include "layers" property');
    }

    if (!Array.isArray(obj.layers)) {
      errors.push('"layers" property must be an Array');
    }

    if (Array.isArray(obj.layers) && obj.layers.length < 1) {
      errors.push('You need at least one layer');
    }

    if (!('colors' in obj)) {
      errors.push('Json must include "colors" property');
    }

    return errors.length === 0;
  }

  return [isJsonMCDA, errors] as const;
};
