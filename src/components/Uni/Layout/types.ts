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
  overrides?: Record<string, Partial<FieldMeta>>;
}

export interface UniLayoutContextType {
  componentsRegistry: Record<string, React.ComponentType<any>>;
  fieldsRegistry: Record<string, FieldMeta>;
  formatsRegistry: Record<string, (value: any) => string>;
  precompiledAccessors: Record<string, AccessorFunction>;
  actionHandler: (action: string, payload?: any) => void;
  RendererComponent?: React.ComponentType<{ node: any; data: any }>;
  getFormattedValue: (fieldMeta: FieldMeta | undefined | null, value: any) => string;
}

export interface BindingResult {
  value: any;
  fieldMeta: FieldMeta;
  error?: string;
}

export interface LayoutRendererProps {
  node: any;
  data: any;
  customComponents?: Record<string, React.ComponentType<any>>;
}

export type AccessorFunction = (data: any) => any;
