export function defaultValue(
  value: any,
  defaultValue: any,
  preserveFalsy: boolean,
) {
  if (value === undefined) return defaultValue;
  if (!preserveFalsy && !value) return defaultValue;
  return value;
}

export function requiredEnvs(envNames: string[]) {
  for (const name of envNames) {
    if (!process.env[name]) {
      console.error(`Environment variable missing: ${name}`);
      process.exit(1);
    }
  }
}
