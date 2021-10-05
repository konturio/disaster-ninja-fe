import { createAtom } from '@reatom/core';
import { UrlData } from '../types';
import { URLDataInSearchEncoder } from '../data_in_URL_encoder';

const encoder = new URLDataInSearchEncoder();

export const currentUrlAtom = createAtom(
  {
    _initialUrlState: (initialState: UrlData) => initialState,
    _onUrlChange: (newState: UrlData) => newState,
    setUrlState: (newState: UrlData) => newState,
  },
  ({ onInit, onAction, schedule, create }, state: UrlData = {}) => {
    onInit(() =>
      schedule((dispatch) => {
        dispatch(
          create(
            '_initialUrlState',
            encoder.decode(document.location.search.slice(1)),
          ),
        );
        window.addEventListener('popstate', ({ state }) => {
          dispatch(create('_onUrlChange', state));
        });
      }),
    );

    onAction('_initialUrlState', (payload) => {
      state = payload;
    });

    onAction('_onUrlChange', (payload) => {
      state = payload;
    });

    onAction('setUrlState', (payload) => {
      // * Note that I not update local state here because I don't want to update depended atoms
      window.history.pushState(
        payload,
        document.title,
        '?' + encoder.encode(payload),
      );
    });

    console.log('[CurrentUrlAtom] state', state);
    return state;
  },
);
