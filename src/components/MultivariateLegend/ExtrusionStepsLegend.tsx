import { PrismHigh, PrismLow, PrismMed } from '@konturio/default-icons';
import { MultivariateLegendStep } from './MultivariateLegendStep';
import s from './ExtrusionLegend.module.css';

export default function ExtrusionStepsLegend({
  lowMCDAScoreLayersDirections,
  highMCDAScoreLayersDirections,
}: {
  lowMCDAScoreLayersDirections: string[];
  highMCDAScoreLayersDirections: string[];
}) {
  return (
    <>
      <MultivariateLegendStep
        textLines={highMCDAScoreLayersDirections}
        icon={<PrismLow className={s.extruisionIcon} />}
      />
      <MultivariateLegendStep
        textLines={['']}
        icon={<PrismMed className={s.extruisionIcon} />}
      />
      <MultivariateLegendStep
        textLines={lowMCDAScoreLayersDirections}
        icon={<PrismHigh className={s.extruisionIcon} />}
      />
    </>
  );
}
