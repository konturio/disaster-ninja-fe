import React from 'react';

export function structureMarkdownContent(compiled: JSX.Element[]) {
  const sections: React.ReactNode[] = [];
  let currentSection: React.ReactNode[] = [];
  let keyCounter = 0;
  const wrapSection = () => {
    if (currentSection.length > 0) {
      sections.push(
        React.createElement(
          'section',
          { key: `section-${sections.length}` },
          wrapContentInSection(currentSection),
        ),
      );
      currentSection = [];
    }
  };

  const wrapContentInSection = (content: React.ReactNode[]) => {
    const result: React.ReactNode[] = [];
    const stack: { level: number; content: React.ReactNode[] }[] = [];

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

    React.Children.forEach(content, (element) => {
      if (React.isValidElement(element)) {
        const headingMatch = element.type.toString().match(/^h([1-6])$/);
        if (headingMatch) {
          const level = parseInt(headingMatch[1]);
          wrapAndPushContent(level);
          if (stack.length > 0 && level > stack[stack.length - 1].level) {
            stack[stack.length - 1].content.push(
              React.cloneElement(element, {
                key: `heading-${stack[stack.length - 1].content.length}`,
              }),
            );
          } else {
            result.push(React.cloneElement(element, { key: `heading-${result.length}` }));
          }
          stack.push({ level, content: [] });
        } else {
          if (stack.length > 0) {
            stack[stack.length - 1].content.push(
              React.cloneElement(element, {
                key: `content-${stack[stack.length - 1].content.length}`,
              }),
            );
          } else {
            result.push(React.cloneElement(element, { key: `content-${result.length}` }));
          }
        }
      }
    });

    wrapAndPushContent(0);

    return result;
  };

  React.Children.forEach(compiled, (element) => {
    if (React.isValidElement(element) && element.type === 'hr') {
      wrapSection();
    } else {
      currentSection.push(element);
    }
  });

  wrapSection(); // Wrap the last section

  return sections;
}
