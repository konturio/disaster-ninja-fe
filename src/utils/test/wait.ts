export const wait = (sec = 1, opt: { failWithMessage?: string } = {}) =>
  new Promise((res, rej) =>
    setTimeout(
      opt?.failWithMessage ? () => rej({ message: opt.failWithMessage }) : res,
      sec * 1000,
    ),
  );

interface WaitForOptions {
  checkInterval?: number;
  timeout?: number;
}

/**
 * Waits for a condition to become truthy or for a getter to return a non-null value
 */
export function waitFor<T>(
  conditionOrGetter: (() => T | null | undefined) | (() => boolean),
  { checkInterval = 100, timeout = 10000 }: WaitForOptions = {},
): Promise<T extends boolean ? void : NonNullable<T>> {
  return new Promise((resolve, reject) => {
    const startTime = Date.now();
    const timeoutId = setTimeout(() => {
      reject(new Error(`Condition not met after ${timeout}ms`));
    }, timeout);

    const checkCondition = () => {
      const result = conditionOrGetter();

      if (result) {
        clearTimeout(timeoutId);
        resolve(result as T extends boolean ? void : NonNullable<T>);
      } else {
        if (Date.now() - startTime >= timeout) {
          clearTimeout(timeoutId);
          reject(new Error(`Condition not met after ${timeout}ms`));
        } else {
          setTimeout(checkCondition, checkInterval);
        }
      }
    };

    checkCondition();
  });
}
