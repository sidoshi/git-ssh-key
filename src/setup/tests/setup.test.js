import path from 'path'
import fs from 'fs-extra'

import {
  buildConfig,
  getPrivateKeyFilePath,
  createKeyFile,
  appendConfigFile,
} from '../setup'
import { cleanup } from '../../utils'
import paths from '../../paths'

const _exit = process.exit
const _log = console.log

beforeEach(() => {
  process.exit = jest.fn()
  console.log = jest.fn()
  cleanup()
})

afterAll(() => {
  process.exit = _exit
  console.log = _log
  cleanup()
})

test('getPrivateKeyFilePath', () => {
  expect(getPrivateKeyFilePath('github.com')).toMatch(
    '.ssh/git_ssh_keys/github_com_key'
  )
  expect(getPrivateKeyFilePath('gitlab.company.co')).toMatch(
    '.ssh/git_ssh_keys/gitlab_company_co_key'
  )
})

test('BuildConfig', () => {
  expect(buildConfig('github.com')).toMatch('github.com')
  expect(buildConfig('github.com', 'github_com_key')).toMatch('github_com_key')
  expect(buildConfig('github.com')).toMatch('### git-ssh-key-config ###')
  expect(buildConfig('gitlab.com')).toMatch('gitlab.com')
  expect(buildConfig('gitlab.com', 'gitlab_com_key')).toMatch('gitlab_com_key')
  expect(buildConfig('bitbucket.org')).toMatch('bitbucket.org')
  expect(buildConfig('bitbucket.org', 'bitbucket_org_key')).toMatch(
    'bitbucket_org_key'
  )
})

test('creates key file properly', () => {
  const keyPath = path.resolve(paths.keysDir, 'github_com_key')
  expect(fs.existsSync(keyPath)).toBe(false)
  createKeyFile('github.com', 'githubKey')
  expect(fs.existsSync(keyPath)).toBe(true)
  expect(fs.readFileSync(keyPath).toString()).toBe('githubKey')
  expect(fs.statSync(keyPath).mode).toBe(33152)
})

test('Appends config file properly', () => {
  const configPath = paths.configFile
  appendConfigFile('github.com')
  expect(fs.existsSync(configPath)).toBe(true)
  expect(fs.readFileSync(configPath).toString()).toMatch('github.com')
  expect(fs.readFileSync(configPath).toString()).toMatch('github_com_key')
  appendConfigFile('gitlab.com')
  expect(fs.readFileSync(configPath).toString()).toMatch('gitlab.com')
  expect(fs.readFileSync(configPath).toString()).toMatch('gitlab_com_key')
})
