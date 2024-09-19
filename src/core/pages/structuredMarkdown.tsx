import React from 'react';

// Function to wrap content in appropriate divs based on heading levels
function wrapContentInSection(content: React.ReactNode[]) {
  const result: React.ReactNode[] = [];
  const stack: { level: number; content: React.ReactNode[] }[] = [];
  let keyCounter = 0;

  const wrapAndPushContent = (level: number) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      const { level: stackLevel, content } = stack.pop()!;
      if (content.length > 0) {
        const wrappedContent = React.createElement(
          'div',
          {
            className: `wrap-h${stackLevel}`,
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
      const clonedElement = React.cloneElement(element, {
        key: `heading-${++keyCounter}`,
      });
      if (stack.length > 0 && level > stack[stack.length - 1].level) {
        stack[stack.length - 1].content.push(clonedElement);
      } else {
        result.push(clonedElement);
      }
      stack.push({ level, content: [] });
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
 * This function takes an array of JSX elements (typically the output of a markdown compiler)
 * and organizes it into a structured format. It performs the following operations:
 * 1. Splits the content into sections based on horizontal rule (<hr>) elements.
 * 2. Within each section, wraps content in nested <div> elements based on heading levels.
 * 3. Applies appropriate CSS classes to the wrapping <div> elements for styling purposes.
 * @param {JSX.Element[]} compiled - An array of JSX elements from markdown-to-jsx compiler.
 */
export function structureMarkdownContent(compiled: JSX.Element[]) {
  const sections = splitIntoSections(compiled);

  return sections.map((section, index) =>
    React.createElement(
      'section',
      { key: `section-${index}` },
      wrapContentInSection(section),
    ),
  );
}
