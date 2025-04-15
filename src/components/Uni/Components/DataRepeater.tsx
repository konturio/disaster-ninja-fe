import React from 'react';
import { useLayoutContext } from '../Layout/LayoutContext';

export interface DataRepeaterProps {
  value?: any[];

  template?: any;
}

/**
 * DataRepeater renders a list of items based on a template
 */
export function DataRepeater({ value, template }: DataRepeaterProps) {
  const context = useLayoutContext();
  const RendererComponent = context.RendererComponent;

  if (!RendererComponent) {
    console.error('DataRepeater requires RendererComponent from context');
    return null;
  }

  if (!Array.isArray(value) || !template) {
    return null;
  }

  return (
    <>
      {value.map((item, index) => (
        <RendererComponent key={index} node={template} data={item} />
      ))}
    </>
  );
}
