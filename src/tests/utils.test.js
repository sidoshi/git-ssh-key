import fs from 'fs-extra'

import { base64Decode, cleanup } from '../utils'
import { appendConfigFile } from '../setup/setup'
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

  const originalConfig = fs.existsSync(paths.configFile)
    ? fs.readFileSync(paths.configFile).toString()
    : null

  !originalConfig && fs.appendFileSync(paths.configFile, 'Some existing config')
  appendConfigFile('github')
  appendConfigFile('gitlab')
  cleanup()

  expect(fs.readFileSync(paths.configFile).toString()).toBe(
    originalConfig || 'Some existing config'
  )
  fs.removeSync(paths.configFile)

  appendConfigFile('github')
  appendConfigFile('gitlab')
  cleanup()

  expect(fs.existsSync(paths.configFile)).toBe(false)

  originalConfig
    ? fs.writeFileSync(paths.configFile, originalConfig)
    : fs.removeSync(paths.configFile)
})
