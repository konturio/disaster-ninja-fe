interface AppSensor {
  id: string;
  setup: () => Promise<this>;
  onUpdate: (payload: any) => void;
  ready: boolean;
  stop: () => void;
}
