import { Selector } from '@konturio/ui-kit';
import { useAtom } from '@reatom/react-v2';
import { configRepo } from '~core/config';
import { i18n } from '~core/localization';
import { boundarySelectorToolbarControl } from '../control';
import { clickCoordinatesAtom } from '../atoms/clickCoordinatesAtom';
import { boundaryMarkerAtom } from '../atoms/boundaryMarkerAtom';
import type React from 'react';
import type { IMapPopoverContentProvider } from '~core/map/types';
import type { MapMouseEvent } from 'maplibre-gl';

// Content provider that sets coordinates and lets existing atom flow handle the rest
export const boundarySelectorContentProvider: IMapPopoverContentProvider = {
  renderContent(mapEvent: MapMouseEvent): React.ReactNode | null {
    clickCoordinatesAtom.set.dispatch(mapEvent.lngLat);
    return <BoundarySelector />;
  },
};

function BoundarySelector() {
  const [boundarySelectorAtom, {}] = useAtom(boundaryMarkerAtom);

  if (!boundarySelectorAtom.content) {
    return null;
  }

  const { uiState, options } = boundarySelectorAtom.content;

  switch (uiState) {
    case 'loading':
      return <div className="loading-message">{i18n.t('loading')}</div>;

    case 'no-data':
      return <div className="error-message">{i18n.t('no_data_received')}</div>;

    case 'ready':
      return options && options.length > 0 ? (
        <Selector
          // small={true}
          options={options.map((option) => ({ ...option, value: String(option.value) }))}
          stopPropagation={true}
          onChange={(boundaryId: string) => {
            boundaryMarkerAtom.selectBoundary.dispatch(boundaryId);
          }}
          onHover={(boundaryId: string) => {
            boundaryMarkerAtom.hoverBoundary.dispatch(boundaryId);
          }}
        />
      ) : (
        <div className="error-message">{i18n.t('no_data_received')}</div>
      );

    default:
      return null;
  }
}
