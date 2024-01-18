import {
  IS_LAPTOP_QUERY,
  IS_MOBILE_QUERY,
  useMediaQuery,
} from '~utils/hooks/useMediaQuery';
import { DesktopLayout } from './Desktop/Desktop';
import { LaptopLayout } from './Laptop/Laptop';
import { MobileLayout } from './Mobile/Mobile';

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
}: {
  disasters: JSX.Element;
  analytics: JSX.Element;
  toolbar: JSX.Element;
  timeline: JSX.Element;
  layersAndLegends: JSX.Element;
  matrix: JSX.Element;
  footer: JSX.Element;
  editPanel: JSX.Element;
  layerFeaturesPanel: JSX.Element;
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
        topColumn={toolbar}
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
        mapColumnTop={toolbar}
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
      mapColumnTop={toolbar}
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
