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
}: {
  disasters: JSX.Element;
  analytics: JSX.Element;
  toolbar: JSX.Element;
  timeline: JSX.Element;
  layersAndLegends: JSX.Element;
  matrix: JSX.Element;
  drawToolbox: JSX.Element;
  footer: JSX.Element;
  editPanel: JSX.Element;
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
          </>
        }
        mapColumn={
          <>
            {toolbar}
            {timeline}
          </>
        }
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
          </>
        }
        mapColumn={
          <>
            {toolbar}
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
      mapColumn={
        <>
          {toolbar}
          {timeline}
        </>
      }
      layersColumn={
        <>
          {matrix}
          {layersAndLegends}
          {editPanel}
        </>
      }
      footer={footer}
    />
  );
}
