import { defaultStore } from '@reatom/core-v2';

const preventReading = (obj, message) => {
  for (const [key, value] of Object.entries(obj)) {
    Object.defineProperty(obj, key, {
      get() {
        throw new Error(message ?? 'This object reading os forbidden');
      },
    });
  }
};

preventReading(
  defaultStore,
  `This store instance is restricted in our app.
Use createAtom from ~utils/atoms/createPrimitives`,
);
