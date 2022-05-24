import { Selector } from '@k2-packages/ui-kit';

export const getSelectorWithOptions = (options, onChange, onHover) => (
  <Selector
    small={true}
    options={options}
    stopPropagation={true}
    onChange={onChange}
    onHover={onHover}
  />
);
