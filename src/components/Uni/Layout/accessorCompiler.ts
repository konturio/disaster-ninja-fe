import { useMemo } from 'react';
import type { AccessorFunction } from './types';

/**
 * Compiles a simple path (e.g. "user.profile.name") into an optimized accessor function
 */
export function compilePathAccessor(path: string): AccessorFunction {
  // Split the path into segments
  const segments = path.split('.');

  // Create the accessor function using new Function()
  // This generates a function like: return data?.user?.items?.[0]?.name;
  const code = `
    return function(data) {
      return data${segments
        .map((segment) => {
          // Array index segments
          if (/^\\d+$/.test(segment)) {
            return `?.[${segment}]`;
          }
          // Valid JS identifiers: dot notation
          if (/^[A-Za-z_$][A-Za-z0-9_$]*$/.test(segment)) {
            return `?.${segment}`;
          }
          // Fallback to bracket notation for keys with spaces or special chars
          const safe = segment.replace(/"/g, `\\"`);
          return `?.["${safe}"]`;
        })
        .join('')};
    }
  `;

  // Compile and return the function
  return new Function(code)() as AccessorFunction;
}

export function compileAccessors(paths: string[]): Record<string, AccessorFunction> {
  const accessors: Record<string, AccessorFunction> = {};

  for (const path of paths) {
    accessors[path] = compilePathAccessor(path);
  }

  return accessors;
}

/**
 * Extracts all unique data binding paths from a layout node
 */
export function extractDataBindingPaths(node: any, seen = new Set<any>()): string[] {
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
export function useCompiledAccessors(
  layoutDefinition: any,
): Record<string, AccessorFunction> {
  // Memoize accessor compilation based on layout definition
  return useMemo(() => {
    const paths = extractDataBindingPaths(layoutDefinition);
    return compileAccessors(paths);
  }, [layoutDefinition]);
}
