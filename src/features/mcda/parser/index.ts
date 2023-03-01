import { firstVersionAdapter, secondVersionAdapter } from './adapters';
import { createValidator } from './validator';
import type { MCDAConfig } from '../types';
import type { JsonMCDAv2 } from './types';

export function parseMCDA(jsonString: string): MCDAConfig {
  const [isJsonMCDA, errors] = createValidator();
  const object = JSON.parse(jsonString.trim());
  if (isJsonMCDA(object)) {
    const version = 'version' in object ? object.version : 1;
    switch (version) {
      case 1:
        return firstVersionAdapter(object);

      case 2:
        return secondVersionAdapter(object as JsonMCDAv2);

      default:
        throw Error(`Not supported version: ${version}`);
    }
  } else {
    throw Error(['Json is not valid', ...errors].join('\n'));
  }
}
