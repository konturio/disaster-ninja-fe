import React, { memo, isValidElement } from 'react';
import { isNonNullish } from '~utils/common';
import { componentsRegistry } from '../componentsRegistry';
import { ErrorComponent } from './ErrorComponent';
import { useLayoutContext } from './LayoutContext';
import type { FieldMeta } from '../fieldsRegistry';
import type {
  BindingResult,
  LayoutRendererProps,
  UniLayoutComponentNode,
  UniLayoutContextType,
} from './types';

function isComponentNode(node: any): node is UniLayoutComponentNode {
  return (
    node && typeof node === 'object' && (typeof node.type === 'string' || node.$template)
  );
}

function resolveBinding(
  dataPath: string,
  contextData: any,
  context: UniLayoutContextType,
): BindingResult {
  if (isDirectPropertyAccess(dataPath, contextData)) {
    return createBindingResult(
      contextData[dataPath],
      context.fieldsRegistry?.[dataPath] || context.fieldsRegistry.default,
    );
  }

  const accessor = context.precompiledAccessors?.[dataPath];
  if (!accessor) {
    return createBindingError(`No precompiled accessor for "${dataPath}"`);
  }

  try {
    const value = accessor(contextData);
    return createBindingResult(
      value,
      context.fieldsRegistry?.[dataPath] || context.fieldsRegistry.default,
    );
  } catch (error) {
    return createBindingError(`Execution failed for "${dataPath}": ${String(error)}`);
  }
}

function isDirectPropertyAccess(dataPath: string, contextData: any): boolean {
  return (
    dataPath && contextData && typeof contextData === 'object' && dataPath in contextData
  );
}

function createBindingResult(value: any, fieldMeta: FieldMeta): BindingResult {
  return { value, fieldMeta };
}

function createBindingError(error: string): BindingResult {
  return { value: undefined, fieldMeta: { type: 'text' }, error };
}

function resolveComponent(
  type: string,
  customComponents = {},
): [React.ComponentType<any> | null, boolean] {
  const Component = customComponents[type] || componentsRegistry[type];
  return [Component, !!Component];
}

/**
 * Applies overrides to fieldMeta via shallow merge
 */
function applyOverrides(
  fieldMeta: FieldMeta,
  overrides: Partial<FieldMeta> = {},
): FieldMeta {
  if (!overrides) return fieldMeta;

  return { ...fieldMeta, ...overrides };
}

function processNodeProps(
  node: UniLayoutComponentNode,
  data: any,
  context: UniLayoutContextType,
): {
  resolvedProps: Record<string, any>;
  boundData: any;
} {
  const {
    props: staticProps,
    $value: dataBindingPath,
    $context: contextBindingPath,
    $props: propsBindings,
    overrides,
    type,
    key,
    children,
    $if,
    ...restNodeProps
  } = node;

  const resolvedProps: Record<string, any> = { ...restNodeProps, ...staticProps };
  let boundData: any = data;

  // 1. Context Resolution: First process $context to establish the data scope
  if (contextBindingPath && typeof contextBindingPath === 'string') {
    const contextBindingResult = resolveBinding(contextBindingPath, data, context);
    boundData = contextBindingResult.value;
  }

  // 2. Value Binding: Resolve $value within the established context
  if (dataBindingPath && typeof dataBindingPath === 'string') {
    const dataBindingResult = resolveBinding(dataBindingPath, boundData, context);

    // Apply any overrides to the field metadata
    const fieldMeta = overrides?.value
      ? applyOverrides(dataBindingResult.fieldMeta, overrides.value)
      : dataBindingResult.fieldMeta;

    // Set direct value on the component for $value binding
    resolvedProps.value = dataBindingResult.value;

    // Associate metadata with the component through $meta
    resolvedProps.$meta = { value: fieldMeta };
  } else if (!dataBindingPath && isNonNullish(boundData) && !('value' in resolvedProps)) {
    // Only auto-bind if no static value was provided
    resolvedProps.value = boundData;
    resolvedProps.$meta = { value: context.fieldsRegistry.default };
  }

  // 3. Property Binding: Map data fields to specific component properties via $props
  if (propsBindings && typeof propsBindings === 'object') {
    if (!resolvedProps.$meta) {
      resolvedProps.$meta = { value: {} };
    }

    for (const [propName, propPath] of Object.entries(propsBindings)) {
      if (typeof propPath !== 'string') {
        continue;
      }

      const propBindingResult = resolveBinding(propPath, boundData, context);

      // Apply any overrides to the field metadata
      const fieldMeta = overrides?.[propName]
        ? applyOverrides(propBindingResult.fieldMeta, overrides[propName])
        : propBindingResult.fieldMeta;

      // Set raw value directly on the prop
      resolvedProps[propName] = propBindingResult.value;

      // Associate metadata with the property in $meta
      resolvedProps.$meta[propName] = fieldMeta;
    }
  }

  // 4. Inject action handler with bound data context
  if (context.actionHandler) {
    resolvedProps.handleAction = (action: string, actionData?: any) => {
      // Call the context's action handler with the action name and merged data
      // This includes both the component's data context and any additional data provided
      context.actionHandler(action, { ...boundData, ...actionData });
    };
  }

  return { resolvedProps, boundData };
}

