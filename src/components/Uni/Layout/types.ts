import type { FieldMeta } from '../fieldsRegistry';

export interface UniLayoutComponentNode {
  type: string;
  key?: string | number;
  props?: Record<string, any>;
  children?: any;
  $value?: string;
  $context?: string;
  $props?: Record<string, string>;
  $if?: string;
  $template?: any;
  value?: any[];
  overrides?: Record<string, Partial<FieldMeta>>;
}

export interface UniLayoutContextType {
  fieldsRegistry: Record<string, FieldMeta>;
  formatsRegistry: Record<string, (value: any) => string>;
  precompiledAccessors: Record<string, AccessorFunction>;
  actionHandler: (action: string, payload?: any) => void;
  getFormattedValue: (rawValue: unknown, format?: string) => string;
  getFormattedValueWithMeta: (
    rawValue: unknown,
    fieldMeta: FieldMeta | undefined | null,
  ) => string;
}

export interface BindingResult {
  value: any;
  fieldMeta: FieldMeta;
  error?: string;
}

export interface LayoutRendererProps {
  node: any;
  data: any;
}

export type AccessorFunction = (data: any) => any;
