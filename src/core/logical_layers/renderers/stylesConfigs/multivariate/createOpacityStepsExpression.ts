import { multivariateDimensionToScore } from './multivariateDimensionToScore';
import type { ExpressionSpecification } from 'maplibre-gl';
import type { MCDALayerStyle } from '../mcda/types';

type OpacityStep = {
  minScore: number;
  opacity: number;
};

const DEFAULT_OPACITY_STEPS: OpacityStep[] = [
  { minScore: 0.66, opacity: 1 },
  { minScore: 0.33, opacity: 0.55 },
  { minScore: 0, opacity: 0.2 },
];

export function createOpacityStepsExpression(
  opacityMCDA: MCDALayerStyle,
  opacitySteps: OpacityStep[] = DEFAULT_OPACITY_STEPS,
): ExpressionSpecification {
  const opacityScore = multivariateDimensionToScore(
    opacityMCDA,
  ) as unknown as ExpressionSpecification;

  const conditions: (ExpressionSpecification | number)[] = [];
  for (let i = 0; i < opacitySteps?.length - 1; i += 1) {
    // all conditions except the default value
    conditions.push(
      ['>=', opacityScore, opacitySteps[i].minScore],
      opacitySteps[i].opacity,
    );
  }
  // default value (score >= 0)
  conditions.push(opacitySteps[opacitySteps.length - 1].opacity);

  return ['case', ...conditions] as ExpressionSpecification;
}
