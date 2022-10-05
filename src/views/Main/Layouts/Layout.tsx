import {
  IS_LAPTOP_QUERY,
  IS_MOBILE_QUERY,
  useMediaQuery,
} from '~utils/hooks/useMediaQuery';
import { DesktopLayout } from './Desktop/Desktop';
import { LaptopLayout as LaptopAndMobileLayout } from './Laptop/Laptop';
import { MobileLayout } from './Mobile/Mobile';

export function Layout({
  disasters,
  analytics,
  advancedAnalytics,
  toolbar,
  timeline,
  layers,
  legend,
  matrix,
  drawToolbox,
  footer,
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
            {advancedAnalytics}
            {legend}
            {layers}
            {matrix}
          </>
        }
        mapColumn={
          <>
            {toolbar}
            {timeline}
          </>
        }
        drawToolbox={drawToolbox}
        footer={footer}
      />
    );

  if (isLaptop)
    return (
      <LaptopAndMobileLayout
        firstColumn={
          <>
            {analytics}
            {disasters}
            {advancedAnalytics}
            {legend}
            {layers}
            {matrix}
          </>
        }
        mapColumn={
          <>
            {toolbar}
            {drawToolbox}
            {timeline}
          </>
        }
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
      advancedAnalyticsColumn={advancedAnalytics}
      mapColumn={
        <>
          {toolbar}
          {drawToolbox}
          {timeline}
        </>
      }
      layersColumn={
        <>
          {legend}
          {layers}
        </>
      }
      footer={footer}
    />
  );
}
