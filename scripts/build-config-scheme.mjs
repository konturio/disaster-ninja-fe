import Ajv from 'ajv';
import tsj from 'ts-json-schema-generator';

export function buildScheme() {
  const config = {
    path: 'src/core/app_config/index.ts',
    tsconfig: './tsconfig.json',
    type: 'AppConfig',
    skipTypeCheck: true,
  };
  const schema = tsj.createGenerator(config).createSchema(config.type);
  return schema;
}

export function validateConfig(config, schema) {
  const ajv = new Ajv();
  const valid = ajv.validate(schema, config);
  if (!valid) {
    console.dir(ajv.errors, { depth: null });
    throw Error('Configuration is not valid');
  }
}
