import { Legend as BiLegend } from '@konturio/ui-kit';
import { PopupTooltip } from '~features/tooltip';
import { BIVARIATE_LEGEND_SIZE } from './const';
import { CornerTooltipWrapper } from './CornerTooltipWrapper';

const meta = {
  hints: {
    x: {
      label: 'Average NDVI, JUN 2019',
      direction: [['bad'], ['good']],
    },
    y: {
      label: 'Multi-hazard exposure PDC GRVA',
      direction: [['unimportant'], ['bad', 'important']],
    },
  },
};

const axis = {
  x: {
    label: 'Multi-hazard exposure PDC GRVA to 1',
    steps: [
      {
        label: '',
        value: 0,
      },
      {
        label: '',
        value: 0.48,
      },
      {
        label: '',
        value: 0.62,
      },
      {
        label: '',
        value: 1,
      },
    ],
    quality: 0.997101882904748,
    quotient: ['mhe_index', 'one'],
    parent: null,
  },
  y: {
    label: 'Average NDVI, JUN 2019 to 1',
    steps: [
      {
        label: '',
        value: -1,
      },
      {
        label: '',
        value: 0.3625118070036407,
      },
      {
        label: '',
        value: 0.6441754083082613,
      },
      {
        label: '',
        value: 1,
      },
    ],
    quality: 0.9410965072118505,
    quotient: ['avg_ndvi', 'one'],
    parent: null,
  },
};

const cells = [
  {
    label: 'C1',
    color: 'rgba(90,200,127,0.5)',
  },
  {
    label: 'C2',
    color: 'rgba(179,165,130,0.5)',
  },
  {
    label: 'C3',
    color: 'rgba(153,153,153,0.5)',
  },
  {
    label: 'B1',
    color: 'rgba(169,218,122,0.5)',
  },
  {
    label: 'B2',
    color: 'rgba(195,163,111,0.5)',
  },
  {
    label: 'B3',
    color: 'rgba(204,103,116,0.5)',
  },
  {
    label: 'A1',
    color: 'rgba(232,232,157,0.5)',
  },
  {
    label: 'A2',
    color: 'rgba(216,159,88,0.5)',
  },
  {
    label: 'A3',
    color: 'rgba(228,26,28,0.5)',
  },
];

export default function BivariateLegendFixture() {
  return (
    <>
      <PopupTooltip />
      <CornerTooltipWrapper meta={meta}>
        <BiLegend
          showAxisLabels={true}
          size={BIVARIATE_LEGEND_SIZE}
          axis={axis}
          cells={cells}
        />
      </CornerTooltipWrapper>
    </>
  );
}
