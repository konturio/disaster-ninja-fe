import { wait } from './wait';

export async function waitMockCalls(
  mockedFn: { mock: { calls: { length: number } } },
  count: number,
) {
  while (mockedFn.mock.calls.length < count) {
    await wait(1);
  }
}
