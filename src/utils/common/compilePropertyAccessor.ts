export type AccessorFunction = (data: any) => any;

/**
 * Compiles a simple path (e.g. "user.profile.name") into an optimized accessor function
 */
export function compilePropertyAccessor(path: string): AccessorFunction {
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
