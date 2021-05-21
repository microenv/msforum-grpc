import { defaultValue, delayMs, requiredEnvs } from 'src/utils';

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

    const value4 = defaultValue(undefined, 'defaultValue', true);
    expect(value4).toStrictEqual('defaultValue');

    const value5 = defaultValue(undefined, 'defaultValue', false);
    expect(value5).toStrictEqual('defaultValue');
  });

  it('requiredEnvs', () => {
    process.env['a'] = 'value';
    process.env['b'] = 'value';
    process.env['c'] = 'value';
    expect(requiredEnvs(['a', 'b', 'c'])).toStrictEqual(true);
  });

  it('requiredEnvs with error', () => {
    expect(() => requiredEnvs(['x', 'y', 'z'])).toThrow();
  });

  it('delayMs', () => {
    expect(delayMs(1)).resolves.toBeFalsy();
  });
});
