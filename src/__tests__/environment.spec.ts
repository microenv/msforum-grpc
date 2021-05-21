import { existsSync } from "fs";
import { join } from "path";

describe('Environment test', () => {
  it('.env file should exists on the root of this repository', () => {
    const dotEnvExists = existsSync(join(__dirname, '../../.env'));
    expect(dotEnvExists).toStrictEqual(true);
  });
});
