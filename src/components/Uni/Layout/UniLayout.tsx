import React from 'react';
import { UniLayoutRenderer } from './UniLayoutRenderer';
import { UniLayoutContext, useUniLayoutContextValue } from './UniLayoutContext';
import type { FieldMeta } from '../fieldsRegistry';

interface UniLayoutProps {
  layout: any;
  data: any;
  actionHandler?: (action: string, payload?: any) => void;
  customFieldsRegistry?: Record<string, FieldMeta>;
  customFormatsRegistry?: Record<string, (value: any) => string>;
  children?: React.ReactNode;
}

/**
 * UniLayout is the top-level component that sets up context and renders the layout.
 */
export function UniLayout({
  layout,
  data,
  actionHandler = () => {},
  customFieldsRegistry = {},
  customFormatsRegistry = {},
  children,
}: UniLayoutProps) {
  const contextValue = useUniLayoutContextValue({
    layout,
    actionHandler,
    customFieldsRegistry,
    customFormatsRegistry,
  });

  return (
    <UniLayoutContext.Provider value={contextValue}>
      <UniLayoutRenderer node={layout} data={data} />
      {children}
    </UniLayoutContext.Provider>
  );
}
