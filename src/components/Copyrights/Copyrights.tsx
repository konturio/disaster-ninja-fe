import { useAtom } from '@reatom/react-v2';
import cn from 'clsx';
import { useEffect, useState } from 'react';
import { currentMapAtom } from '~core/shared_state';
import { arraysAreEqual } from '~utils/common/equality';
import s from './Copyrights.module.css';

/**
 * @Akiyamka:
 * Right now we have copyrights baked in basemap style json
 * Because of this I use copyright that map extracts from this style json.
 * When we refactor basemaps to state when they treated as regular layers from layers DB
 * We can just subscribe to sources here and show attribution directly from app state
 */
function collectAttributionsFromMap(map): Array<string> {
  // Map have "customAttribution" setting, but since we not use it I just ignore it
  const attributions = Array<string>();
  /**
   * Next apis not declared in public interfaces
   * Be careful
   * spotted here: https://github.com/maplibre/maplibre-gl-js/blob/3aac7f0a23ac3819443ad9f1090b90af6b9d6d99/src/ui/control/attribution_control.ts
   */
  try {
    const sourceCaches = map.style?.sourceCaches;
    if (sourceCaches) {
      for (const id in sourceCaches) {
        const sourceCache = sourceCaches[id];
        if (sourceCache.used || sourceCache.usedForTerrain) {
          const source = sourceCache.getSource();
          if (source.attribution && attributions.indexOf(source.attribution) < 0) {
            attributions.push(source.attribution);
          }
        }
      }
    } else {
      throw Error('sourceCaches missing in map style');
    }
  } catch (e) {
    console.error('Cannot show attributions', e);
  }
  return attributions;
}

export function Copyrights() {
  const [map] = useAtom(currentMapAtom);
  const [attributions, setAttributions] = useState(Array<string>());
  const [showOnMobile, setShowOnMobile] = useState(false);

  useEffect(() => {
    if (map === null) return;
    const onStyleChange = () => {
      const attributions = collectAttributionsFromMap(map);
      // Should update or not
      setAttributions((curr) => {
        if (arraysAreEqual(curr, attributions)) {
          return curr; // skip update by return same
        }
        return attributions;
      });
    };
    map.on('styledata', onStyleChange);
    onStyleChange();
    return () => {
      map.off('styledata', onStyleChange);
    };
  }, [map]);

  return (
    <div className={cn(s.copyrights, { [s.visible]: showOnMobile })}>
      <button
        onClick={() => setShowOnMobile((curr) => !curr)}
        className={s.attributionBtn}
        type="button"
        title="Toggle attribution"
        aria-label="Toggle attribution"
        aria-pressed="false"
      ></button>
      <div className={cn(s.attributions, { [s.showOnMobile]: showOnMobile })}>
        {attributions.map((attr) => (
          <div key={attr}>{attr}</div>
        ))}
      </div>
    </div>
  );
}
