import { capitalize, toCapitalizedList } from '~utils/common';

export const formatSentimentDirection = (input: string[] | string): string =>
  Array.isArray(input) ? toCapitalizedList(input) : capitalize(input);

export const convertDirectionsArrayToLabel = (directions: string[][]) => {
  const [from = '', to = ''] = directions;
  return `${formatSentimentDirection(from)} → ${formatSentimentDirection(to)}`;
};
