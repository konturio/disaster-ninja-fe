import React from 'react';
import { test, expect, beforeEach, describe } from 'vitest';
import { routeVisibilityChecker } from './routeVisibilityChecker';
import type { AppRoute } from '~core/router';

declare module 'vitest' {
  export interface TestContext {
    checker: (route: AppRoute, currentRoute: AppRoute | null) => boolean;
    routes: {
      foo: AppRoute;
      bar: AppRoute;
      bar_child: AppRoute;
      bar_child_neighbor: AppRoute;
    };
  }
}

/* defaultRouteValues */
const defaults = {
  icon: React.createElement('i'),
  view: React.createElement('p'),
  title: '',
};

beforeEach(async (context) => {
  const foo = {
    ...defaults,
    slug: 'foo',
    id: 'idfoo',
  };

  const bar = {
    ...defaults,
    slug: 'bar',
    id: 'idbar',
  };

  const bar_child = {
    ...defaults,
    slug: 'bar-child',
    id: 'idbar-child',
    parentRouteId: 'idbar',
  };

  const bar_child_neighbor = {
    ...defaults,
    slug: 'bar-child-neighbor',
    id: 'idbar-child-neighbor',
    parentRouteId: 'idbar',
  };

  context.routes = {
    foo,
    bar,
    bar_child,
    bar_child_neighbor,
  };

  // extend context
  context.checker = routeVisibilityChecker(Object.values(context.routes));
});

describe('auto visibility', () => {
  test('top level routes always visible', ({ checker, routes }) => {
    expect(
      checker(
        routes.foo, // check route
        routes.foo, // when what active
      ),
      'in case it active',
    ).toBe(true);

    expect(
      checker(
        routes.foo, // check route
        routes.bar, // when what active
      ),
      'in case it inactive',
    ).toBe(true);
  });

  test('nested routes visible when parent active', ({ checker, routes }) => {
    expect(checker(routes.bar_child, routes.bar)).toBe(true);
  });

  test('nested routes visible when neighbor active', ({ checker, routes }) => {
    expect(checker(routes.bar_child, routes.bar_child_neighbor)).toBe(true);
  });

  test('nested hidden when no active neighbor and parent', ({ checker, routes }) => {
    expect(checker(routes.bar_child, routes.foo)).toBe(false);
  });
});
