import type { FieldMeta } from '../fieldsRegistry';

export type UniLayoutIfCondition = {
  op: '==' | '!=' | '>' | '<' | '<=' | '>=';
  value: any;
};

export interface UniLayoutComponentNode {
  type: string;
  key?: string | number;
  props?: Record<string, any>;
  children?: any;
  $value?: string;
  $context?: string;
  $props?: Record<string, string>;
  $if?: string;
  ifCondition?: UniLayoutIfCondition;
  $template?: any;
  value?: any[];
  overrides?: Record<string, Partial<FieldMeta>>;
}

export interface UniLayoutContextType {
  fieldsRegistry: Record<string, FieldMeta>;
  formatsRegistry: Record<string, (value: any) => string>;
  precompiledAccessors: Record<string, AccessorFunction>;
  actionHandler: (action: string, payload?: any) => void;
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
}

export type AccessorFunction = (data: any) => any;
