import type { MapPopoverService, ScreenPoint } from '../types';
import type { PopoverService } from './MapPopoverProvider';

export class MapPopoverServiceAdapter implements MapPopoverService {
  constructor(private readonly popoverService: PopoverService) {}

  show(point: ScreenPoint, content: React.ReactNode, placement?: string): void {
    this.popoverService.show(point, content, placement as any);
  }

  move(point: ScreenPoint, placement?: string): void {
    this.popoverService.move(point, placement as any);
  }

  close(): void {
    this.popoverService.close();
  }
}
