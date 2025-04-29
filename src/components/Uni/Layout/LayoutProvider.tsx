import React from 'react';
import { LayoutRenderer } from './LayoutRenderer';
import { UniLayoutContext, useLayoutContextValue } from './LayoutContext';
import type { FieldMeta } from '../fieldsRegistry';

interface LayoutProviderProps {
  layout: any;
  data: any;
  actionHandler?: (action: string, payload?: any) => void;
  customFieldsRegistry?: Record<string, FieldMeta>;
  customFormatsRegistry?: Record<string, (value: any) => string>;
  children?: React.ReactNode;
}

/**
 * LayoutProvider wraps the LayoutRenderer with the necessary context
 */
export function LayoutProvider({
  layout,
  data,
  actionHandler = () => {},
  customFieldsRegistry = {},
  customFormatsRegistry = {},
  children,
}: LayoutProviderProps) {
  const contextValue = useLayoutContextValue({
    layout,
    actionHandler,
    customFieldsRegistry,
    customFormatsRegistry,
  });

  return (
    <UniLayoutContext.Provider value={contextValue}>
      <LayoutRenderer node={layout} data={data} />
      {children}
    </UniLayoutContext.Provider>
  );
}
