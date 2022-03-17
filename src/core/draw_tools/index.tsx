import { combinedAtom } from './atoms/combinedAtom';
import { drawModeRenderer } from './atoms/logicalLayerAtom';
// a little scratch about new and previous structure https://www.figma.com/file/G8VQQ3mctz5gPkcZZvbzCl/Untitled?node-id=0%3A1
// newest structure: https://www.figma.com/file/FcyFYb406D8zGFWxyK4zIk/Untitled?node-id=0%3A1

export function initDrawTools() {
  drawModeRenderer.setupExtension(combinedAtom);
}
