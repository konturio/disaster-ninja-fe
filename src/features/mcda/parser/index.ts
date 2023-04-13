import {
  firstVersionMigration,
  fourVersionMigration,
  secondVersionMigration,
  thirdVersionMigration,
} from './adapters';
import { createValidator } from './validator';
import type { MCDAConfig } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

export async function parseMCDA(jsonString: string): Promise<MCDAConfig> {
  const validate = await createValidator();
  const object = JSON.parse(jsonString.trim());
  if (validate(object)) {
    switch (object?.version) {
      case 1:
      case undefined:
        return firstVersionMigration(object);

      case 2:
        return secondVersionMigration(object);

      case 3:
        return thirdVersionMigration(object);

      case 4:
        return fourVersionMigration(object);

      default:
        // @ts-expect-error - this check case with broken json
        throw Error(`Not supported version: ${object?.version}`);
    }
  }
  throw Error('Json not valid');
}
