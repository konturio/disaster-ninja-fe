export const NAVIGATE_EVENT = 'KNT_NAVIGATE_TO';

export const goTo = (slug: string) => {
  const evt = new CustomEvent(NAVIGATE_EVENT, { detail: { payload: slug } });
  globalThis.dispatchEvent(evt);
};
