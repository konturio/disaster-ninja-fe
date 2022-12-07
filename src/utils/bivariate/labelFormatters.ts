import { capitalize, toCapitalizedList } from '~utils/common';
import type { Axis } from '~utils/bivariate';

export const formatSentimentDirection = (input: string[] | string): string =>
  Array.isArray(input) ? toCapitalizedList(input) : capitalize(input);

export const convertDirectionsArrayToLabel = (directions: string[][]) => {
  const [from = '', to = ''] = directions;
  return `${formatSentimentDirection(from)} → ${formatSentimentDirection(to)}`;
};

export const formatBivariateAxisLabel = (quotients: Axis['quotients']): string => {
  if (!quotients) return '';
  const [numerator, denominator] = quotients;

  // no numerator unit - don't show units
  if (!hasUnits(numerator.unit.id)) {
    return `${numerator.label} to ${denominator.label}`;
  }
  // numerator unit + denominator unit - one
  if (denominator.name === 'one') {
    return `${numerator.label} (${numerator.unit.shortName})`;
  }
  //  numerator unit + no denominator unit - show only numerator unit
  if (!hasUnits(denominator.unit.id)) {
    return `${numerator.label} to ${denominator.label} (${numerator.unit.shortName})`;
  }
  // cases for both units
  if (denominator.name === 'area_km2') {
    return `${numerator.label} (${numerator.unit.shortName}/${denominator.unit.shortName})`;
  }

  return `${numerator.label} to ${denominator.label} (${numerator.unit.shortName}/${denominator.unit.shortName})`;
};

export const hasUnits = (unitId: string | null): boolean =>
  Boolean(unitId && unitId !== 'other');
