import mapLibre from 'maplibre-gl';
import { createContainerInWebComponent } from './createContainerInWebComponent';

const { default: css } = await import('maplibre-gl/dist/maplibre-gl.css?raw');
const container = createContainerInWebComponent({
  injectCss: css,
  webComponentTag: 'map-gl',
});
export const map = new mapLibre.Map({ container });
