import { formatBivariateAxisLabel } from '~utils/bivariate/labelFormatters';
import type { AxisDTO } from '~core/resources/bivariateStatisticsResource/types';
import type { Axis } from '~utils/bivariate/types/stat.types';

export function axisDTOtoAxis(dto: AxisDTO): Axis {
  return {
    ...dto,
    id: dto.quotient.join('|'),
    label: dto.label ?? formatBivariateAxisLabel(dto.quotients),
  };
}
