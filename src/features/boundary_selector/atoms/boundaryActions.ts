import { action } from '@reatom/framework';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import { focusOnGeometry } from '~core/shared_state/currentMapPosition';
import { store } from '~core/store/store';
import { boundarySelectorToolbarControl } from '../control';
import { fetchBoundariesAsyncResource } from './boundaryResourceAtom';
import { highlightedGeometryAtom } from './highlightedGeometry';
import type { Feature, GeoJsonProperties, Geometry } from 'geojson';

// Create empty geometry constant
const EMPTY_GEOMETRY = new FeatureCollection([]);

export const hoverBoundaryAction = action((ctx, boundaryId: string) => {
  const featureCollection = ctx.get(fetchBoundariesAsyncResource.dataAtom);

  if (!featureCollection) return;

  const boundaryGeometry =
    findBoundaryGeometry(featureCollection, boundaryId) ?? EMPTY_GEOMETRY;

  highlightedGeometryAtom(ctx, boundaryGeometry);
}, 'hoverBoundaryAction');

export const selectBoundaryAction = action((ctx, boundaryId: string) => {
  const featureCollection = ctx.get(fetchBoundariesAsyncResource.dataAtom);

  if (!featureCollection) return;

  const boundaryGeometry =
    findBoundaryGeometry(featureCollection, boundaryId) ?? EMPTY_GEOMETRY;
  const boundaryName = findBoundaryName(boundaryGeometry);

  store.dispatch([
    boundarySelectorToolbarControl.setState('regular'),
    focusedGeometryAtom.setFocusedGeometry(
      {
        type: 'boundaries',
        meta: { name: boundaryName || 'Boundary geometry' },
      },
      boundaryGeometry,
    ),
  ]);

  focusOnGeometry(ctx, boundaryGeometry);
  highlightedGeometryAtom(ctx, EMPTY_GEOMETRY);
}, 'selectBoundaryAction');

function findBoundaryName(
  featureCollection: FeatureCollection | Feature<Geometry, GeoJsonProperties>,
) {
  return (
    'properties' in featureCollection && (featureCollection.properties?.name as string)
  );
}

function findBoundaryGeometry(featureCollection: FeatureCollection, boundaryId: string) {
  return featureCollection.features.find((boundary) => boundary.id === boundaryId);
}
