/**
 * Options for configuring template delimiters
 */
export interface TemplateOptions {
  /** Opening delimiter for placeholders (default: '{{') */
  open?: string;
  /** Closing delimiter for placeholders (default: '}}') */
  close?: string;
}

/**
 * Represents a normalized template structure where:
 * - Even indexes (0, 2, 4...) are always static text segments (may be empty strings)
 * - Odd indexes (1, 3, 5...) are always dynamic expression paths
 *
 * This guarantees a predictable alternating pattern of static/dynamic content,
 * starting and ending with static content (which may be empty strings).
 */
export type NormalizedTemplate = (string | string[])[];

/**
 * Parses a template string into a normalized segments array
 * where odd indexes are always expressions and even indexes are static text
 *
 * @param {string} template - The template string to parse
 * @param {TemplateOptions} options - Delimiter configuration
 * @returns {NormalizedTemplate} Array with predictable static/dynamic pattern
 */
export function parseTemplate(
  template: string,
  options: TemplateOptions = {},
): NormalizedTemplate {
  const open = options.open || '{{';
  const close = options.close || '}}';
  const openLength = open.length;
  const closeLength = close.length;

  // Always start with a static segment (may be empty)
  const segments: NormalizedTemplate = [''];
  let lastIndex = 0;
  let i = 0;

  while (i < template.length) {
    // Look for opening delimiter
    if (template.substring(i, i + openLength) === open) {
      // Add the text before the placeholder to the current static segment
      segments[segments.length - 1] += template.substring(lastIndex, i);

      // Skip the opening delimiter
      i += openLength;

      // Find the closing delimiter
      const keyStart = i;
      let delimiterFound = false;

      while (i <= template.length - closeLength) {
        if (template.substring(i, i + closeLength) === close) {
          delimiterFound = true;
          break;
        }
        i++;
      }

      if (delimiterFound) {
        // Extract the key and compile it into a path array
        const keyPath = template.substring(keyStart, i).trim().split('.');
        segments.push(keyPath); // Add dynamic segment (odd index)
        segments.push(''); // Add next static segment (even index)

        // Skip the closing delimiter
        i += closeLength;
        lastIndex = i;
      } else {
        // No closing delimiter found, treat as normal text
        segments[segments.length - 1] += open;
        i = keyStart;
        lastIndex = keyStart;
      }
    } else {
      i++;
    }
  }

  // Add the remaining text after the last placeholder to the last static segment
  if (lastIndex < template.length) {
    segments[segments.length - 1] += template.substring(lastIndex);
  }

  return segments;
}

/**
 * Creates an optimized template rendering function
 *
 * @param {NormalizedTemplate} segments - Parsed template segments with predictable pattern
 * @param {string} originalTemplate - The original template string
 * @returns {(data: Record<string, any>) => string} Fast template rendering function
 */
export function createTemplateRenderer(
  segments: NormalizedTemplate,
  originalTemplate: string,
): (data: Record<string, any>) => string {
  // Check if template has any dynamic parts
  const hasDynamicSegments = segments.length > 1;

  /**
   * Renders a template with provided data using optimized segment access
   * - Even indexes (0, 2, 4...) are always static text
   * - Odd indexes (1, 3, 5...) are always expressions
   *
   * @param {Record<string, any>} data - Data object containing values for template variables
   * @returns {string} The interpolated string with all placeholders replaced
   */
  return function renderTemplate(data: Record<string, any>): string {
    if (!data || !hasDynamicSegments) return originalTemplate;

    const result: string[] = [];

    // Always start with static content at index 0
    result.push(segments[0] as string);

    // Process all expression/static pairs
    for (let i = 1; i < segments.length; i += 2) {
      const expressionPath = segments[i] as string[];
      const staticText = segments[i + 1] as string;

      // Resolve the expression value
      const value = resolvePropertyPath(data, expressionPath);
      result.push(value);
      result.push(staticText);
    }

    return result.join('');
  };
}

/**
 * Resolves a property path in an object
 *
 * @param {Record<string, any>} obj - The object to extract value from
 * @param {string[]} path - Array of path segments
 * @returns {string} The extracted value as a string, or empty string if not found
 */
export function resolvePropertyPath(obj: Record<string, any>, path: string[]): string {
  // Fast path for null/undefined object
  if (obj == null) return '';
  // Fast path for empty path
  if (!path.length) return '';
  // Fast path for single segment
  if (path.length === 1) {
    const value = obj[path[0]];
    return value != null ? String(value) : '';
  }

  let value: any = obj;
  const len = path.length;

  // Optimize loop with direct index access
  for (let i = 0; i < len; i++) {
    // Fast path for null/undefined
    if (value == null) return '';

    // Fast path for primitive values
    if (typeof value !== 'object') return '';

    value = value[path[i]];
  }

  return value != null ? String(value) : '';
}

/**
 * Compiles a template string with placeholders into a reusable function
 *
 * @param {string} template - The template string containing placeholders
 * @param {TemplateOptions} [options] - Configuration options
 * @returns {(data: Record<string, any>) => string} - A function that takes an object and returns the interpolated string
 *
 * @example
 * // Default delimiters {{}}
 * const greeting = compileStringTemplate("Hello, {{name}}!");
 * greeting({ name: "John" }); // "Hello, John!"
 *
 * @example
 * // Custom delimiters ${}
 * const template = compileStringTemplate("Value: ${value}", { open: "${", close: "}" });
 * template({ value: 42 }); // "Value: 42"
 *
 * @example
 * // Nested properties
 * const userTemplate = compileStringTemplate("Name: {{user.name}}, Age: {{user.age}}");
 * userTemplate({ user: { name: "Alice", age: 30 } }); // "Name: Alice, Age: 30"
 */
export function compileStringTemplate(
  template: string,
  options: TemplateOptions = {},
): (data: Record<string, any>) => string {
  const segments = parseTemplate(template, options);
  return createTemplateRenderer(segments, template);
}
