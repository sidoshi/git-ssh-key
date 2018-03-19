import fs from 'fs-extra'
import paths from './paths'

export const base64Decode = (encoded: ?string) =>
  typeof encoded === 'string'
    ? Buffer.from(encoded, 'base64').toString('utf8')
    : null

export const cleanup = () => fs.removeSync(paths.tmp)
