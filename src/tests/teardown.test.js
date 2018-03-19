import path from 'path'
import fs from 'fs-extra'

import teardown from '../teardown'

test('Teardown', () => {
  fs.ensureDirSync(path.resolve('tmp'))
  const env = {
    GIT_SSH_KEY_GITHUB: 'githubKey',
    GIT_SSH_KEY_GITLAB: 'gitlabKey',
    GIT_SSH_KEY_BITBUCKET: 'bitbucketKey',
    GIT_SSH_KEY: 'generalKey',
    GIT_SSH_COMMAND: 'command',
  }
  expect(fs.existsSync(path.resolve('tmp'))).toBe(true)
  expect(env.GIT_SSH_COMMAND).toBeDefined()
  expect(env.GIT_SSH_KEY_BITBUCKET).toBeDefined()
  expect(env.GIT_SSH_KEY_GITHUB).toBeDefined()
  expect(env.GIT_SSH_KEY_GITLAB).toBeDefined()
  expect(env.GIT_SSH_KEY).toBeDefined()
  teardown(env)
  expect(fs.existsSync(path.resolve('tmp'))).toBe(false)
  expect(env.GIT_SSH_COMMAND).not.toBeDefined()
  expect(env.GIT_SSH_KEY_BITBUCKET).not.toBeDefined()
  expect(env.GIT_SSH_KEY_GITHUB).not.toBeDefined()
  expect(env.GIT_SSH_KEY_GITLAB).not.toBeDefined()
  expect(env.GIT_SSH_KEY).not.toBeDefined()
})
