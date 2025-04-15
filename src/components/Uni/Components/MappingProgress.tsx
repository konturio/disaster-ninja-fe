import { type StackedProgressBarItem, StackedProgressBar } from './Bar';

type MappingProgressProps = {
  percentValidated: number;
  percentMapped: number;
  caption?: string;
};

export function MappingProgress({
  percentValidated,
  percentMapped,
  caption,
}: MappingProgressProps) {
  const items: StackedProgressBarItem[] = [
    {
      title: '% Validated',
      value: +percentValidated,
      color: 'var(--success-strong)',
    },
    {
      title: '% Mapped',
      value: +percentMapped,
      color: 'var(--faint-strong)',
    },
  ];

  return <StackedProgressBar value={items} caption={caption} />;
}
