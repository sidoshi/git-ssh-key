import teardown from '../teardown'

test('Teardown', () => {
  const env = {
    GIT_SSH_KEY_GITHUB: 'githubKey',
    GIT_SSH_KEY_GITLAB: 'gitlabKey',
    GIT_SSH_KEY_BITBUCKET: 'bitbucketKey',
  }

  expect(env.GIT_SSH_KEY_BITBUCKET).toBeDefined()
  expect(env.GIT_SSH_KEY_GITHUB).toBeDefined()
  expect(env.GIT_SSH_KEY_GITLAB).toBeDefined()
  teardown(env)
  expect(env.GIT_SSH_COMMAND).not.toBeDefined()
  expect(env.GIT_SSH_KEY_BITBUCKET).not.toBeDefined()
  expect(env.GIT_SSH_KEY_GITHUB).not.toBeDefined()
  expect(env.GIT_SSH_KEY_GITLAB).not.toBeDefined()
  expect(env.GIT_SSH_KEY).not.toBeDefined()
})
