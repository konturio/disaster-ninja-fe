import { boundarySelectorControl } from './control';
import './atoms/boundaryMarkerAtom';
import './atoms/boundaryRegistryAtom';

export async function initBoundarySelector() {
  boundarySelectorControl.init();
}
