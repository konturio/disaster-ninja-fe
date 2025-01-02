import { KONTUR_METRICS_DEBUG } from '~utils/debug';

interface MapRenderOptions {
  requiredIdleCount?: number;
  checkInterval?: number;
  timeout?: number;

  requiredTileCount?: number; // Minimum number of loaded tiles
}

interface MapState {
  isMoving: boolean;
  isZooming: boolean;
  internalMoving: boolean;
  internalZooming: boolean;
  tilesLoaded: boolean;
  loadedTilesCount: number;
  requiredTileCount: number;
  renderedTilesCount: number;
}

function getMapState(
  map: maplibregl.Map,
  loadedTiles: Set<unknown>,
  requiredTileCount: number,
): MapState {
  // Count rendered tiles directly from the map's tile cache
  let renderedTilesCount = 0;
  try {
    // In v3, we can check loaded tiles through source caches
    const style = map.getStyle();
    if (style?.sources) {
      Object.entries(style.sources).forEach(([sourceId, source]) => {
        if (source.type === 'vector' || source.type === 'raster') {
          const sourceCache = map.style?.sourceCaches?.[sourceId];
          if (sourceCache) {
            // @ts-ignore - accessing internal property
            const tiles = sourceCache._tiles;
            if (tiles) {
              renderedTilesCount += Object.values(tiles).filter(
                // @ts-ignore - accessing internal property
                (tile: any) => tile.state === 'loaded',
              ).length;
            }
          }
        }
      });
    }
  } catch (e) {
    if (KONTUR_METRICS_DEBUG) {
      console.debug('Failed to get rendered tiles count:', e);
    }
  }

  return {
    isMoving: map.isMoving(),
    isZooming: map.isZooming(),
    internalMoving: map._moving,
    internalZooming: map._zooming,
    tilesLoaded: map.areTilesLoaded(),
    loadedTilesCount: loadedTiles.size,
    requiredTileCount,
    renderedTilesCount,
  };
}

function logMapState(state: MapState): string {
  return `Map state:
  - Moving (public): ${state.isMoving}
  - Zooming (public): ${state.isZooming}
  - Moving (internal): ${state.internalMoving}
  - Zooming (internal): ${state.internalZooming}
  - Tiles loaded: ${state.tilesLoaded}
  - Loaded tiles count: ${state.loadedTilesCount}/${state.requiredTileCount}
  - Rendered tiles count: ${state.renderedTilesCount}`;
}

/**
 * Waits for map to be fully rendered and stable
 */
export function waitForMapFullyRendered(
  map: maplibregl.Map,
  {
    requiredIdleCount = 2,
    checkInterval = 100,
    timeout = 10000,
    requiredTileCount = 1,
  }: MapRenderOptions = {},
): Promise<void> {
  if (!map) {
    return Promise.reject(new Error('Map instance not provided'));
  }

  let timeoutId: number | null = null;
  let checkIntervalId: number | null = null;
  let consecutiveIdleCount = 0;
  const loadedTiles = new Set();

  return new Promise((resolve, reject) => {
    timeoutId = window.setTimeout(() => {
      if (checkIntervalId) clearInterval(checkIntervalId);
      const state = getMapState(map, loadedTiles, requiredTileCount);
      reject(new Error(`Map render timeout after ${timeout}ms\n${logMapState(state)}`));
    }, timeout);

    // Track tile loading
    const tileLoadListener = (e: any) => {
      // In v3, tile events are handled differently
      if (e.sourceId && e.tile && e.tile.tileID) {
        const tileId = `${e.sourceId}:${e.tile.tileID.key}`;
        loadedTiles.add(tileId);
        if (KONTUR_METRICS_DEBUG) {
          console.debug('Tile loaded:', tileId, 'Total:', loadedTiles.size);
        }
      }
    };

    // Track tile removal
    const tileRemoveListener = (e: any) => {
      // In v3, tile events are handled differently
      if (e.sourceId && e.tile && e.tile.tileID) {
        const tileId = `${e.sourceId}:${e.tile.tileID.key}`;
        loadedTiles.delete(tileId);
        if (KONTUR_METRICS_DEBUG) {
          console.debug('Tile removed:', tileId, 'Total:', loadedTiles.size);
        }
      }
    };

    // In v3, we use more specific events for tile loading
    map.on('sourcedataloading', tileLoadListener);
    map.on('sourcedata', tileRemoveListener);

    const checkMapState = () => {
      const state = getMapState(map, loadedTiles, requiredTileCount);
      const isIdle =
        !state.internalMoving &&
        !state.internalZooming &&
        !state.isMoving &&
        !state.isZooming &&
        state.tilesLoaded &&
        (state.loadedTilesCount >= requiredTileCount ||
          state.renderedTilesCount >= requiredTileCount);

      if (isIdle) {
        consecutiveIdleCount++;
        if (consecutiveIdleCount >= requiredIdleCount) {
          if (timeoutId) clearTimeout(timeoutId);
          if (checkIntervalId) clearInterval(checkIntervalId);
          map.off('sourcedataloading', tileLoadListener);
          map.off('sourcedata', tileRemoveListener);
          resolve();
        }
      } else {
        if (consecutiveIdleCount > 0 && KONTUR_METRICS_DEBUG) {
          console.debug(`Map not ready yet:\n${logMapState(state)}`);
        }
        consecutiveIdleCount = 0;
      }
    };

    checkIntervalId = window.setInterval(checkMapState, checkInterval);
    checkMapState();
  });
}
