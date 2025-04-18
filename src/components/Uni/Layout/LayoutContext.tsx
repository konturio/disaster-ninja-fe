import React, { useMemo, useCallback } from 'react';
import { fieldsRegistry } from '../fieldsRegistry';
import { formatsRegistry } from '../formatsRegistry';
import { useCompiledAccessors } from './accessorCompiler';
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

const defaultFormatter = (v: any): string =>
  v !== null && v !== undefined ? String(v) : '';

/**
 * Creates a layout context configuration hook that can be used with LayoutContext.Provider
 */
export function useLayoutContextValue({
  layout,
  actionHandler = () => {},
  customFieldsRegistry = {},
  customFormatsRegistry = {},
}: {
  layout: any;
  actionHandler?: (action: string, payload?: any) => void;
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
      fieldsRegistry: mergedFieldsRegistry,
      formatsRegistry: mergedFormatsRegistry,
      precompiledAccessors,
      actionHandler,
      getFormattedValue,
    }),
    [
      precompiledAccessors,
      actionHandler,
      mergedFieldsRegistry,
      mergedFormatsRegistry,
      getFormattedValue,
    ],
  );
}
