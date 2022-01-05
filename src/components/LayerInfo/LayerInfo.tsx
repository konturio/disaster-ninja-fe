import { Tooltip } from '~components/Tooltip/Tooltip';

export function LayerInfo({
  copyrights,
  description,
}: {
  copyrights?: string | string[];
  description?: string;
}) {
  if (Array.isArray(copyrights))
    return <Tooltip tipText={[description, ...copyrights].join('\n')} />;
  if (copyrights || description) {
    return <Tooltip tipText={[description, copyrights].join('\n')} />;
  } else {
    return null;
  }
}
