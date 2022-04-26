const splitByComma = (value) =>
  Number.isFinite(value) ? value : value.split(',').map((v) => v.trim());

const converters = {
  splitByComma,
  convertPlacement: (value) =>
    value.trim() === 'center' ? 'line-center' : value,
  convertOffset: (value) => {
    const pos = Array.isArray(value) ? value : splitByComma(value);
    if (pos.length === 1) return [0, pos[0]];
    return pos;
  },
  relativeCasingLineWith: (value, mapCSS) => {
    const mainLineWidth = mapCSS.width || 0;
    return mainLineWidth * 2 + Number(value);
  },
  applyCasingOffset: (value, mapCSS) => {
    const casingOffset = mapCSS?.['casing-offset'] || 0;
    return Number(value) + Number(casingOffset);
  },
  toNumber: (value) => Number(value),
};

export function createValueConverters(mapCSS) {
  return new Proxy(converters, {
    get(target, prop) {
      if (prop in target) {
        return (value) => target[prop](value, mapCSS);
      }
      return (value) => {
        console.error(
          `[ValueConverter]: converter: "${String(
            prop,
          )}" for ${value} not available`,
        );
        return value;
      };
    },
  });
}
