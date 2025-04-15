import React from 'react';
import { LayoutRenderer } from './LayoutRenderer';
import { UniLayoutContext, useLayoutContextValue } from './LayoutContext';
import type { FieldMeta } from '../fieldsRegistry';

export interface LayoutProviderProps {
  /**
   * The layout definition to render
   */
  layout: any;

  /**
   * The data to bind to the layout
   */
  data: any;

  /**
   * Optional action handler for interactivity
   */
  actionHandler?: (action: string, payload?: any) => void;

  /**
   * Optional custom component map to extend or override the default components
   */
  customComponentMap?: Record<string, React.ComponentType<any>>;

  /**
   * Optional custom field registry to extend or override the default field registry
   */
  customFieldsRegistry?: Record<string, FieldMeta>;

  /**
   * Optional custom format registry to extend or override the default format registry
   */
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
  customComponentMap = {},
  customFieldsRegistry = {},
  customFormatsRegistry = {},
  children,
}: LayoutProviderProps) {
  // Use the new hook to create context value
  const contextValue = useLayoutContextValue({
    layout,
    actionHandler,
    customFieldsRegistry,
    customFormatsRegistry,
  });

  return (
    <UniLayoutContext.Provider value={contextValue}>
      <LayoutRenderer node={layout} data={data} customComponents={customComponentMap} />
      {children}
    </UniLayoutContext.Provider>
  );
}
