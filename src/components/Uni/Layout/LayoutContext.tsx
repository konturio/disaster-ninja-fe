import React, { useMemo, useCallback } from 'react';
import { componentsRegistry } from '../componentsRegistry';
import { fieldsRegistry } from '../fieldsRegistry';
import { formatsRegistry } from '../formatsRegistry';
import { useCompiledAccessors } from './accessorCompiler';
import { LayoutRenderer } from './LayoutRenderer';
import type { FieldMeta } from '../fieldsRegistry';
import type { UniLayoutContextType } from './types';

export const UniLayoutContext = React.createContext<UniLayoutContextType | null>(null);
export const useLayoutContext = (): UniLayoutContextType => {
  const context = React.useContext(UniLayoutContext);
  if (!context) {
    throw new Error('useLayoutContext must be used within a LayoutContextProvider');
  }
  return context;
};

// Default formatter if none found
const defaultFormatter = (v: any): string =>
  v !== null && v !== undefined ? String(v) : '';

/**
 * Creates a layout context configuration hook that can be used with LayoutContext.Provider
 */
export function useLayoutContextValue({
  layout,
  actionHandler = () => {},
  customComponentMap = {},
  customFieldsRegistry = {},
  customFormatsRegistry = {},
}: {
  layout: any;
  actionHandler?: (action: string, payload?: any) => void;
  customComponentMap?: Record<string, React.ComponentType<any>>;
  customFieldsRegistry?: Record<string, FieldMeta>;
  customFormatsRegistry?: Record<string, (value: any) => string>;
}): UniLayoutContextType {
  const mergedFormatsRegistry = useMemo(
    () => ({
      ...formatsRegistry,
      ...customFormatsRegistry,
    }),
    [customFormatsRegistry],
  );

  const mergedFieldsRegistry = useMemo(
    () => ({
      ...fieldsRegistry,
      ...customFieldsRegistry,
    }),
    [customFieldsRegistry],
  );

  // Compile accessors for all data bindings in the layout
  const precompiledAccessors = useCompiledAccessors(layout);

  const getFormattedValue = useCallback(
    (fieldMeta: FieldMeta | undefined | null, rawValue: any): string => {
      // Handle null/undefined rawValue early
      if (rawValue === null || rawValue === undefined) return '';

      const formatKey = fieldMeta?.format || 'text';
      const formatter = mergedFormatsRegistry[formatKey] || defaultFormatter;
      const formattedValue = formatter(rawValue);

      // Apply text transformation if available
      return fieldMeta?.text ? fieldMeta.text(formattedValue) : formattedValue;
    },
    [mergedFormatsRegistry],
  );

  return useMemo(
    () => ({
      componentsRegistry: {
        ...componentsRegistry,
        ...customComponentMap,
      },
      fieldsRegistry: mergedFieldsRegistry,
      formatsRegistry: mergedFormatsRegistry,
      precompiledAccessors,
      actionHandler,
      getFormattedValue,
      // Provide the renderer itself for recursive use
      RendererComponent: LayoutRenderer,
    }),
    [
      precompiledAccessors,
      actionHandler,
      customComponentMap,
      mergedFieldsRegistry,
      mergedFormatsRegistry,
      getFormattedValue,
    ],
  );
}
