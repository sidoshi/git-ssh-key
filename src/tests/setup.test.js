import path from 'path'
import fs from 'fs-extra'

import setup, {
  filterKeys,
  setupSshConfig,
  buildConfig,
  getKeyPath,
  createKeyFile,
  appendConfigFile,
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

test('getKeyPath', () => {
  expect(getKeyPath('github')).toMatch('.ssh/git_ssh_keys/github_key')
})

test('BuildConfig', () => {
  expect(buildConfig('github')).toMatch('github.com')
  expect(buildConfig('github')).toMatch('github_key')
  expect(buildConfig('github')).toMatch('### git-ssh-key-config ###')
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
  expect(fs.statSync(keyPath).mode).toBe(33152)
})

test('Appends config file properly', () => {
  const configPath = paths.configFile
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
  setupSshConfig(
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
  expect(fs.existsSync(paths.configFile)).toBe(true)
  const config = fs.readFileSync(path.resolve(paths.configFile)).toString()
  expect(config).toMatch('gitlab_key')
  expect(config).toMatch('github_key')
  expect(config).toMatch('gitlab.com')
  expect(config).toMatch('github.com')
  expect(config).not.toMatch('bitbucket_key')
  expect(config).not.toMatch('bitbucket.org')
})

test('Shows error message if no keys are found', () => {
  setup({})
  expect(console.log.mock.calls[0][0]).toMatchSnapshot()
  expect(process.exit).toBeCalledWith(1)
})

test('Works if platform key is provided', () => {
  setup({ GIT_SSH_KEY_GITHUB: 'github' })
  expect(process.exit).not.toBeCalledWith(1)
})
