import { expect, test, describe, it } from 'vitest';
import { withSetupCheck } from './withSetupCheck';

// Returns an instance of the provided class.
it("should return a proxied instance when object has 'setup' method", () => {
  class TestClass {
    setup() {
      return;
    }
  }
  const instance = withSetupCheck(TestClass);
  expect(instance instanceof TestClass).toBe(true);
});

it('should return property values after setup', () => {
  class TestClass {
    setup() {
      return;
    }
    prop = 'value';
  }
  const instance = withSetupCheck(TestClass);
  instance.setup();
  expect(instance.prop).toBe('value');
});

it("should throw an error when object does not have 'setup' method", () => {
  class TestClass {}
  // @ts-expect-error - check for error
  expect(() => withSetupCheck(TestClass)).toThrowError('Class must have setup method');
});

it('should throw an error when accessing properties before setup', () => {
  class TestClass {
    setup() {
      return;
    }
    prop = 'value';
  }
  const instance = withSetupCheck(TestClass);
  expect(() => instance.prop).toThrowError(
    'You must call TestClass.setup() before usage',
  );
});
