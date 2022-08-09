import { expect, test, describe, vi } from 'vitest';
import { createResourceAtom } from './createResourceAtom';

describe('Resource atoms inherit state', () => {
  test.todo('Inherit loading state', () => {
    // TODO
  });

  test.todo('Inherit error state', () => {
    // TODO
  });
});

describe('Resource atoms lazy mode', () => {
  test.todo('lazy: false - Resource start loading without subscribers', () => {
    // TODO
  });

  test.todo(
    'lazy: false - Resource start loading when deps changed without subscribers',
    () => {
      // TODO
    },
  );

  test.todo('lazy: true - Resource not loading without subscriber', () => {
    // TODO
  });

  test.todo(
    'lazy: true - Resource not updated on deps atom changes without subscriber',
    () => {
      // TODO
    },
  );

  test.todo(
    'lazy: true - Resource updated on deps atom changes with subscriber',
    () => {
      // TODO
    },
  );

  test.todo('lazy: true - Resource start loading with subscriber', () => {
    // TODO
  });
});

describe('Resource canceling', () => {
  test.todo(
    'Resource call abort of abortController when request canceled',
    () => {
      // TODO
    },
  );

  test.todo('Resource set error state when canceled', () => {
    // TODO
  });

  test.todo('Resource not have loading state after cancel manually', () => {
    // TODO
  });

  test.todo('Resource have loading state after cancel by other request', () => {
    // TODO
  });

  test.todo(
    'Resource have correct last parameters when canceled by next request',
    () => {
      // TODO
    },
  );

  test.todo('Resource cancel active request if new request created', () => {
    // TODO
  });
});

describe('Resource refetch', () => {
  test.todo('Resource can be re-fetched with last parameters', () => {
    // TODO
  });

  test.todo('Resource ignore refetch if in already in loading state', () => {
    // TODO
  });

  test.todo('Resource ignore refetch if it never fetched before', () => {
    // TODO
  });
});
