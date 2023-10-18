import { useMemo } from 'react';
import { useAtom } from '@reatom/react';
import { store } from '~core/store/store';
import { i18n } from '~core/localization';
import { forceRun } from '~utils/atoms/forceRun';
import { combinedAtom } from './atoms/combinedAtom';
import { drawModeLogicalLayerAtom, drawModeRenderer } from './atoms/logicalLayerAtom';
import { activeDrawModeAtom } from './atoms/activeDrawMode';
import { drawModes } from './constants';
import { setIndexesForCurrentGeometryAtom } from './atoms/selectedIndexesAtom';
import { drawnGeometryAtom } from './atoms/drawnGeometryAtom';
import { convertToFeatures } from './convertToFeatures';
import { toolboxAtom } from './atoms/toolboxAtom';
import type { DrawToolController, DrawToolsController, DrawToolsHook } from './types';
// a little scratch about new and previous structure https://www.figma.com/file/G8VQQ3mctz5gPkcZZvbzCl/Untitled?node-id=0%3A1
// newest structure: https://www.figma.com/file/FcyFYb406D8zGFWxyK4zIk/Untitled?node-id=0%3A1

class DrawToolsControllerImpl implements DrawToolsController {
  isActivated = false;
  private editPromise: null | {
    resolve: (geometry: GeoJSON.FeatureCollection) => void;
    reject: (err: Error) => void;
  } = null;
  init() {
    drawModeRenderer.setupExtension(combinedAtom);
  }

  dissolve() {
    throw Error('Not implemented');
  }

  async edit(
    geometry: GeoJSON.FeatureCollection | GeoJSON.Feature,
  ): Promise<GeoJSON.FeatureCollection> {
    const geometryFeatures = convertToFeatures(geometry);
    forceRun(combinedAtom); // TODO is this really needed?
    store.dispatch([
      // Enable layer for draw tools
      drawModeLogicalLayerAtom.enable(),
      // Setup initial draw mode
      activeDrawModeAtom.setDrawMode(drawModes.ModifyMode),
      // Some hack, idk what is it
      setIndexesForCurrentGeometryAtom.set(true),
      // Set features to editor
      drawnGeometryAtom.setFeatures(geometryFeatures),
      // Set Toolbar settings
      toolboxAtom.setSettings({
        availableModes: ['DrawPointMode', 'ModifyMode'],
        finishButtonCallback: () => {
          this.editPromise?.resolve(this.geometry);
          return Promise.resolve(true); // TODO - fix finishButtonCallback type
        },
      }),
    ]);
    return new Promise((resolve, reject) => {
      this.editPromise = {
        resolve,
        reject,
      };
    });
  }

  exit() {
    store.dispatch([
      drawModeLogicalLayerAtom.disable(),
      activeDrawModeAtom.setDrawMode(null),
      drawnGeometryAtom.setFeatures([]),
    ]);
    if (this.editPromise) this.editPromise.reject(Error('Force exit'));
  }

  get geometry(): GeoJSON.FeatureCollection {
    return store.getState(drawnGeometryAtom);
  }
}

export const useDrawTools: DrawToolsHook = () => {
  const [
    { mode: activeDrawMode, selectedIndexes, settings },
    { deleteFeatures, toggleDrawMode, finishDrawing, downloadDrawGeometry },
  ] = useAtom(toolboxAtom);

  const controls = useMemo(() => {
    const controlsArray: Array<DrawToolController> =
      settings.availableModes?.map((mode) => ({
        name: i18n.t('draw_tools.area'),
        hint: '',
        icon: 'Area24',
        state: activeDrawMode === mode ? ('active' as const) : ('regular' as const),
        action: () => toggleDrawMode(drawModes[mode]),
      })) ?? [];

    controlsArray.push({
      name: '',
      hint: '',
      icon: 'Trash24',
      state: selectedIndexes.length > 0 ? ('regular' as const) : ('disabled' as const),
      action: deleteFeatures,
    });

    controlsArray.push({
      name: '',
      hint: '',
      icon: 'Download24',
      state: 'regular' as const,
      action: downloadDrawGeometry,
    });

    return controlsArray;
  }, [
    settings,
    activeDrawMode,
    selectedIndexes,
    toggleDrawMode,
    deleteFeatures,
    downloadDrawGeometry,
  ]);

  return [controls, finishDrawing];
};

export const drawTools: DrawToolsController = new DrawToolsControllerImpl();