function shouldProcessChildren(node: UniLayoutComponentNode): boolean {
  // Let all components receive their children if defined
  return node.children !== undefined;
}

function renderChildren(
  children: any,
  data: any,
  customComponents = {},
): React.ReactNode {
  if (Array.isArray(children)) {
    return children.map((child, index) => (
      <LayoutRendererInternal
        key={child?.key ?? index}
        node={child}
        data={data}
        customComponents={customComponents}
      />
    ));
  }

  if (
    children &&
    (typeof children === 'object' ||
      typeof children === 'string' ||
      typeof children === 'number' ||
      isValidElement(children))
  ) {
    return isValidElement(children) ? (
      children
    ) : (
      <LayoutRendererInternal
        node={children}
        data={data}
        customComponents={customComponents}
      />
    );
  }

  return null;
}

/**
 * Recursively renders UI from a JSON layout node, resolving data bindings.
 */
const LayoutRendererInternal = ({
  node,
  data,
  customComponents = {},
}: LayoutRendererProps) => {
  const context = useLayoutContext();

  if (node === null || node === undefined || typeof node === 'boolean') {
    return null;
  }

  if (typeof node === 'string' || typeof node === 'number') {
    return node;
  }

  if (isValidElement(node)) {
    return node;
  }

  if (Array.isArray(node)) {
    return (
      <React.Fragment>
        {node.map((childNode, index) => (
          <LayoutRendererInternal
            key={childNode?.key ?? index}
            node={childNode}
            data={data}
            customComponents={customComponents}
          />
        ))}
      </React.Fragment>
    );
  }

  if (!node || typeof node !== 'object') {
    return null;
  }

  const { resolvedProps, boundData } = processNodeProps(node, data, context);

  if (node.$if) {
    const ifBindingResult = resolveBinding(node.$if, boundData, context);
    if (!ifBindingResult.value) {
      return null;
    }
  }

  if (node.$template && Array.isArray(resolvedProps.value)) {
    return (
      <>
        {resolvedProps.value.map((item, index) => (
          <LayoutRendererInternal
            key={index}
            node={node.$template}
            data={item}
            customComponents={customComponents}
          />
        ))}
      </>
    );
  }

  if (!isComponentNode(node) || !node.type) {
    return null;
  }

  // Use customComponents to override the default components from context
  const [Component] = resolveComponent(node.type, customComponents);
  const componentExists = !!Component;

  if (!componentExists) {
    return <ErrorComponent type={node.type} severity="warning" />;
  }

  const childrenDataContext = boundData !== undefined ? boundData : data;
  const renderedChildren = shouldProcessChildren(node)
    ? renderChildren(node.children, childrenDataContext, customComponents)
    : null;

  try {
    return React.createElement(
      Component,
      { ...(node.key !== undefined && { key: node.key }), ...resolvedProps },
      renderedChildren,
    );
  } catch (error: unknown) {
    return <ErrorComponent type={node.type} error={`Render error: ${String(error)}`} />;
  }
};

export const LayoutRenderer = memo(LayoutRendererInternal);
