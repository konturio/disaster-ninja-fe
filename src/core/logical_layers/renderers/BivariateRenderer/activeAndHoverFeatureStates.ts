import { haveValue } from '~utils/common';
import { isFeatureVisible } from './featureVisibilityCheck';
import type { FEATURE_STATES } from './constants';

type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
function featureHaveId<T extends { id?: string | number }>(
  feature: T,
): feature is WithRequired<T, 'id'> {
  return haveValue(feature.id);
}

function filterFeatures(
  sourceId: string,
  ev: maplibregl.MapMouseEvent & maplibregl.EventData,
) {
  return (
    ev.target
      .queryRenderedFeatures(ev.point)
      /* Filter out features not from this logical layer */
      .filter((f) => f.source.includes(sourceId))
      // Filter out invisible (transparent) features
      .filter(isFeatureVisible)
      // Feature id required for feature state work
      .filter(featureHaveId)
  );
}

export function createFeatureStateHandlers(ctx: {
  map: maplibregl.Map;
  sourceId: string;
  sourceLayer: string;
}) {
  const activeFeatures = new Set<string | number>();
  const hoveredFeatures = new Set<string | number>();
  const setFeatureState = (
    featureId: string | number,
    newState: Partial<Record<keyof typeof FEATURE_STATES, boolean>>,
  ) => {
    ctx.map.setFeatureState(
      { source: ctx.sourceId, id: featureId, sourceLayer: ctx.sourceLayer },
      newState,
    );
  };

  /* Handler */
  return {
    onClick: (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      /* Remove active feature state from previous features */
      activeFeatures.forEach((featureId) => {
        setFeatureState(featureId, { active: false });
      });
      activeFeatures.clear();

      const features = filterFeatures(ctx.sourceId, ev);

      // Exit when no features in target point
      if (!features.length) {
        return true; // pass to next listener
      }

      /* Change features state to active */
      features.forEach((feature) => {
        setFeatureState(feature.id, { active: true });
        activeFeatures.add(feature.id);
      });

      return true;
    },
    onMouseMove: (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      /* Remove hover feature state from previous features */
      hoveredFeatures.forEach((featureId) => {
        setFeatureState(featureId, { hover: false });
      });
      hoveredFeatures.clear();

      const features = filterFeatures(ctx.sourceId, ev);

      // Exit when no features in target point
      if (!features.length) {
        return true; // pass to next listener
      }

      /* Change features state to active */
      features.forEach((feature) => {
        setFeatureState(feature.id, { hover: true });
        hoveredFeatures.add(feature.id);
      });

      return true;
    },
    onMouseLeave: (ev: maplibregl.MapMouseEvent & maplibregl.EventData) => {
      // Reset previous hover
      hoveredFeatures.forEach((featureId) => {
        setFeatureState(featureId, { hover: false });
      });
      hoveredFeatures.clear();
      return true;
    },
    reset: () => {
      activeFeatures.forEach((featureId) => {
        setFeatureState(featureId, { active: false });
      });
      activeFeatures.clear();
      hoveredFeatures.forEach((featureId) => {
        setFeatureState(featureId, { hover: false });
      });
      hoveredFeatures.clear();
    },
  };
}
