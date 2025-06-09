import type { IMap } from '../providers/IMapProvider';

// Plugin is now a hook function that can be called in React context
export type MapPlugin<TMap extends IMap = IMap> = (map: TMap) => void;
