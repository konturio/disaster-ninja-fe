import { Suspense, useEffect } from 'react';
import { useAtom } from '@reatom/react';
import { lazily } from 'react-lazily';
import clsx from 'clsx';
import { DrawToolsToolbox } from '~core/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox';
import { AppFeature } from '~core/auth/types';
import { legendPanel } from '~features/legend_panel';
import { layersPanel } from '~features/layers_panel';
import { userResourceAtom } from '~core/auth/atoms/userResource';
import { PrimaryAndSecondaryPanelWidget } from '~widgets/PrimaryAndSecondaryPanel';
import { analyticsPanel } from '~features/analytics_panel';
import { advancedAnalyticsPanel } from '~features/advanced_analytics_panel';
import s from './Map.module.css';
import { Layout } from './Layouts/Layout';

const { EditFeaturesOrLayerPanel } = lazily(
  () =>
    import(
      '~features/create_layer/components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel'
    ),
);

const { Logo } = lazily(() => import('@konturio/ui-kit'));

const { ConnectedMap } = lazily(() => import('~components/ConnectedMap/ConnectedMap'));

const { EventList: EventListPanel } = lazily(() => import('~features/events_list'));

const { Toolbar } = lazily(() => import('~features/toolbar'));

const { BivariatePanel } = lazily(() => import('~features/bivariate_manager/components'));

const { EventEpisodes } = lazily(() => import('~features/event_episodes'));

export function MapPage() {
  const [{ data, loading }] = useAtom(userResourceAtom);
  const userModel = data && !loading ? data : null;

  useEffect(() => {
    import('~core/draw_tools').then(({ initDrawTools }) => initDrawTools());

    /* Lazy load module */
    if (userModel?.hasFeature(AppFeature.CURRENT_EVENT)) {
      import('~features/current_event').then(({ initCurrentEvent }) =>
        initCurrentEvent(),
      );
    }
    if (userModel?.hasFeature(AppFeature.GEOMETRY_UPLOADER)) {
      import('~features/geometry_uploader').then(({ initFileUploader }) =>
        initFileUploader(),
      );
    }
    if (userModel?.hasFeature(AppFeature.MAP_RULER)) {
      import('~features/map_ruler').then(({ initMapRuler }) => initMapRuler());
    }
    if (userModel?.hasFeature(AppFeature.BOUNDARY_SELECTOR)) {
      import('~features/boundary_selector').then(({ initBoundarySelector }) =>
        initBoundarySelector(),
      );
    }
    if (userModel?.hasFeature(AppFeature.LAYERS_IN_AREA)) {
      import('~features/layers_in_area').then(({ initLayersInArea }) =>
        initLayersInArea(),
      );
    }
    if (userModel?.hasFeature(AppFeature.FOCUSED_GEOMETRY_LAYER)) {
      import('~features/focused_geometry_layer').then(({ initFocusedGeometryLayer }) =>
        initFocusedGeometryLayer(),
      );
    }

    if (userModel?.hasFeature(AppFeature.OSM_EDIT_LINK)) {
      import('~features/osm_edit_link/').then(({ initOsmEditLink }) => initOsmEditLink());
    }
    // TODO add feature flag to replace 'draw_tools' to 'focused_geometry_editor'
    if (
      userModel?.hasFeature(AppFeature.DRAW_TOOLS) ||
      userModel?.hasFeature(AppFeature.FOCUSED_GEOMETRY_EDITOR)
    ) {
      import('~features/focused_geometry_editor/').then(({ initFocusedGeometry }) =>
        initFocusedGeometry(),
      );
    }
    if (userModel?.hasFeature(AppFeature.CREATE_LAYER)) {
      import('~features/create_layer/').then(({ initEditableLayer }) =>
        initEditableLayer(),
      );
    }
    if (userModel?.hasFeature(AppFeature.LOCATE_ME)) {
      import('~features/locate_me').then(({ initLocateMe }) => {
        initLocateMe();
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userModel]);

  return (
    <div className={s.mainView}>
      <div className={s.mapWrap}>
        <Suspense fallback={null}>
          <ConnectedMap className={s.Map} />
        </Suspense>
      </div>
      {userModel && (
        <Layout
          analytics={
            <PrimaryAndSecondaryPanelWidget
              primaryProps={
                userModel?.hasFeature(AppFeature.ANALYTICS_PANEL) ? analyticsPanel : null
              }
              secondaryProps={
                userModel?.hasFeature(AppFeature.ADVANCED_ANALYTICS_PANEL)
                  ? advancedAnalyticsPanel
                  : null
              }
              key="analytics"
              id="analytics"
            />
          }
          disasters={
            userModel?.hasFeature(AppFeature.EVENTS_LIST) &&
            userModel?.feeds && <EventListPanel />
          }
          layersAndLegends={
            <PrimaryAndSecondaryPanelWidget
              primaryProps={
                userModel?.hasFeature(AppFeature.MAP_LAYERS_PANEL) ? layersPanel : null
              }
              secondaryProps={
                userModel?.hasFeature(AppFeature.LEGEND_PANEL) ? legendPanel : null
              }
              key="layers_and_legends"
              id="layers_and_legends"
            />
          }
          matrix={
            userModel?.hasFeature(AppFeature.BIVARIATE_MANAGER) && <BivariatePanel />
          }
          timeline={
            userModel?.hasFeature(AppFeature.EPISODES_TIMELINE) && <EventEpisodes />
          }
          toolbar={<Toolbar />}
          footer={
            <div className={clsx(s.footer, s.clickThrough)}>
              <div className={s.logo}>
                <Logo height={24} palette="contrast" />
              </div>
            </div>
          }
          editPanel={<EditFeaturesOrLayerPanel />}
          drawToolbox={<DrawToolsToolbox />}
        />
      )}
    </div>
  );
}
