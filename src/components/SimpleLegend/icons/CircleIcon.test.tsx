/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';

import { CircleIcon } from './CircleIcon';

describe('CircleIcon', () => {
  it('renders horizontal line when no fill color provided', () => {
    const { container } = render(
      <CircleIcon styles={{ width: 4 } as any} size="normal" />,
    );
    const line = container.querySelector('line');
    expect(line, 'CircleIcon without fill should render line element').not.toBeNull();
    const circle = container.querySelector('circle');
    expect(circle, 'CircleIcon without fill should not render circle element').toBeNull();
  });
});
