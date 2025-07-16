import { useMemo } from 'react';
import { compilePropertyAccessor } from '~utils/common/compilePropertyAccessor';
import type { AccessorFunction } from '~utils/common/compilePropertyAccessor';

function compileAccessors(paths: string[]): Record<string, AccessorFunction> {
  const accessors: Record<string, AccessorFunction> = {};

  for (const path of paths) {
    accessors[path] = compilePropertyAccessor(path);
  }

  return accessors;
}

/**
 * Extracts all unique data binding paths from a layout node
 */
function extractDataBindingPaths(node: any, seen = new Set<any>()): string[] {
  if (!node || typeof node !== 'object' || seen.has(node)) return [];
  seen.add(node);

  const paths: string[] = [];

  // Check if this node has data bindings
  if (node.$value && typeof node.$value === 'string') {
    paths.push(node.$value);
  }

  // Check if this node has context bindings
  if (node.$context && typeof node.$context === 'string') {
    paths.push(node.$context);
  }

  // Check if this node has prop bindings
  if (node.$props && typeof node.$props === 'object') {
    for (const propPath of Object.values(node.$props)) {
      if (typeof propPath === 'string') {
        paths.push(propPath);
      }
    }
  }

  // Check for conditional rendering binding
  if (node.$if && typeof node.$if === 'string') {
    paths.push(node.$if);
  }

  // Process inline templates for list rendering
  if (node.$template && typeof node.$template === 'object') {
    paths.push(...extractDataBindingPaths(node.$template, seen));
  }

  // No need to extract paths from overrides since they are metadata customizations
  // and don't represent new data bindings themselves

  if (Array.isArray(node.children)) {
    for (const child of node.children) {
      paths.push(...extractDataBindingPaths(child, seen));
    }
  } else if (node.children && typeof node.children === 'object') {
    paths.push(...extractDataBindingPaths(node.children, seen));
  }

  return [...new Set(paths)];
}

/**
 * React hook that analyzes a layout definition and compiles all data accessors
 */
export function useUniLayoutCompiledAccessors(
  layoutDefinition: any,
): Record<string, AccessorFunction> {
  // Memoize accessor compilation based on layout definition
  return useMemo(() => {
    const paths = extractDataBindingPaths(layoutDefinition);
    return compileAccessors(paths);
  }, [layoutDefinition]);
}
