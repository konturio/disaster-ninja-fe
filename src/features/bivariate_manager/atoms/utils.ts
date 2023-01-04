import type { AxisGroup } from '~core/types';

export type SelectionInput = {
  xNumerator: string | null;
  xDenominator: string | null;
  yNumerator: string | null;
  yDenominator: string | null;
};

export const onCalculateSelectedCell = (
  xGroups: AxisGroup[],
  yGroups: AxisGroup[],
  matrixSelection: SelectionInput,
): { x: number; y: number } => {
  const xIndex = xGroups
    ? xGroups.findIndex(
        (group) =>
          group.selectedQuotient[0] === matrixSelection?.xNumerator &&
          group.selectedQuotient[1] === matrixSelection?.xDenominator,
      )
    : -1;
  const yIndex = yGroups
    ? yGroups.findIndex(
        (group) =>
          group.selectedQuotient[0] === matrixSelection?.yNumerator &&
          group.selectedQuotient[1] === matrixSelection?.yDenominator,
      )
    : -1;

  return { x: xIndex, y: yIndex };
};

export const selectQuotientInGroupByNumDen = (
  groups: AxisGroup[],
  numId: string,
  denId: string,
): AxisGroup[] => {
  const newGroups = [...groups];

  let selectedQuotient: [string, string] | undefined;
  const groupIndex = newGroups.findIndex(({ quotients }) => {
    selectedQuotient = quotients.find(
      (q: [string, string]) => q[0] === numId && q[1] === denId,
    );
    return selectedQuotient;
  });

  if (selectedQuotient) {
    newGroups[groupIndex] = { ...newGroups[groupIndex], selectedQuotient };
  }

  return newGroups;
};
