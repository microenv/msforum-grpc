const allowedEnvNames = ['local', 'production'];
if (!allowedEnvNames.includes(process.env.NODE_ENV)) {
  throw new Error(`Invalid NODE_ENV=${process.env.NODE_ENV}`);
}
const envName = process.env.NODE_ENV;

export const TableName = (tableName: string): string => {
  return `msforum_${envName}_${tableName}`;
};
