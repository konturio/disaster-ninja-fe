import { LogicalLayerRenderer } from '~core/logical_layers/types/renderer';
import { layersRegistryAtom } from '~core/shared_state';
import { createAtom } from '~utils/atoms';
import { createAsyncWrapper } from '~utils/atoms/createAsyncWrapper';
import { BASEMAP_LAYER_ID } from '../constants';
import { TranslationService as i18n } from '~core/localization';
import { layersSettingsAtom } from '~core/logical_layers/atoms/layersSettings';

export const basemapLayerAtom = createAtom(
  {
    registerRenderer: (id: string, renderer: LogicalLayerRenderer) => {
      return { renderer, id };
    },
    unregisterRenderer: (id: string) => id,
    enableLayer: (layerId: string) => layerId,
  },
  ({ onAction, schedule, getUnlistedState, create }, state = null) => {
    onAction('registerRenderer', ({ renderer, id }) => {
      console.log('%c⧭', 'color: #d0bfff', 'registering');
      schedule((dispatch) =>
        dispatch([
          layersRegistryAtom.register({
            id,
            renderer,
          }),
          // create('enableLayer', id)
          layersSettingsAtom.set(
            BASEMAP_LAYER_ID,
            createAsyncWrapper({
              name: i18n.t(BASEMAP_LAYER_ID),
              id: BASEMAP_LAYER_ID,
              boundaryRequiredForRetrieval: false,
              ownedByUser: false,
              category: 'base',
              group: 'Kontur',
            }),
          ),
          create('enableLayer', id),
        ]),
      );
      // schedule(d => d(create('enableLayer', id)))
    });

    onAction('enableLayer', (id: string) => {
      const currentRegistry = getUnlistedState(layersRegistryAtom);

      console.log(
        '%c⧭ after enabling with registry',
        'color: #7f7700',
        currentRegistry,
      );
      if (currentRegistry.has(id))
        schedule((dispatch) => {
          dispatch(currentRegistry.get(id)!.enable());
        });
    });

    return state;
  },
  'basemapLayerAtom',
);
