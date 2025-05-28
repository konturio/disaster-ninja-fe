import type { ExpressionSpecification } from 'maplibre-gl';

const MULTIVARIATE_LABEL_VALUE_PLACEHOLDER = '{value}';
const MULTIVARIATE_LABEL_UNIT_PLACEHOLDER = '{unit}';
const DEFAULT_TEMPLATE = '{value} {unit}';

export function formatFeatureText(
  value: any,
  formatString?: string,
  unit?: string,
): ExpressionSpecification {
  if (!formatString && !unit) {
    return ['to-string', value];
  }
  let template = formatString ?? DEFAULT_TEMPLATE;
  if (unit) {
    template = template.replaceAll(MULTIVARIATE_LABEL_UNIT_PLACEHOLDER, unit);
  }
  const formattedParts: any[] = [];
  let lastIndex = 0;
  for (const match of template.matchAll(
    new RegExp(MULTIVARIATE_LABEL_VALUE_PLACEHOLDER, 'g'),
  )) {
    formattedParts.push(template.substring(lastIndex, match.index));
    formattedParts.push(value);
    lastIndex = match.index + MULTIVARIATE_LABEL_VALUE_PLACEHOLDER.length;
  }
  if (lastIndex < template.length) {
    formattedParts.push(template.substring(lastIndex, template.length));
  }
  return ['concat', ...formattedParts];
}
