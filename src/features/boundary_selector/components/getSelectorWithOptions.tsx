import { Selector } from '@konturio/ui-kit';

export const getSelectorWithOptions = (options, onChange, onHover) => (
  <Selector
    small={true}
    options={options}
    stopPropagation={true}
    onChange={onChange}
    onHover={onHover}
  />
);
