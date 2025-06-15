import { action } from '@reatom/framework';
import { focusedGeometryAtom } from '~core/focused_geometry/model';
import { FeatureCollection } from '~utils/geoJSON/helpers';
import { focusOnGeometry } from '~core/shared_state/currentMapPosition';
import { store } from '~core/store/store';
import { getLocalizedFeatureName, boundarySelector } from '~utils/map/boundaries';
import { configRepo } from '~core/config';
import { boundarySelectorToolbarControl } from '../control';
import { fetchBoundariesAsyncResource } from './boundaryResourceAtom';
import { highlightedGeometryAtom } from './highlightedGeometry';

const EMPTY_GEOMETRY = new FeatureCollection([]);

export const hoverBoundaryAction = action((ctx, boundaryId: string) => {
  const featureCollection = ctx.get(fetchBoundariesAsyncResource.dataAtom);

  if (!featureCollection) return;

  const boundaryGeometry =
    boundarySelector(featureCollection)(boundaryId) ?? EMPTY_GEOMETRY;

  highlightedGeometryAtom(ctx, boundaryGeometry);
}, 'hoverBoundaryAction');

export const selectBoundaryAction = action((ctx, boundaryId: string) => {
  const featureCollection = ctx.get(fetchBoundariesAsyncResource.dataAtom);

  if (!featureCollection) return;

  const boundaryGeometryFc =
    boundarySelector(featureCollection)(boundaryId) ?? EMPTY_GEOMETRY;
  let boundaryName: string | undefined;
  if (boundaryGeometryFc.features.length > 0) {
    const boundaryFeature = boundaryGeometryFc.features[0];
    const preferredLanguage =
      configRepo.get().user?.language || configRepo.get().defaultLanguage;
    boundaryName = getLocalizedFeatureName(boundaryFeature, preferredLanguage);
  }

  store.dispatch([
    boundarySelectorToolbarControl.setState('regular'),
    focusedGeometryAtom.setFocusedGeometry(
      {
        type: 'boundaries',
        meta: { name: boundaryName || 'Boundary geometry' },
      },
      boundaryGeometryFc,
    ),
  ]);

  focusOnGeometry(ctx, boundaryGeometryFc);
  highlightedGeometryAtom(ctx, EMPTY_GEOMETRY);
}, 'selectBoundaryAction');
