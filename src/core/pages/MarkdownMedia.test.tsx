/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MarkdownMedia } from './MarkdownMedia';


describe('MarkdownMedia', () => {
  it('renders responsive YouTube iframe', () => {
    const { container } = render(
      <MarkdownMedia title="t" alt="a" src="https://youtube.com/watch?v=xyz::800,450,1" />,
    );
    const iframe = container.querySelector('iframe');
    expect(iframe).not.toBeNull();
    expect(iframe?.style.width).toBe('100%');
    expect(iframe?.style.aspectRatio).toBe('800 / 450');
  });
});
