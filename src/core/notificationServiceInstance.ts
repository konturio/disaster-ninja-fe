import { NotificationService } from './notifications';
import { init as initLogicalLayers } from './logical_layers';

NotificationService.init();
initLogicalLayers();
export const notificationServiceInstance = NotificationService.getInstance();
