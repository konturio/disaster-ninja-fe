// https://github.com/maplibre/maplibre-gl-js/blob/a3568e0363c7fd3540a1e18163e70665efbd084f/src/ui/control/scale_control.ts
export function updateScale(
  map,
  container: HTMLElement,
  options: {
    maxWidth?: number;
    unit?: 'metric' | 'imperial' | 'nautical';
  },
) {
  // A horizontal scale is imagined to be present at center of the map
  // container with maximum length (Default) as 100px.
  // Using spherical law of cosines approximation, the real distance is
  // found between the two coordinates.
  const maxWidth = (options && options.maxWidth) || 100;

  const y = map._container.clientHeight / 2;
  const left = map.unproject([0, y]);
  const right = map.unproject([maxWidth, y]);
  const maxMeters = left.distanceTo(right);
  // The real distance corresponding to 100px scale length is rounded off to
  // near pretty number and the scale length for the same is found out.
  // Default unit of the scale is based on User's locale.
  if (options && options.unit === 'imperial') {
    const maxFeet = 3.2808 * maxMeters;
    if (maxFeet > 5280) {
      const maxMiles = maxFeet / 5280;
      setScale(container, maxWidth, maxMiles, map._getUIString('ScaleControl.Miles'));
    } else {
      setScale(container, maxWidth, maxFeet, map._getUIString('ScaleControl.Feet'));
    }
  } else if (options && options.unit === 'nautical') {
    const maxNauticals = maxMeters / 1852;
    setScale(
      container,
      maxWidth,
      maxNauticals,
      map._getUIString('ScaleControl.NauticalMiles'),
    );
  } else if (maxMeters >= 1000) {
    setScale(
      container,
      maxWidth,
      maxMeters / 1000,
      map._getUIString('ScaleControl.Kilometers'),
    );
  } else {
    setScale(container, maxWidth, maxMeters, map._getUIString('ScaleControl.Meters'));
  }
}
function setScale(
  container: HTMLElement,
  maxWidth: number,
  maxDistance: number,
  unit: string,
) {
  const distance = getRoundNum(maxDistance);
  const ratio = distance / maxDistance;
  container.style.width = `${maxWidth * ratio}px`;
  container.innerHTML = `${distance}&nbsp;${unit}`;
}
function getDecimalRoundNum(d: number) {
  const multiplier = Math.pow(10, Math.ceil(-Math.log(d) / Math.LN10));
  return Math.round(d * multiplier) / multiplier;
}
function getRoundNum(num: number) {
  const pow10 = Math.pow(10, `${Math.floor(num)}`.length - 1);
  let d = num / pow10;

  d =
    d >= 10
      ? 10
      : d >= 5
        ? 5
        : d >= 3
          ? 3
          : d >= 2
            ? 2
            : d >= 1
              ? 1
              : getDecimalRoundNum(d);

  return pow10 * d;
}
