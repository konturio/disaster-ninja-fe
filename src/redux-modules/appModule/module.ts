import reducer from './reducer';
import rootSaga from './sagas/root.saga';

export default function getAppModule() {
  return {
    id: 'appModule',
    reducerMap: {
      appModule: reducer,
    },
    sagas: [rootSaga],
  };
}
