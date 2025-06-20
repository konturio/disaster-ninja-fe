import { useEffect, useRef } from 'react';
import { Selector } from '@konturio/ui-kit';
import { useAtom, useAction } from '@reatom/npm-react';
import { i18n } from '~core/localization';
import { constructOptionsFromBoundaries } from '~utils/map/boundaries';
import { ProviderPriority } from '~core/map/types';
import { clickCoordinatesAtom } from '../atoms/clickCoordinatesAtom';
import { fetchBoundariesAsyncResource } from '../atoms/boundaryResourceAtom';
import { hoverBoundaryAction, selectBoundaryAction } from '../atoms/boundaryActions';
import { highlightedGeometryAtom } from '../atoms/highlightedGeometry';
import type {
  IMapPopoverContentProvider,
  IMapPopoverProviderContext,
  GeographicPoint,
} from '~core/map/types';

export const boundarySelectorContentProvider: IMapPopoverContentProvider = {
  priority: ProviderPriority.HIGH,
  isExclusive: true,
  toolId: 'boundary-selector',

  renderContent(context: IMapPopoverProviderContext) {
    return (
      <BoundarySelector
        onClose={context.onClose}
        mapCoordinates={context.mapEvent.lngLat}
      />
    );
  },
};

function BoundarySelector({
  onClose,
  mapCoordinates,
}: {
  onClose: () => void;
  mapCoordinates: GeographicPoint;
}) {
  const [data] = useAtom(fetchBoundariesAsyncResource.dataAtom);
  const [loading] = useAtom(fetchBoundariesAsyncResource.pendingAtom);
  const selectBoundary = useAction(selectBoundaryAction);
  const hoverBoundary = useAction(hoverBoundaryAction);
  const setClickCoordinates = useAction(clickCoordinatesAtom);
  const setHighlightedGeometry = useAction(highlightedGeometryAtom);

  const previousCoordinates = useRef<{ lng: number; lat: number } | null>(null);

  useEffect(() => {
    if (mapCoordinates) {
      const currentLng = mapCoordinates.lng;
      const currentLat = mapCoordinates.lat;

      // Only update if coordinates have actually changed their numerical value
      if (
        previousCoordinates.current?.lng !== currentLng ||
        previousCoordinates.current?.lat !== currentLat
      ) {
        setClickCoordinates(mapCoordinates);
        previousCoordinates.current = { lng: currentLng, lat: currentLat };
      }
    }
  }, [mapCoordinates, setClickCoordinates]);

  useEffect(() => {
    return () => {
      setHighlightedGeometry({
        type: 'FeatureCollection',
        features: [],
      });
    };
  }, []);

  if (loading > 0) {
    return <div className="loading-message">{i18n.t('loading')}</div>;
  }

  if (!data) {
    return <div className="error-message">{i18n.t('no_data_received')}</div>;
  }

  // Process boundary options
  const options = constructOptionsFromBoundaries(data);

  if (options.length === 0) {
    return <div className="error-message">{i18n.t('no_data_received')}</div>;
  }

  return (
    <Selector
      options={options.map((option) => ({ ...option, value: String(option.value) }))}
      stopPropagation={true}
      onChange={(boundaryId: string) => {
        selectBoundary(boundaryId);
        onClose();
      }}
      onHover={(boundaryId: string) => {
        hoverBoundary(boundaryId);
      }}
    />
  );
}
