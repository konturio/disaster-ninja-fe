import { BreadcrumbsPanel } from '~features/breadcrumbs/BreadcrumbsPanel';
import { MapTitle } from '~components/MapTitle/MapTitle';
import { LayersCopyrights } from '~components/LayersCopyrights/LayersCopyrights';
import { CurrentEvent } from '~views/Map/Layouts/Presentation/CurrentEvent';
import { configRepo } from '~core/config';
import { AppFeature } from '~core/app/types';
import { PanelContent } from '~features/legend_panel/components/PanelContent/PanelContent';
import { useLayersCopyrights } from '~core/logical_layers/utils/useLayersCopyrights';
import s from './Presentation.module.css';
import type { ReactNode } from 'react';

const featureFlags = configRepo.get().features;

export function PresentationLayout({ scaleAndLogo }: { scaleAndLogo?: ReactNode }) {
  const copyrights = useLayersCopyrights();

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
        {featureFlags[AppFeature.LEGEND_PANEL] && (
          <div className="knt-panel">
            <PanelContent />
          </div>
        )}
      </div>
      <div className={s.copyrights}>
        {featureFlags[AppFeature.LAYERS_COPYRIGHTS] && (
          <LayersCopyrights copyrights={copyrights} />
        )}
      </div>
      <div className={s.scaleAndLogo}>{scaleAndLogo}</div>
    </div>
  );
}
