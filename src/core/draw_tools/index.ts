import { useMemo, useEffect } from 'react';
import { useAtom } from '@reatom/react-v2';
import { store } from '~core/store/store';
import { i18n } from '~core/localization';
import { forceRun } from '~utils/atoms/forceRun';
import { deepCopy } from '~core/logical_layers/utils/deepCopy';
import { combinedAtom } from './atoms/combinedAtom';
import { drawModeLogicalLayerAtom, drawModeRenderer } from './atoms/logicalLayerAtom';
import { activeDrawModeAtom } from './atoms/activeDrawMode';
import { drawModes } from './constants';
import { setIndexesForCurrentGeometryAtom } from './atoms/selectedIndexesAtom';
import { drawnGeometryAtom } from './atoms/drawnGeometryAtom';
import { drawHistoryAtom } from './atoms/drawHistoryAtom';
import { convertToFeatures } from './convertToFeatures';
import { toolboxAtom } from './atoms/toolboxAtom';
import type { DrawToolController, DrawToolsController, DrawToolsHook } from './types';

function DeferredPromise<T>() {
  // @ts-expect-error this values assigned later
  const deferred: {
    resolve: (value: T | PromiseLike<T>) => void;
    promise: Promise<T>;
  } = {};
  const promise = new Promise<T>((resolve, reject) => {
    deferred.resolve = resolve;
  });
  deferred.promise = promise;
  return deferred;
}

class DrawToolsControllerImpl implements DrawToolsController {
  isActivated = false;
  private deferred: null | {
    resolve: (geometry: GeoJSON.FeatureCollection | null) => void;
    promise: Promise<GeoJSON.FeatureCollection | null>;
  } = null;
  private unsubscribe?: () => void;

  init() {
    drawModeRenderer.setupExtension(combinedAtom);
  }

  dissolve() {
    throw Error('Not implemented');
  }

  async edit(geometry: GeoJSON.GeoJSON): Promise<GeoJSON.FeatureCollection | null> {
    // forceRun is used to keep combinedAtom active during editing
    this.unsubscribe = forceRun(combinedAtom);
    // Edit already in progress
    if (this.deferred) {
      console.warn('Unexpected attempt call edit while it already in edit state');
      return this.deferred.promise;
    }
    const geometryFeatures = convertToFeatures(geometry);
    store.dispatch([
      // Enable layer for draw tools
      drawModeLogicalLayerAtom.enable(),
      // Setup initial draw mode
      activeDrawModeAtom.setDrawMode(drawModes.ModifyMode),
      // hack to select all features
      setIndexesForCurrentGeometryAtom.set(true),
      // Set features to editor
      drawnGeometryAtom.setFeatures(deepCopy(geometryFeatures)),
      // Set Toolbar settings
      toolboxAtom.setSettings({
        availableModes: ['DrawPolygonMode', 'DrawLineMode', 'DrawPointMode'],
        finishButtonCallback: () => {
          this.deferred?.resolve(this.geometry);
          this.deferred = null;
        },
      }),
    ]);

    this.deferred = DeferredPromise<GeoJSON.FeatureCollection | null>();
    return this.deferred.promise;
  }

  exit() {
    store.dispatch([
      drawModeLogicalLayerAtom.disable(),
      activeDrawModeAtom.setDrawMode(null),
      drawnGeometryAtom.setFeatures([]),
    ]);
    // TODO: Do we really need to unsubscribe and resubscribe combinedAtom for each edit?
    this.unsubscribe?.();
    if (this.deferred) {
      console.warn('Edit mode exited before completion.');
      this.deferred.resolve(null);
      this.deferred = null;
    }
  }

  get geometry(): GeoJSON.FeatureCollection {
    return store.getState(drawnGeometryAtom);
  }
}

const modeToName = {
  DrawPointMode: i18n.t('draw_tools.point'),
  DrawLineMode: i18n.t('draw_tools.line'),
  DrawPolygonMode: i18n.t('draw_tools.area'),
};
const modeToIcon = {
  DrawPointMode: 'PointOutline24',
  DrawLineMode: 'Line24',
  DrawPolygonMode: 'Area24',
};

export const useDrawTools: DrawToolsHook = () => {
  const [
    { mode: activeDrawMode, selectedIndexes, settings },
    {
      deleteFeatures,
      toggleDrawMode,
      finishDrawing,
      downloadDrawGeometry,
      cancelDrawing,
    },
  ] = useAtom(toolboxAtom);

  useEffect(() => {
    if (!activeDrawMode) return;
    const handler = (e: KeyboardEvent) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key.toLowerCase() !== 'z') return;
      e.preventDefault();
      if (e.shiftKey) store.dispatch(drawHistoryAtom.redo());
      else store.dispatch(drawHistoryAtom.undo());
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeDrawMode]);

  const controls = useMemo(() => {
    const controlsArray: Array<DrawToolController> =
      settings.availableModes?.map((mode) => ({
        name: modeToName[mode],
        hint: '',
        icon: modeToIcon[mode],
        state: activeDrawMode === mode ? 'active' : 'regular',
        action: () => toggleDrawMode(drawModes[mode]),
        preferredSize: 'tiny',
        mobilePreferredSize: 'medium',
      })) ?? [];

    controlsArray.push({
      name: i18n.t('toolbar.delete'),
      hint: '',
      icon: 'Trash24',
      state: selectedIndexes.length > 0 ? 'regular' : 'disabled',
      action: deleteFeatures,
      preferredSize: 'medium',
    });

    controlsArray.push({
      name: i18n.t('toolbar.download'),
      hint: '',
      icon: 'Download24',
      state: 'regular',
      action: downloadDrawGeometry,
      preferredSize: 'medium',
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

  return [controls, { cancelDrawing, finishDrawing }];
};

export const drawTools: DrawToolsController = new DrawToolsControllerImpl();
