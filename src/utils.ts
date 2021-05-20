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
      throw new Error(`Environment variable missing: ${name}`);
    }
  }

  return true;
}

export function delayMs(ms: number = 100) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(null);
    }, ms);
  });
}
