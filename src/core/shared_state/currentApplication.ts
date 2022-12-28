import { createPrimitiveAtom } from '~utils/atoms/createPrimitives';
// import { appConfig } from '~core/app_config';

export const currentApplicationAtom = createPrimitiveAtom<null | string>(
  '',
  null,
  '[Shared state] currentApplicationAtom',
);
