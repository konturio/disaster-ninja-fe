import { useAtom } from '@reatom/react';
import { legendPanelAtom } from '~features/legend_panel/atoms/legendPanel';
import { LegendPanel } from '~features/legend_panel/components/LegendPanel/LegendPanel';

export function Legend() {
  const [legends] = useAtom(legendPanelAtom);

  return <LegendPanel legends={legends} />;
}
