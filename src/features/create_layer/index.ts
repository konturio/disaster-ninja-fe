import { createLayerController } from './control';
export { EditFeaturesOrLayerPanel } from './components/EditFeaturesOrLayerPanel/EditFeaturesOrLayerPanel';

export function initEditableLayer() {
  createLayerController.init();
}
