import type { UniLayoutIfCondition } from '../Layout/types';

export function checkIfCondition(value: any, condition?: UniLayoutIfCondition): boolean {
  switch (condition?.op) {
    case '==':
      return value === condition.value;
    case '!==':
      return value !== condition.value;
    case '>':
      return value > condition.value;
    case '<':
      return value < condition.value;
    case '>=':
      return value >= condition.value;
    case '<=':
      return value <= condition.value;
    default:
      return false;
  }
}
