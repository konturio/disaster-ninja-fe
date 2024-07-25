import { localStorage } from '~utils/storage';
const DEBUG_MAPCSS = !!localStorage?.getItem('DEBUG_MAPCSS');

export function getRequirements(config, mapCSS) {
  const initialCSS = {
    // * Next important string need for generate casing offset when main line offset not set
    offset: 0,
  };

  const requirements: [unknown, unknown][] = [];
  Object.entries({ ...initialCSS, ...mapCSS }).forEach(([prop, value]) => {
    const req = config[prop];
    if (req === undefined) {
      DEBUG_MAPCSS && console.debug(`Unsupported property: "${prop}"`);
    } else {
      requirements.push([req, value]);
    }
  });
  return requirements;
}
