/**
 * @vitest-environment happy-dom
 */
import { createStore } from '@reatom/core';
import { expect, test, vi, beforeEach } from 'vitest';
import { createAtom } from '~utils/atoms';
import { wait } from '~utils/test';
import { mockClient } from '~utils/axios/setupTemporaryMocking';
import { ApiClient } from '~core/api_client';
import { defaultAppLayersAtom, defaultLayersParamsAtom } from './defaultLayers';
import type { Store } from '@reatom/core';

declare module 'vitest' {
  export interface TestContext {
    store: Store;
  }
}

beforeEach(async (context) => {
  context.store = createStore();
});
// TODO:  #12819: default layers request use empty string as id
test.skip('Default layers', async ({ store }) => {
  const unMockClient = mockClient(
    // @ts-ignore
    ApiClient.getInstance().apiSauceInstance.axiosInstance,
    {
      ['/layers/defaults/']: () => ['foo_layer'],
      ['/apps/default_id']: () => ['123'],
    },
  );
  // Create test atom
  const stateChangesLog = vi.fn(async (arg) => null);

  const testAtom = createAtom(
    {
      defaultAppLayersAtom,
    },
    ($) => {
      const defaultLayers = $.get('defaultAppLayersAtom');
      stateChangesLog(defaultLayers);
      if (defaultLayers.data === null && !defaultLayers.loading && !defaultLayers.error) {
        $.schedule((dispatch) => {
          dispatch(defaultLayersParamsAtom.request());
        });
      }
    },
    { store },
  );

  store.subscribe(testAtom, () => null);

  while (stateChangesLog.mock.calls.length < 3) {
    await wait(1);
  }

  expect(stateChangesLog).toHaveBeenLastCalledWith({
    loading: false,
    data: ['foo_layer'],
    error: null,
    lastParams: { appId: '123' },
    dirty: true,
  });

  unMockClient();
});
