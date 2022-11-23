import { defaultStore } from '@reatom/core';
defaultStore.dispatch = () => {
  throw new Error(
    `This store instance is restricted in our app.
Use createAtom from ~utils/atoms/createPrimitives`,
  );
};
