import { Selector } from '@konturio/ui-kit';
import { useAtom, useAction } from '@reatom/npm-react';
import { i18n } from '~core/localization';
import { store } from '~core/store/store';
import { constructOptionsFromBoundaries } from '~utils/map/boundaries';
import { clickCoordinatesAtom } from '../atoms/clickCoordinatesAtom';
import { fetchBoundariesAsyncResource } from '../atoms/boundaryResourceAtom';
import { hoverBoundaryAction, selectBoundaryAction } from '../atoms/boundaryActions';
import type { IMapPopoverContentProvider } from '~core/map/types';

// Content provider that sets coordinates and lets existing atom flow handle the rest
export const boundarySelectorContentProvider: IMapPopoverContentProvider = {
  renderContent(mapEvent, onClose: () => void) {
    clickCoordinatesAtom(store.v3ctx, mapEvent.lngLat);
    return <BoundarySelector onClose={onClose} />;
  },
};

function BoundarySelector({ onClose }) {
  const [data] = useAtom(fetchBoundariesAsyncResource.dataAtom);
  const [loading] = useAtom(fetchBoundariesAsyncResource.pendingAtom);
  const selectBoundary = useAction(selectBoundaryAction);
  const hoverBoundary = useAction(hoverBoundaryAction);

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
