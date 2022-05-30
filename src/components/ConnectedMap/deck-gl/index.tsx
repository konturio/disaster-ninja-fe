import { useEffect, useState, useRef } from 'react';
import { MapboxLayer } from '@deck.gl/mapbox';

interface RenderProps {
  layers?: MapboxLayer<unknown>[];
}

export type Layer = {
  [key: string]: unknown;
  id: string;
};

interface DeckGlComponent {
  layers?: Layer[];
  children: (props: RenderProps) => React.ReactElement;
}

export default function DeckGlComponent({ children, layers }: DeckGlComponent) {
  const [mapBoxLayers, setMapBoxLayers] = useState<MapboxLayer<unknown>[]>();

  // MapboxLayer adapter remove deckGl layer when mapBox remove layer
  // MapboxLayer adapter sync viewState of deck gl and viewState of mapBox

  const adapters = useRef({});
  useEffect(() => {
    if (Array.isArray(layers)) {
      /* Drop unused adapters */
      const currentIds = layers.map((x) => x.id);
      adapters.current = Object.keys(adapters.current).reduce(
        (adapters, id) => {
          if (!currentIds.includes(id)) {
            delete adapters[id];
          }
          return adapters;
        },
        adapters.current,
      );

      for (const l of layers.filter((n) => n !== undefined)) {
        /* Create new adapters if needed */
        const adapter =
          adapters.current[l.id] ||
          (adapters.current[l.id] = new MapboxLayer(l));
        const { data, mode, selectedFeatureIndexes, modeConfig } = l;
        /**
         * !  -> If you looking why layer props not change - check this first <- !
         */
        /* Finally update props */
        adapter.setProps({ data, mode, selectedFeatureIndexes, modeConfig });
      }

      /* Push to map SAME (it's important!) adapters (aka layers) after props updated */
      setMapBoxLayers(Object.values(adapters.current));
    } else {
      setMapBoxLayers([]);
    }
  }, [layers]);

  return children({ layers: mapBoxLayers });
}
