import React from 'react';
import ConnectedLegend from '@components/ConnectedLegend/ConnectedLegend';
import OverlaySelector from '@components/LegendPanel/components/OverlaySelector/OverlaySelector';
import MapStatusCaption from '@components/LegendPanel/components/MapStatusCaption/MapStatusCaption';
import clsx from 'clsx';
import Collapse from '@components/shared/Collapse/Collapse';
import styles from './LegendPanel.module.scss';

interface CollapsedSideBarProps {
  className?: string;
}

const LegendPanel = ({ className }: CollapsedSideBarProps) => (
  <Collapse location="left">
    <div className={clsx(className, styles.sidebarContainer)}>
      <ConnectedLegend showAxisLabels showOverlayTitle />
      <MapStatusCaption />
      <OverlaySelector />
    </div>
  </Collapse>
);

export default LegendPanel;
