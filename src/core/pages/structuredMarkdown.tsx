import React from 'react';

// Function to wrap content in appropriate divs based on heading levels
function wrapContentInSection(
  content: React.ReactNode[],
  idPrefix: string,
  classPrefix: string,
) {
  const result: React.ReactNode[] = [];
  const stack: { level: number; content: React.ReactNode[]; id: string }[] = [];
  let keyCounter = 0;
  // Track counters for each parent's children
  const parentCounters = new Map<string, number>();

  const wrapAndPushContent = (level: number) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      const { level: stackLevel, content, id } = stack.pop()!;
      if (content.length > 0) {
        const wrappedContent = React.createElement(
          'div',
          {
            className: `${classPrefix}-${id}`,
            key: `div-h${stackLevel}-${++keyCounter}`,
          },
          content,
        );
        if (stack.length > 0) {
          stack[stack.length - 1].content.push(wrappedContent);
        } else {
          result.push(wrappedContent);
        }
      }
    }
  };

  const processElement = (element: React.ReactElement) => {
    const headingMatch = element.type.toString().match(/^h([1-6])$/);
    if (headingMatch) {
      const level = Number.parseInt(headingMatch[1]);
      wrapAndPushContent(level);

      // Get parent's ID or empty string if no parent
      const parentId = stack.length > 0 ? stack[stack.length - 1].id : '';

      // Increment counter for this parent
      const currentCount = (parentCounters.get(parentId) || 0) + 1;
      parentCounters.set(parentId, currentCount);

      // Build ID path
      const fullId = parentId
        ? `${parentId}-${currentCount}`
        : `${idPrefix}-${currentCount}`;

      const clonedElement = React.cloneElement(element, {
        key: `heading-${++keyCounter}`,
        id: fullId,
      });
      if (stack.length > 0 && level > stack[stack.length - 1].level) {
        stack[stack.length - 1].content.push(clonedElement);
      } else {
        result.push(clonedElement);
      }
      stack.push({ level, content: [], id: fullId });
    } else {
      const clonedElement = React.cloneElement(element, {
        key: `content-${++keyCounter}`,
      });
      if (stack.length > 0) {
        stack[stack.length - 1].content.push(clonedElement);
      } else {
        result.push(clonedElement);
      }
    }
  };

  React.Children.forEach(content, (element) => {
    if (React.isValidElement(element)) {
      processElement(element);
    }
  });

  wrapAndPushContent(0);

  return result;
}

// Split into sections by hr elements
export function splitIntoSections(compiled: JSX.Element[]): React.ReactNode[][] {
  const sections: React.ReactNode[][] = [];
  let currentSection: React.ReactNode[] = [];

  React.Children.forEach(compiled, (element) => {
    if (React.isValidElement(element) && element.type === 'hr') {
      if (currentSection.length > 0) {
        sections.push(currentSection);
        currentSection = [];
      }
    } else {
      currentSection.push(element);
    }
  });

  if (currentSection.length > 0) {
    sections.push(currentSection);
  }

  return sections;
}

/**
 * Structures compiled markdown content into sections with nested heading levels.
 *
 * This function processes markdown content in several steps:
 * 1. Splits content into major sections using horizontal rules (<hr/>) as dividers
 * 2. Within each section, creates a hierarchical structure based on heading levels (h1-h6)
 * 3. Wraps content between headings in div elements with corresponding classes
 * 4. Generates unique IDs for each heading following a hierarchical pattern
 *
 * Heading ID pattern:
 * - Top level: {idPrefix}-{counter} (e.g., "hdr-1")
 * - Nested: {idPrefix}-{parent}-{counter} (e.g., "hdr-1-1" for h2 under first h1)
 *
 * Wrapper class pattern:
 * - Top level: {classPrefix}-{idPrefix}-{counter} (e.g., "wrap-hdr-1")
 * - Nested: {classPrefix}-{idPrefix}-{parent}-{counter} (e.g., "wrap-hdr-1-1")
 *
 * Example structure:
 * ```html
 * <section>
 *   <h1 id="hdr-1">Title</h1>
 *   <div class="wrap-hdr-1">
 *     <p>Content</p>
 *     <h2 id="hdr-1-1">Subtitle</h2>
 *     <div class="wrap-hdr-1-1">
 *       <p>Nested content</p>
 *     </div>
 *   </div>
 * </section>
 * ```
 *
 * @param {JSX.Element[]} compiled - An array of JSX elements from markdown-to-jsx compiler
 * @param {string} [idPrefix='hdr'] - Prefix for generated heading IDs
 * @param {string} [classPrefix='wrap'] - Prefix for wrapper div classes
 * @returns {React.ReactNode[]} Array of section elements with structured content
 */
export function structureMarkdownContent(
  compiled: JSX.Element[],
  idPrefix: string = 'hdr',
  classPrefix: string = 'wrap',
) {
  const sections = splitIntoSections(compiled);

  return sections.map((section, index) =>
    React.createElement(
      'section',
      { key: `section-${index}` },
      wrapContentInSection(section, idPrefix, classPrefix),
    ),
  );
}
