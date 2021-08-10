import { createStore, IModuleStore } from 'redux-dynamic-modules';
import { getSagaExtension } from 'redux-dynamic-modules-saga';

const store: IModuleStore<any> = createStore({
  extensions: [getSagaExtension()],
});

export default store;
