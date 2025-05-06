import { useAtom } from '@reatom/npm-react';
import {
  IS_LAPTOP_QUERY,
  IS_MOBILE_QUERY,
  useMediaQuery,
} from '~utils/hooks/useMediaQuery';
import { presentationModeAtom } from '~core/shared_state/presentationMode';
import { DesktopLayout } from './Desktop/Desktop';
import { LaptopLayout } from './Laptop/Laptop';
import { MobileLayout } from './Mobile/Mobile';
import s from './Layout.module.css';
import type { ReactNode } from 'react';

export function Layout({
  disasters,
  analytics,
  toolbar,
  timeline,
  layersAndLegends,
  matrix,
  footer,
  editPanel,
  layerFeaturesPanel,
  breadcrumbs,
  searchBar,
  mapTitle,
  legendsPanel,
  currentEvent,
  copyrights,
}: {
  disasters: ReactNode;
  analytics: ReactNode;
  toolbar: ReactNode;
  timeline: ReactNode;
  layersAndLegends: ReactNode;
  matrix: ReactNode;
  footer: ReactNode;
  editPanel: ReactNode;
  layerFeaturesPanel: ReactNode;
  breadcrumbs: ReactNode;
  searchBar: ReactNode;
  copyrights: ReactNode;
  mapTitle: ReactNode;
  currentEvent: ReactNode;
  legendsPanel: ReactNode;
}) {
  const isLaptop = useMediaQuery(IS_LAPTOP_QUERY);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  const [isPresentationMode] = useAtom(presentationModeAtom);

  if (isPresentationMode) {
    return (
      <DesktopLayout
        topContent={
          <div className={s.headerRow}>
            <div className={s.breadcrumbs}>{breadcrumbs}</div>
            <div className={s.title}>{mapTitle}</div>
          </div>
        }
        bottomLeftContent={copyrights}
        rightColumn={
          <>
            {currentEvent}
            {legendsPanel}
          </>
        }
        footer={footer}
      />
    );
  }

  if (isMobile)
    return (
      <MobileLayout
        firstColumn={
          <>
            {searchBar}
            {toolbar}
            {analytics}
            {disasters}
            {editPanel}
            {layersAndLegends}
            {matrix}
            {layerFeaturesPanel}
          </>
        }
        topColumn={breadcrumbs}
        mapColumnBottom={timeline}
        footer={footer}
      />
    );

  if (isLaptop)
    return (
      <LaptopLayout
        firstColumn={
          <>
            {searchBar}
            {analytics}
            {disasters}
            {editPanel}
            {layersAndLegends}
            {matrix}
            {layerFeaturesPanel}
          </>
        }
        mapColumnTop={
          <>
            {breadcrumbs}
            {toolbar}
          </>
        }
        mapColumnBottom={timeline}
        footer={footer}
      />
    );

  return (
    <DesktopLayout
      leftColumn={
        <>
          {searchBar}
          {analytics}
          {disasters}
        </>
      }
      mapColumnTop={
        <>
          {breadcrumbs}
          {toolbar}
        </>
      }
      mapColumnBottom={timeline}
      rightColumn={
        <>
          {matrix}
          {layersAndLegends}
          {editPanel}
          {layerFeaturesPanel}
        </>
      }
      footer={footer}
    />
  );
}
