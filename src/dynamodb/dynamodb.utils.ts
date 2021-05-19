export const TableName = (
  tableName: string,
  prefix = process.env.DYNAMODB_TABLES_PREFIX || '',
): string => {
  if (prefix && prefix.charAt(prefix.length - 1) !== '_') {
    prefix += '_';
  }

  return `${prefix}${tableName}`;
};
