import { useUniLayoutContext } from '../Layout/UniLayoutContext';

export const useFormattedValue = (value: unknown, format?: string) => {
  const context = useUniLayoutContext();
  return format && context.formatsRegistry[format]
    ? context.formatsRegistry[format](value)
    : String(value);
};
