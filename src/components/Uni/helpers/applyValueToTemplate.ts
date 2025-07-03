import { compileStringTemplate } from '~utils/template/stringTemplate';

/**
 * @param urlTemplate String template which may include {{value}} placeholder
 * @param value value to replace the placeholder with
 * @returns string with actual value instead of {{value}} placeholder
 */
export const applyValueToTemplate = (urlTemplate: string, value: any) => {
  return compileStringTemplate(urlTemplate)({ value });
};
