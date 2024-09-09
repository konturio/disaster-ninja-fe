import { Text } from '@konturio/ui-kit';
import {
  IS_LAPTOP_QUERY,
  IS_MOBILE_QUERY,
  useMediaQuery,
} from '~utils/hooks/useMediaQuery';
import { DesktopLayout } from './Desktop/Desktop';
import { LaptopLayout } from './Laptop/Laptop';
import { MobileLayout } from './Mobile/Mobile';
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
}) {
  const isLaptop = useMediaQuery(IS_LAPTOP_QUERY);
  const isMobile = useMediaQuery(IS_MOBILE_QUERY);
  if (isMobile)
    return (
      <MobileLayout
        firstColumn={
          <>
            {analytics}
            {disasters}
            {editPanel}
            {layersAndLegends}
            {matrix}
            {layerFeaturesPanel}
          </>
        }
        topColumn={
          <>
            {breadcrumbs}
            {toolbar}
          </>
        }
        mapColumnBottom={timeline}
        footer={footer}
      />
    );

  if (isLaptop)
    return (
      <LaptopLayout
        firstColumn={
          <>
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
      analyticsColumn={
        <>
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
      layersColumn={
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
