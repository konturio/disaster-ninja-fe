import { defaultFormatter } from './defaultFormatter';

export function applyFormatter(
  value: unknown,
  formatter: (value: unknown) => string,
  formatKey?: string,
): string {
  try {
    return formatter(value);
  } catch (error) {
    console.error(`Formatting error (${formatKey ?? ''}):`, error);
    return defaultFormatter(value);
  }
}
