import fs from 'fs-extra'

import { base64Decode, cleanup } from '../utils'
import paths from '../paths'

test('base64Decode', () => {
  expect(base64Decode('SGVsbG8gV29ybGQ=')).toBe('Hello World')
  expect(base64Decode(null)).toBe(null)
  expect(base64Decode(undefined)).toBe(null)
  expect(base64Decode('')).toBe('')
  expect(base64Decode(121)).toBe(null)
})

test('cleanup', () => {
  fs.ensureDirSync(paths.keysDir)
  expect(fs.existsSync(paths.keysDir)).toBe(true)
  cleanup()
  expect(fs.existsSync(paths.keysDir)).toBe(false)
})
