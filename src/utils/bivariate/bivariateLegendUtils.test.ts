import { expect, describe, it } from 'vitest';
import { getCellLabelByValue } from './bivariateLegendUtils';

describe('bivariateLegendUtils', () => {
  it('getCellLabelByValue', () => {
    const xSteps = [
      {
        label: '',
        value: 0,
      },
      {
        label: '',
        value: 3.765487321741848,
      },
      {
        label: '',
        value: 26.27916278223144,
      },
      {
        label: '',
        value: 47090,
      },
    ];
    const ySteps = [
      {
        label: '',
        value: 0,
      },
      {
        label: '',
        value: 5.477844166003798,
      },
      {
        label: '',
        value: 61.57941071048551,
      },
      {
        label: '',
        value: 46200,
      },
    ];
    expect(getCellLabelByValue(xSteps, ySteps, 3, 84)).toEqual('A3');
    expect(getCellLabelByValue(xSteps, ySteps, 1, 1)).toEqual('A1');
    expect(getCellLabelByValue(xSteps, ySteps, 27, 154)).toEqual('C3');
    expect(getCellLabelByValue(xSteps, ySteps, 7, 23)).toEqual('B2');
    expect(getCellLabelByValue(xSteps, ySteps, 0, 23)).toEqual('A2');
    expect(getCellLabelByValue(xSteps, ySteps, 7, 0)).toEqual('B1');
  });
});
