const yandexAccountId = window['yandexAccountId'];
const ym = window['ym'];

export function callYm(...params) {
  if (yandexAccountId && ym && typeof ym === 'function') {
      ym(yandexAccountId, ...params);
  }
}
