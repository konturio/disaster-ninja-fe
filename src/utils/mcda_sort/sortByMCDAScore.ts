import { isNumber } from '~utils/common';

export type SortByMCDAScoreConfig = {
  criteriaConfig: CriterionConfig[];
};

export type CriterionConfig = { name: string; weight: number; invertScore?: boolean };

export type MCDASortCriteriaExtractor<T> = (item: T) => Map<string, number>;

type MinMax = Record<string, { min: number | undefined; max: number | undefined }>;

export function sortByMCDAScore<T>(
  items: T[],
  sortConfig: SortByMCDAScoreConfig,
  extractor: MCDASortCriteriaExtractor<T>,
  sortOrder: 'asc' | 'desc',
): T[] {
  const minMax = findMinMax(items, sortConfig, extractor);
  const sortedItems = [...items].sort((a, b) => {
    const scoreA = calculateTotalScore(a, sortConfig.criteriaConfig, extractor, minMax);
    const scoreB = calculateTotalScore(b, sortConfig.criteriaConfig, extractor, minMax);
    return sortOrder === 'desc' ? scoreB - scoreA : scoreA - scoreB;
  });
  return sortedItems;
}

function calculateTotalScore<T>(
  item: T,
  criteriaConfigs: CriterionConfig[],
  extractor: MCDASortCriteriaExtractor<T>,
  minMax: MinMax,
): number {
  const itemCriteria = extractor(item);
  let sumOfCriteriaScores = 0;
  let weightsSum = 0;
  for (const criterionConfig of criteriaConfigs) {
    let score: number;
    const criterionValue = itemCriteria.get(criterionConfig.name);
    const minMaxValues = minMax[criterionConfig.name];
    if (
      isNumber(criterionValue) &&
      isNumber(minMaxValues?.max) &&
      isNumber(minMaxValues?.min) &&
      minMaxValues.max !== minMaxValues.min
    ) {
      score = (minMaxValues.max - criterionValue) / (minMaxValues.max - minMaxValues.min);
    } else {
      score = 0;
    }
    if (criterionConfig.invertScore) {
      score = 1 - score;
    }

    const weight = criterionConfig.weight;
    if (isNumber(weight)) {
      sumOfCriteriaScores += score * weight;
      weightsSum += weight;
    }
  }
  const totalScore = 1 - sumOfCriteriaScores / (weightsSum || 1);
  return totalScore;
}

function findMinMax<T>(
  items: T[],
  sortConfig: SortByMCDAScoreConfig,
  extractor: MCDASortCriteriaExtractor<T>,
): MinMax {
  const criteriaNames = sortConfig.criteriaConfig.map((c) => c.name);
  const minMax: MinMax = {};
  for (const names of criteriaNames) {
    minMax[names] = { min: undefined, max: undefined };
  }
  for (const item of items) {
    const itemProperties = extractor(item);
    for (const criteria of criteriaNames) {
      const itemCriterion = itemProperties.get(criteria);
      if (isNumber(itemCriterion)) {
        if (isNumber(minMax[criteria].max) && isNumber(minMax[criteria].min)) {
          if (itemCriterion > minMax[criteria].max) {
            minMax[criteria].max = itemCriterion;
          } else if (itemCriterion < minMax[criteria].min) {
            minMax[criteria].min = itemCriterion;
          }
        } else {
          if (!isNumber(minMax[criteria].min)) {
            minMax[criteria].min = itemCriterion;
          }
          if (!isNumber(minMax[criteria].max)) {
            minMax[criteria].max = itemCriterion;
          }
        }
      }
    }
  }
  return minMax;
}
