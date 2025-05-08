export const MULTIVARIATE_LABEL_VALUE_PLACEHOLDER = '{value}';

export function formatFeatureText(formatString: string, value: any): string[] {
  const result: any[] = [];
  let lastIndex = 0;
  for (const match of formatString.matchAll(
    new RegExp(MULTIVARIATE_LABEL_VALUE_PLACEHOLDER, 'g'),
  )) {
    result.push(formatString.substring(lastIndex, match.index));
    result.push(value);
    lastIndex = match.index + MULTIVARIATE_LABEL_VALUE_PLACEHOLDER.length;
  }
  if (lastIndex < formatString.length) {
    result.push(formatString.substring(lastIndex, formatString.length));
  }
  return ['concat', ...result];
}
