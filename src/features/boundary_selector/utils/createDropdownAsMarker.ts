import { convertToAppMarker } from '~utils/map/markers';
import { BOUNDARY_MARKER_ID } from '../constants';
import { getSelectorWithOptions } from '../components/getSelectorWithOptions';
import s from './styles.module.css';
import type { BoundaryOption } from '~utils/map/boundaries';

export function createDropdownAsMarker(
  coordinates: {
    lat: number;
    lng: number;
  },
  selectOptions: BoundaryOption[],
  listeners?: {
    onSelect?: (boundaryId: string) => void;
    onHover?: (boundaryId: string) => void;
  },
) {
  const DropDownComponent = getSelectorWithOptions(
    selectOptions,
    // onOptionSelect:
    (boundaryId: string) => {
      listeners?.onSelect?.(boundaryId);
    },
    // onOptionHover:
    (boundaryId: string) => {
      listeners?.onHover?.(boundaryId);
    },
  );

  const marker = convertToAppMarker(BOUNDARY_MARKER_ID, {
    coordinates: [coordinates.lng, coordinates.lat],
    el: DropDownComponent,
    id: BOUNDARY_MARKER_ID,
    wrapperClass: s.boundariesMarker,
  });

  return marker;
}
