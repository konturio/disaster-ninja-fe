import React from 'react';

// Helper function to create a wrapped div element
function createWrappedDiv(level: number, content: React.ReactNode[], key: string) {
  return React.createElement(
    'div',
    {
      className: `wrap-h${level}`,
      key,
    },
    content,
  );
}

// Helper function to create a section element
function createSection(content: React.ReactNode[], key: string) {
  return React.createElement('section', { key }, content);
}

// Function to wrap content in appropriate divs based on heading levels
function wrapContentInSection(content: React.ReactNode[]) {
  const result: React.ReactNode[] = [];
  const stack: { level: number; content: React.ReactNode[] }[] = [];
  let keyCounter = 0;

  const wrapAndPushContent = (level: number) => {
    while (stack.length > 0 && stack[stack.length - 1].level >= level) {
      const { level: stackLevel, content } = stack.pop()!;
      if (content.length > 0) {
        const wrappedContent = createWrappedDiv(
          stackLevel,
          content,
          `div-h${stackLevel}-${++keyCounter}`,
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
      const level = parseInt(headingMatch[1]);
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

// Main function to structure markdown content
export function structureMarkdownContent(compiled: JSX.Element[]) {
  const sections = splitIntoSections(compiled);

  return sections.map((section, index) =>
    createSection(wrapContentInSection(section), `section-${index}`),
  );
}
