import { PrismHigh, PrismLow, PrismMed } from '@konturio/default-icons';
import { DimensionStep } from './DimensionStep';
import s from './ExtrusionLegend.module.css';

export type OpacityStepType = {
  fillColor: string;
  label?: string;
};

export default function ExtrusionStepsLegend({
  lowMCDAScoreLayersDirections,
  highMCDAScoreLayersDirections,
}: {
  lowMCDAScoreLayersDirections: string[];
  highMCDAScoreLayersDirections: string[];
}) {
  return (
    <>
      <DimensionStep
        textLines={highMCDAScoreLayersDirections}
        icon={<PrismLow className={s.extruisionIcon} />}
      />
      <DimensionStep textLines={['']} icon={<PrismMed className={s.extruisionIcon} />} />
      <DimensionStep
        textLines={lowMCDAScoreLayersDirections}
        icon={<PrismHigh className={s.extruisionIcon} />}
      />
    </>
  );
}
