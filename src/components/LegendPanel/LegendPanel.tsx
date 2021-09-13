import { useMemo } from 'react';
import ConnectedLegend from '~components/ConnectedLegend/ConnectedLegend';
import OverlaySelector from '~components/LegendPanel/components/OverlaySelector/OverlaySelector';
import MapStatusCaption from '~components/LegendPanel/components/MapStatusCaption/MapStatusCaption';
import clsx from 'clsx';
import Collapse from '~components/Collapse/Collapse';
import styles from './LegendPanel.module.css';

interface CollapsedSideBarProps {
  className?: string;
}

const LegendPanel = ({ className }: CollapsedSideBarProps) => {
  const initialOpenState = useMemo(() => {
    const isMobile = document.body.clientWidth <= 600;
    const isLaptop = document.body.clientHeight <= 1000;
    return !isMobile && !isLaptop;
  }, []);
  console.log(
    '🚀 ~ file: LegendPanel.tsx ~ line 20 ~ initialOpenState ~ initialOpenState',
    initialOpenState,
  );

  return (
    <Collapse location="left" initialOpen={initialOpenState}>
      <div className={clsx(className, styles.sidebarContainer)}>
        <ConnectedLegend showAxisLabels showOverlayTitle />
        <MapStatusCaption />
        <OverlaySelector />
      </div>
    </Collapse>
  );
};

export default LegendPanel;
