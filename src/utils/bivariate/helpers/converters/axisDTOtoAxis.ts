import {
  formatBivariateAxisLabel,
  formatCustomBivariateAxisLabel,
} from '~utils/bivariate/labelFormatters';
import type { Axis, AxisDTO } from '~utils/bivariate/types/stat.types';

export function axisDTOtoAxis(dto: AxisDTO): Axis {
  return {
    ...dto,
    id: dto.quotient.join('|'),
    label: dto.label
      ? formatCustomBivariateAxisLabel(dto.label, dto.quotients)
      : formatBivariateAxisLabel(dto.quotients),
    transformation: {
      ...dto.transformation!,
      transformation: dto.transformation?.transformation ?? 'no',
    },
  };
}
