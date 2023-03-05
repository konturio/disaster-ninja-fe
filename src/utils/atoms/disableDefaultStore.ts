import { defaultStore } from '@reatom/core-v2';
defaultStore.dispatch = () => {
  throw new Error(
    `This store instance is restricted in our app.
Use createAtom from ~utils/atoms/createPrimitives`,
  );
};
