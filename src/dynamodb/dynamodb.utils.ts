export const TableName = (tableName: string): string => {
  let prefix = process.env.DYNAMODB_TABLES_PREFIX || '';

  if (prefix && prefix.charAt(prefix.length - 1) !== '_') {
    prefix += '_';
  }

  return `${prefix}${tableName}`;
};
