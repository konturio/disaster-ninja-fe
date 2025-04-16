import { Input, Text } from '@konturio/ui-kit';
import { NUMBER_FILTER } from '~features/mcda/components/MCDALayerEditor/MCDALayerParameters/constants';
import s from './CustomStepsInput.module.css';

export type CustomSteps = { scoreSteps: string[]; baseSteps: string[] };

type CustomStepsInputProps = {
  customSteps: CustomSteps;
  onCustomStepsChanged(newCustomSteps: CustomSteps);
};

export function CustomStepsInput({
  customSteps,
  onCustomStepsChanged,
}: CustomStepsInputProps) {
  return (
    <>
      <Text type="label">Custom steps</Text>
      <div className={s.customStepsRow}>
        <Text type="short-m" className={s.customStepsRowName}>
          Score:
        </Text>
        {customSteps?.scoreSteps?.map((step, index) => (
          <Input
            key={`customSteps-score-${index}`}
            classes={{
              inputBox: s.customStepInput,
            }}
            value={step}
            type="text"
            onChange={(event) => {
              const newValue = event.target.value.replace(NUMBER_FILTER, '');
              const newScoreSteps = [...customSteps.scoreSteps];
              newScoreSteps[index] = newValue;
              onCustomStepsChanged({
                baseSteps: customSteps.baseSteps,
                scoreSteps: newScoreSteps,
              });
            }}
          />
        ))}
      </div>
      <div className={s.customStepsRow}>
        <Text type="short-m" className={s.customStepsRowName}>
          Base:
        </Text>
        {customSteps?.baseSteps?.map((step, index) => (
          <Input
            key={`customSteps-score-${index}`}
            classes={{
              inputBox: s.customStepInput,
            }}
            value={step}
            type="text"
            onChange={(event) => {
              const newValue = event.target.value.replace(NUMBER_FILTER, '');
              const newBaseSteps = [...customSteps.baseSteps];
              newBaseSteps[index] = newValue;
              onCustomStepsChanged({
                scoreSteps: customSteps.scoreSteps,
                baseSteps: newBaseSteps,
              });
            }}
          />
        ))}
      </div>
    </>
  );
}
