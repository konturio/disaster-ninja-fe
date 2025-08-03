import clsx from 'clsx';
import s from './DisasterShield.module.css';
import type { EventType } from '~core/types';

type CycloneCategory = 'TD' | 'TS' | '1' | '2' | '3' | '4' | '5';

const magnitudeColors: Array<{ from: number; to: number; color: string }> = [
  { from: 0, to: 1.9, color: '#009900' },
  { from: 2, to: 2.9, color: '#5CB702' },
  { from: 3, to: 3.9, color: '#9BCC33' },
  { from: 4, to: 4.9, color: '#CED21B' },
  { from: 5, to: 5.9, color: '#FACD2D' },
  { from: 6, to: 6.9, color: '#FFAB2E' },
  { from: 7, to: 7.9, color: '#FF8A00' },
  { from: 8, to: 8.9, color: '#FF6600' },
  { from: 9, to: 9.9, color: '#FF3D00' },
  { from: 10, to: 10.9, color: '#DA2902' },
  { from: 11, to: 11.9, color: '#B32000' },
  { from: 12, to: Number.POSITIVE_INFINITY, color: '#700D00' },
];

const cycloneCategoryColors: Record<CycloneCategory, string> = {
  TD: '#5CB702',
  TS: '#9BCC33',
  '1': '#FACD2D',
  '2': '#FFB800',
  '3': '#FF8A00',
  '4': '#FF3D00',
  '5': '#EA2A00',
};

interface DisasterShieldProps {
  eventType: EventType;
  magnitude?: number;
  cycloneCategory?: string;
  className?: string;
}

export function DisasterShield({
  eventType,
  magnitude,
  cycloneCategory,
  className,
}: DisasterShieldProps) {
  let label: string | null = null;
  let color: string | undefined;

  if (eventType === 'EARTHQUAKE' && typeof magnitude === 'number') {
    label = `M ${magnitude}`;
    color = magnitudeColors.find((r) => magnitude >= r.from && magnitude <= r.to)?.color;
  }

  if (eventType === 'CYCLONE' && cycloneCategory) {
    const cat = cycloneCategory as CycloneCategory;
    color = cycloneCategoryColors[cat];
    label = ['TD', 'TS'].includes(cat) ? cat : `Cat ${cat}`;
  }

  if (!label || !color) return null;

  return (
    <div className={clsx(s.shield, className)} style={{ backgroundColor: color }}>
      {label}
    </div>
  );
}
