export function defaultValue(
  value: any,
  defaultValue: any,
  preserveFalsy: boolean,
) {
  if (value === undefined) return defaultValue;
  if (!preserveFalsy && !value) return defaultValue;
  return value;
}
