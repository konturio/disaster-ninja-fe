import { BreadcrumbsPanel } from '~features/breadcrumbs/BreadcrumbsPanel';
import { MapTitle } from '~features/presentation_mode/MapTitle/MapTitle';
import { LayersCopyrights } from '~components/LayersCopyrights/LayersCopyrights';
import { LegendsPanel } from '~features/presentation_mode/LegendsPanel/LegendsPanel';
import { CurrentEvent } from '~components/CurrentEvent/CurrentEvent';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import s from './Presentation.module.css';
import type { ReactNode } from 'react';

const featureFlags = configRepo.get().features;

export function PresentationLayout({ scaleAndLogo }: { scaleAndLogo?: ReactNode }) {
  return (
    <div className={s.container}>
      <div className={s.headerRow}>
        <div className={s.breadcrumbs}>
          {featureFlags[AppFeature.ADMIN_BOUNDARY_BREADCRUMBS] && <BreadcrumbsPanel />}
        </div>
        <div className={s.title}>
          {featureFlags[AppFeature.MAP_TITLE] && <MapTitle />}
        </div>
      </div>
      <div className={s.sidePanel}>
        {featureFlags[AppFeature.CURRENT_EVENT] && <CurrentEvent />}
        {featureFlags[AppFeature.LEGEND_PANEL] && <LegendsPanel />}
      </div>
      <div className={s.copyrights}>
        {featureFlags[AppFeature.LAYERS_COPYRIGHTS] && <LayersCopyrights />}
      </div>
      <div className={s.scaleAndLogo}>{scaleAndLogo}</div>
    </div>
  );
}
