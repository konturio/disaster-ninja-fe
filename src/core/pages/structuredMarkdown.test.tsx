/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { structureMarkdownContent } from './structuredMarkdown';
import { compiler } from 'markdown-to-jsx';

function renderCompiledMarkdown(markdown: string) {
  const compiled = compiler(markdown, { wrapper: null }) as unknown as JSX.Element[];
  const wrapped = structureMarkdownContent(compiled);
  const { container } = render(<>{wrapped}</>);
  return container;
}

describe('structureMarkdownContent', () => {
  it('should handle content before first heading', () => {
    const markdown = `
Content before first heading
# Heading 1
Content under H1
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section>' +
        '<p>Content before first heading</p>' +
        '<h1 id="heading-1">Heading 1</h1>' +
        '<div class="wrap-h1"><p>Content under H1</p></div>' +
        '</section>',
    );
  });

  it('should wrap content between same level headings', () => {
    const markdown = `
# Heading 1
Content 1
# Heading 2
Content 2
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section>' +
        '<h1 id="heading-1">Heading 1</h1>' +
        '<div class="wrap-h1"><p>Content 1</p></div>' +
        '<h1 id="heading-2">Heading 2</h1>' +
        '<div class="wrap-h1"><p>Content 2</p></div>' +
        '</section>',
    );
  });

  it('should handle nested headings correctly', () => {
    const markdown = `
# H1
Content under H1
## H2 under H1
Content under H2
# Another H1
Content under another H1
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section>' +
        '<h1 id="h1">H1</h1>' +
        '<div class="wrap-h1">' +
        '<p>Content under H1</p>' +
        '<h2 id="h2-under-h1">H2 under H1</h2>' +
        '<div class="wrap-h2"><p>Content under H2</p></div>' +
        '</div>' +
        '<h1 id="another-h1">Another H1</h1>' +
        '<div class="wrap-h1"><p>Content under another H1</p></div>' +
        '</section>',
    );
  });

  it('should handle multiple levels of nested headings', () => {
    const markdown = `
# H1
## H2
### H3
#### H4
Content under H4
### Another H3
Content under Another H3
# Another H1
Content under Another H1
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section>' +
        '<h1 id="h1">H1</h1>' +
        '<div class="wrap-h1">' +
        '<h2 id="h2">H2</h2>' +
        '<div class="wrap-h2">' +
        '<h3 id="h3">H3</h3>' +
        '<div class="wrap-h3">' +
        '<h4 id="h4">H4</h4>' +
        '<div class="wrap-h4"><p>Content under H4</p></div>' +
        '</div>' +
        '<h3 id="another-h3">Another H3</h3>' +
        '<div class="wrap-h3"><p>Content under Another H3</p></div>' +
        '</div>' +
        '</div>' +
        '<h1 id="another-h1">Another H1</h1>' +
        '<div class="wrap-h1"><p>Content under Another H1</p></div>' +
        '</section>',
    );
  });

  it('should handle empty input', () => {
    const container = renderCompiledMarkdown('');

    expect(container.innerHTML).toBe('');
  });

  it('should split content by hr tags and wrap in sections', () => {
    const markdown = `
First paragraph

---

Second paragraph
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section><p>First paragraph</p></section>' +
        '<section><p>Second paragraph</p></section>',
    );
  });
});
