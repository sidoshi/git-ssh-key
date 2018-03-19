export const base64Decode = (encoded: ?string) =>
  typeof encoded === 'string'
    ? Buffer.from(encoded, 'base64').toString('utf8')
    : null

/* eslint import/prefer-default-export: off */
