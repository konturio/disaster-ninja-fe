/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LinkRenderer } from './LinkRenderer';

describe('LinkRenderer', () => {
  it('adds https scheme when missing', () => {
    const { container } = render(
      <LinkRenderer href="cycling.waymarkedtrails.org/#?map=3">link</LinkRenderer>,
    );
    const anchor = container.querySelector('a');
    expect(anchor?.getAttribute('href')).toBe(
      'https://cycling.waymarkedtrails.org/#?map=3',
    );
  });
});
