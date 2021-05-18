import { defaultValue, requiredEnvs } from "src/utils";

// jest.mock('console', () => ({
//   error: jest.fn(),
// }));

// jest.mock('process.exit', () => {
//   //
// });

describe('utils', () => {
  it('defaultValue', () => {
    const value1 = defaultValue('value', 'defaultValue', false);
    expect(value1).toStrictEqual('value');

    const value2 = defaultValue('', 'defaultValue', false);
    expect(value2).toStrictEqual('defaultValue');

    const value3 = defaultValue('', 'defaultValue', true);
    expect(value3).toStrictEqual('');
  });

  it('requiredEnvs', () => {
    process.env['a'] = 'value';
    process.env['b'] = 'value';
    process.env['c'] = 'value';
    expect(requiredEnvs(['a', 'b', 'c'])).toStrictEqual(true);
  });

  it('requiredEnvs with error', () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation((() => {}) as any);
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation((() => {}) as any);

    expect(requiredEnvs(['x', 'y', 'z'])).toStrictEqual(false);
    expect(consoleErrorSpy).toHaveBeenCalledWith(`Environment variable missing: x`);
    expect(processExitSpy).toHaveBeenCalledWith(1);

    consoleErrorSpy.mockRestore();
    processExitSpy.mockRestore();
  });
});
