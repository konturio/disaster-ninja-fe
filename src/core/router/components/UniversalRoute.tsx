import type { Route } from 'react-router-dom';
import type { CacheRoute } from 'react-router-cache-route';
import type { ComponentProps } from 'react';

export function UniversalRoute(
  props: ComponentProps<typeof Route> & { as: typeof Route },
): JSX.Element;
export function UniversalRoute(
  props: ComponentProps<typeof CacheRoute> & { as: typeof CacheRoute },
) {
  const { as: AbstractRoute, ...rest } = props;
  return <AbstractRoute {...rest} />;
}
