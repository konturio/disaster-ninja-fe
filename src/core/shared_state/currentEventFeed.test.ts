/**
 * @vitest-environment happy-dom
 */
import { expect, test } from 'vitest';
import { configRepo } from '~core/config/__mocks__/_configMock';
import { currentEventFeedAtom } from './currentEventFeed';

test('currentEventFeedAtom uses user default feed', () => {
  const customFeed = 'user-feed';
  // override mocked default feed
  configRepo.getUserDefaultFeed = () => customFeed;

  const state = currentEventFeedAtom.getState();

  expect(state?.id).toBe(customFeed);
});
