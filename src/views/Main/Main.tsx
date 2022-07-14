import { Suspense, useEffect, useRef } from 'react';
import { lazily } from 'react-lazily';
import { useHistory } from 'react-router';
import { useAtom } from '@reatom/react';
import { Row } from '~components/Layout/Layout';
import config from '~core/app_config';
import { userResourceAtom } from '~core/auth/atoms/userResource';
import { VisibleLogo } from '~components/KonturLogo/KonturLogo';
import { DrawToolsToolbox } from '~core/draw_tools/components/DrawToolsToolbox/DrawToolsToolbox';
import { AppFeature } from '~core/auth/types';
import { initUrlStore } from '~core/url_store';
import {
  useAppFeature,
  useFeatureInitializer,
} from '~utils/hooks/useAppFeature';
import s from './Main.module.css';

const { Logo } = lazily(() => import('@konturio/ui-kit'));

const { ConnectedMap } = lazily(
  () => import('~components/ConnectedMap/ConnectedMap'),
);

export function MainView() {
  const history = useHistory();
  const [{ data: userModel }] = useAtom(userResourceAtom);
  const iconsContainerRef = useRef<HTMLDivElement | null>(null);

  // Load features
  const loadFeature = useFeatureInitializer(userModel);
  const popupTooltip = useAppFeature(
    loadFeature(AppFeature.TOOLTIP, import('~features/tooltip')),
  );
  const userProfile = useAppFeature(
    loadFeature(AppFeature.APP_LOGIN, import('~features/user_profile')),
  );
  const appHeader = useAppFeature(
    loadFeature(AppFeature.APP_LOGIN, import('~features/app_header')),
    { logo: VisibleLogo(), title: 'Disaster Ninja', content: userProfile },
    [],
    userProfile,
  );

  const sideBar = useAppFeature(
    loadFeature(AppFeature.SIDE_BAR, import('~features/side_bar')),
  );

  const eventList = useAppFeature(
    loadFeature(AppFeature.EVENTS_LIST, import('~features/events_list')),
  );

  const notificationToast = useAppFeature(
    loadFeature(AppFeature.TOASTS, import('~features/toasts')),
  );

  const analyticsPanel = useAppFeature(
    loadFeature(
      AppFeature.ANALYTICS_PANEL,
      import('~features/analytics_panel'),
    ),
  );

  const advancedAnalyticsPanel = useAppFeature(
    loadFeature(
      AppFeature.ADVANCED_ANALYTICS_PANEL,
      import('~features/advanced_analytics_panel'),
    ),
  );

  const mapLayersPanel = useAppFeature(
    loadFeature(AppFeature.MAP_LAYERS_PANEL, import('~features/layers_panel')),
    { iconsContainerRef },
  );

  const legend = useAppFeature(
    loadFeature(AppFeature.LEGEND_PANEL, import('~features/legend_panel')),
    { iconsContainerRef },
  );

  const bivariatePanel = useAppFeature(
    loadFeature(
      AppFeature.BIVARIATE_MANAGER,
      import('~features/bivariate_manager/components'),
    ),
    { iconsContainerRef },
  );

  const editFeaturesOrLayerPanel = useAppFeature(
    loadFeature(AppFeature.CREATE_LAYER, import('~features/create_layer')),
    { iconsContainerRef },
  );
  // features initialized without component
  useAppFeature(
    loadFeature(AppFeature.REPORTS, import('~features/reports')),
    {},
    [history],
  );

  useAppFeature(
    loadFeature(AppFeature.CURRENT_EVENT, import('~features/current_event')),
  );

  useAppFeature(
    loadFeature(
      AppFeature.GEOMETRY_UPLOADER,
      import('~features/geometry_uploader'),
    ),
  );

  useAppFeature(
    loadFeature(AppFeature.MAP_RULER, import('~features/map_ruler')),
  );

  useAppFeature(
    loadFeature(
      AppFeature.BOUNDARY_SELECTOR,
      import('~features/boundary_selector'),
    ),
  );

  useAppFeature(
    loadFeature(AppFeature.LAYERS_IN_AREA, import('~features/layers_in_area')),
  );

  useAppFeature(
    loadFeature(
      AppFeature.FOCUSED_GEOMETRY_LAYER,
      import('~features/focused_geometry_layer'),
    ),
  );

  useAppFeature(
    loadFeature(AppFeature.OSM_EDIT_LINK, import('~features/osm_edit_link')),
  );

  useAppFeature(
    loadFeature(
      AppFeature.FOCUSED_GEOMETRY_EDITOR,
      import('~features/focused_geometry_editor'),
    ),
  );

  useAppFeature(loadFeature(AppFeature.INTERCOM, import('~features/intercom')));

  useEffect(() => {
    initUrlStore();

    import('~core/draw_tools').then(({ initDrawTools }) => initDrawTools());
  }, [userModel]);

  return (
    <>
      <Suspense fallback={null}>
        {userModel?.hasFeature(AppFeature.TOOLTIP) && popupTooltip}
      </Suspense>

      <Suspense fallback={null}>{appHeader}</Suspense>
      <Row>
        <Suspense fallback={null}>
          {notificationToast}
          {sideBar}
          {userModel?.feeds && eventList}
          {analyticsPanel}
          {advancedAnalyticsPanel}
        </Suspense>
        <div className={s.root} style={{ flex: 1, position: 'relative' }}>
          <Suspense fallback={null}>
            <ConnectedMap
              options={{
                logoPosition: 'top-right',
              }}
              style={config.mapBaseStyle || ''}
              accessToken={config.mapAccessToken || ''}
              className={s.Map}
            />
          </Suspense>
          <div className={s.logo}>
            <Logo height={24} palette={'contrast'} />
          </div>
          <Suspense fallback={null}>
            <div className={s.floating}>
              <div
                className={s.rightButtonsContainer}
                ref={iconsContainerRef}
              ></div>
              {legend}
              {editFeaturesOrLayerPanel}
              {mapLayersPanel}
              {bivariatePanel}
            </div>
          </Suspense>
          <DrawToolsToolbox />
        </div>
      </Row>
    </>
  );
}
