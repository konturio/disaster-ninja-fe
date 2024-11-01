/**
 * @vitest-environment happy-dom
 */
import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { structureMarkdownContent } from './structuredMarkdown';
import { compiler } from 'markdown-to-jsx';

function renderCompiledMarkdown(
  markdown: string,
  idPrefix: string = 'hdr',
  classPrefix: string = 'wrap',
) {
  const compiled = compiler(markdown, { wrapper: null }) as unknown as JSX.Element[];
  const wrapped = structureMarkdownContent(compiled, idPrefix, classPrefix);
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
        '<h1 id="hdr-1">Heading 1</h1>' +
        '<div class="wrap-hdr-1"><p>Content under H1</p></div>' +
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
        '<h1 id="hdr-1">Heading 1</h1>' +
        '<div class="wrap-hdr-1"><p>Content 1</p></div>' +
        '<h1 id="hdr-2">Heading 2</h1>' +
        '<div class="wrap-hdr-2"><p>Content 2</p></div>' +
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
        '<h1 id="hdr-1">H1</h1>' +
        '<div class="wrap-hdr-1">' +
        '<p>Content under H1</p>' +
        '<h2 id="hdr-1-1">H2 under H1</h2>' +
        '<div class="wrap-hdr-1-1"><p>Content under H2</p></div>' +
        '</div>' +
        '<h1 id="hdr-2">Another H1</h1>' +
        '<div class="wrap-hdr-2"><p>Content under another H1</p></div>' +
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
        '<h1 id="hdr-1">H1</h1>' +
        '<div class="wrap-hdr-1">' +
        '<h2 id="hdr-1-1">H2</h2>' +
        '<div class="wrap-hdr-1-1">' +
        '<h3 id="hdr-1-1-1">H3</h3>' +
        '<div class="wrap-hdr-1-1-1">' +
        '<h4 id="hdr-1-1-1-1">H4</h4>' +
        '<div class="wrap-hdr-1-1-1-1"><p>Content under H4</p></div>' +
        '</div>' +
        '<h3 id="hdr-1-1-2">Another H3</h3>' +
        '<div class="wrap-hdr-1-1-2"><p>Content under Another H3</p></div>' +
        '</div>' +
        '</div>' +
        '<h1 id="hdr-2">Another H1</h1>' +
        '<div class="wrap-hdr-2"><p>Content under Another H1</p></div>' +
        '</section>',
    );
  });

  it('should handle custom prefix for heading IDs and classes', () => {
    const markdown = `
# H1
## H2
    `;
    const container = renderCompiledMarkdown(markdown, 'custom', 'section');

    expect(container.innerHTML).toBe(
      '<section>' +
        '<h1 id="custom-1">H1</h1>' +
        '<div class="section-custom-1">' +
        '<h2 id="custom-1-1">H2</h2>' +
        '</div>' +
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

  it('should handle skipped heading levels', () => {
    const markdown = `
# H1
Content 1
#### H4
Content 4
## H2
Content 2
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section>' +
        '<h1 id="hdr-1">H1</h1>' +
        '<div class="wrap-hdr-1">' +
        '<p>Content 1</p>' +
        '<h4 id="hdr-1-1">H4</h4>' +
        '<div class="wrap-hdr-1-1"><p>Content 4</p></div>' +
        '<h2 id="hdr-1-2">H2</h2>' +
        '<div class="wrap-hdr-1-2"><p>Content 2</p></div>' +
        '</div>' +
        '</section>',
    );
  });

  it('should handle empty headings', () => {
    const markdown = `
# H1
## H2
### H3
# H1 Again
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section>' +
        '<h1 id="hdr-1">H1</h1>' +
        '<div class="wrap-hdr-1">' +
        '<h2 id="hdr-1-1">H2</h2>' +
        '<div class="wrap-hdr-1-1">' +
        '<h3 id="hdr-1-1-1">H3</h3>' +
        '</div>' +
        '</div>' +
        '<h1 id="hdr-2">H1 Again</h1>' +
        '</section>',
    );
  });

  it('should handle mixed content types', () => {
    const markdown = `
# Main Title
* List item 1
* List item 2

## Sub Title
\`\`\`
code block
\`\`\`

### Details
1. Ordered item
2. Another item
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section>' +
        '<h1 id="hdr-1">Main Title</h1>' +
        '<div class="wrap-hdr-1">' +
        '<ul>' +
        '<li>List item 1</li>' +
        '<li>List item 2</li>' +
        '</ul>' +
        '<h2 id="hdr-1-1">Sub Title</h2>' +
        '<div class="wrap-hdr-1-1">' +
        '<pre><code>code block</code></pre>' +
        '<h3 id="hdr-1-1-1">Details</h3>' +
        '<div class="wrap-hdr-1-1-1">' +
        '<ol start="1">' +
        '<li>Ordered item</li>' +
        '<li>Another item</li>' +
        '</ol>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</section>',
    );
  });

  it('should handle multiple consecutive horizontal rules', () => {
    const markdown = `
First section

---

---

Second section

---

Third section
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section><p>First section</p></section>' +
        '<section><p>Second section</p></section>' +
        '<section><p>Third section</p></section>',
    );
  });

  it('should handle deep nesting with content at different levels', () => {
    const markdown = `
# H1
Content 1
## H2
Content 2
### H3
Content 3
#### H4
Content 4
##### H5
Content 5
###### H6
Content 6
## Back to H2
Content at H2
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section>' +
        '<h1 id="hdr-1">H1</h1>' +
        '<div class="wrap-hdr-1">' +
        '<p>Content 1</p>' +
        '<h2 id="hdr-1-1">H2</h2>' +
        '<div class="wrap-hdr-1-1">' +
        '<p>Content 2</p>' +
        '<h3 id="hdr-1-1-1">H3</h3>' +
        '<div class="wrap-hdr-1-1-1">' +
        '<p>Content 3</p>' +
        '<h4 id="hdr-1-1-1-1">H4</h4>' +
        '<div class="wrap-hdr-1-1-1-1">' +
        '<p>Content 4</p>' +
        '<h5 id="hdr-1-1-1-1-1">H5</h5>' +
        '<div class="wrap-hdr-1-1-1-1-1">' +
        '<p>Content 5</p>' +
        '<h6 id="hdr-1-1-1-1-1-1">H6</h6>' +
        '<div class="wrap-hdr-1-1-1-1-1-1"><p>Content 6</p></div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<h2 id="hdr-1-2">Back to H2</h2>' +
        '<div class="wrap-hdr-1-2"><p>Content at H2</p></div>' +
        '</div>' +
        '</section>',
    );
  });

  it('should handle content after last heading', () => {
    const markdown = `
# First Heading
Middle content
# Last Heading
Final content

Extra paragraph

Last line
    `;
    const container = renderCompiledMarkdown(markdown);

    expect(container.innerHTML).toBe(
      '<section>' +
        '<h1 id="hdr-1">First Heading</h1>' +
        '<div class="wrap-hdr-1"><p>Middle content</p></div>' +
        '<h1 id="hdr-2">Last Heading</h1>' +
        '<div class="wrap-hdr-2">' +
        '<p>Final content</p>' +
        '<p>Extra paragraph</p>' +
        '<p>Last line</p>' +
        '</div>' +
        '</section>',
    );
  });
});
