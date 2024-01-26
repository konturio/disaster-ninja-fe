import { formatBivariateAxisLabel } from '~utils/bivariate/labelFormatters';
import type { Axis } from '~utils/bivariate/types/stat.types';

export function axisDTOtoAxis(dto: Omit<Axis, 'id' | 'label'>): Axis {
  return {
    ...dto,
    id: dto.quotient.join('|'),
    label: formatBivariateAxisLabel(dto.quotients),
  };
}
