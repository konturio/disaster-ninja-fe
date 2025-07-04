import { applyFormatter } from '../helpers/applyFormater';
import { useUniLayoutContext } from '../Layout/UniLayoutContext';

export const useFormattedValue = (value: unknown, format?: string) => {
  const context = useUniLayoutContext();
  if (format && context.formatsRegistry[format]) {
    return applyFormatter(value, context.formatsRegistry[format], format);
  }
  return String(value);
};
