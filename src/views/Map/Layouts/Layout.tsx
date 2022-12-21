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
  drawToolbox,
  footer,
  editPanel,
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
        drawToolbox={drawToolbox}
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
      mapColumn={
        <>
          {toolbar}
          {drawToolbox}
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
