import { formatBivariateAxisLabel } from '~utils/bivariate/labelFormatters';
import type { AxisDTO } from '~core/resources/bivariateStatisticsResource/types';
import type { Axis } from '~utils/bivariate/types/stat.types';
import type { TransformationFunction } from '~core/logical_layers/renderers/stylesConfigs/mcda/types';

// TODO: remove either sqrt or square_root, then remove this function
function replaceTransformationNameAliases(
  transformation: TransformationFunction,
): TransformationFunction {
  switch (transformation) {
    case 'sqrt':
      return 'square_root';
    default:
      return transformation;
  }
}

export function axisDTOtoAxis(dto: AxisDTO): Axis {
  return {
    ...dto,
    id: dto.quotient.join('|'),
    label: dto.label || formatBivariateAxisLabel(dto.quotients),
    transformation: {
      ...dto.transformation!,
      transformation: replaceTransformationNameAliases(
        dto.transformation?.transformation ?? 'no',
      ),
    },
  };
}
