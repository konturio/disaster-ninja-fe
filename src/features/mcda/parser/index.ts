import {
  firstVersionAdapter,
  secondVersionAdapter,
  thirdVersionAdapter,
} from './adapters';
import { createValidator } from './validator';
import type { MCDAConfig } from '../types';

export async function parseMCDA(jsonString: string): Promise<MCDAConfig> {
  const validate = await createValidator();
  const object = JSON.parse(jsonString.trim());
  if (validate(object)) {
    switch (object?.version) {
      case 1:
      case undefined:
        return firstVersionAdapter(object);

      case 2:
        return secondVersionAdapter(object);

      case 3:
        return thirdVersionAdapter(object);

      default:
        // @ts-expect-error - this check case with broken json
        throw Error(`Not supported version: ${object?.version}`);
    }
  }
  throw Error('Json not valid');
}
