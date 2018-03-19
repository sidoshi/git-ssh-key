import path from 'path'
import fs from 'fs-extra'

import setup, {
  filterKeys,
  setupSshConfigFile,
  buildConfig,
  createKeyFile,
  appendConfigFile,
  setupSshCommand,
} from '../setup'
import { cleanup } from '../utils'
import paths from '../paths'

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

test('Filters keys properly', () => {
  expect(
    filterKeys({ github: null, gitlab: '', bitbucket: undefined })
  ).toEqual({})
  expect(
    filterKeys({
      github: 'github',
      gitlab: 'something',
      bitbucket: undefined,
    })
  ).toEqual({ github: 'github', gitlab: 'something' })
})

test('BuildConfig', () => {
  expect(buildConfig('github')).toMatch('github.com')
  expect(buildConfig('github')).toMatch('github_key')
  expect(buildConfig('gitlab')).toMatch('gitlab.com')
  expect(buildConfig('gitlab')).toMatch('gitlab_key')
  expect(buildConfig('bitbucket')).toMatch('bitbucket.org')
  expect(buildConfig('bitbucket')).toMatch('bitbucket_key')
})

test('creates key file properly', () => {
  const keyPath = path.resolve(paths.keysDir, 'github_key')
  expect(fs.existsSync(keyPath)).toBe(false)
  createKeyFile('github', 'githubKey')
  expect(fs.existsSync(keyPath)).toBe(true)
  expect(fs.readFileSync(keyPath).toString()).toBe('githubKey')
})

test('Appends config file properly', () => {
  const configPath = path.resolve(paths.configDir, 'config')
  expect(fs.existsSync(configPath)).toBe(false)
  appendConfigFile('github')
  expect(fs.existsSync(configPath)).toBe(true)
  expect(fs.readFileSync(configPath).toString()).toMatch('github.com')
  expect(fs.readFileSync(configPath).toString()).toMatch('github_key')
  appendConfigFile('gitlab')
  expect(fs.readFileSync(configPath).toString()).toMatch('gitlab.com')
  expect(fs.readFileSync(configPath).toString()).toMatch('gitlab_key')
})

test('Setups config file properly when platform keys are provided', () => {
  const env = {}
  expect(env.GIT_SSH_COMMAND).not.toBeDefined()
  setupSshConfigFile(
    {
      github: 'githubKey',
      gitlab: 'gitlabKey',
      bitbucket: null,
    },
    env
  )
  expect(fs.existsSync(path.resolve(paths.keysDir, 'github_key'))).toBe(true)
  expect(fs.existsSync(path.resolve(paths.keysDir, 'gitlab_key'))).toBe(true)
  expect(fs.existsSync(path.resolve(paths.keysDir, 'bitbucket_key'))).toBe(
    false
  )
  expect(fs.existsSync(path.resolve(paths.configDir, 'config'))).toBe(true)
  const config = fs
    .readFileSync(path.resolve(paths.configDir, 'config'))
    .toString()
  expect(config).toMatch('gitlab_key')
  expect(config).toMatch('github_key')
  expect(config).toMatch('gitlab.com')
  expect(config).toMatch('github.com')
  expect(config).not.toMatch('bitbucket_key')
  expect(config).not.toMatch('bitbucket.org')
  expect(env.GIT_SSH_COMMAND).toBeDefined()
})

test('Setups command properly when general key is provided', () => {
  const env = {}
  expect(env.GIT_SSH_COMMAND).not.toBeDefined()
  setupSshCommand('generalKey', env)
  expect(fs.existsSync(path.resolve(paths.configDir, 'config'))).not.toBe(true)
  expect(fs.existsSync(path.resolve(paths.keysDir, 'general_key'))).toBe(true)
  expect(env.GIT_SSH_COMMAND).toBeDefined()
})

test('Shows error message if no keys are found', () => {
  setup({})
  expect(console.log.mock.calls[0][0]).toMatchSnapshot()
  expect(process.exit).toBeCalledWith(1)
})

test('Works if either platform or general keys are provided', () => {
  setup({ GIT_SSH_KEY: 'general' })
  expect(process.exit).not.toBeCalledWith(1)
  process.exit = jest.fn()
  setup({ GIT_SSH_KEY_GITHUB: 'github' })
  expect(process.exit).not.toBeCalledWith(1)
})
