import { Tooltip } from '~components/Tooltip/Tooltip';

export function LayerInfo({
  copyrights,
  description,
}: {
  copyrights?: string;
  description?: string;
}) {
  if (copyrights || description) {
    return <Tooltip tipText={[description, copyrights].join('\n')} />;
  } else {
    return null;
  }
}
