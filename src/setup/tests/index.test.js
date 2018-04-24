import { getKeyNames, getHosts } from '../index'

test('getKeyNames', () => {
  expect(getKeyNames({ hello: 'world' })).toEqual([])
  expect(
    getKeyNames({
      hello: 'world',
      GIT_SSH_KEY_: 'nooo',
      GIT_SSH_KEY_GITHUB: 'githubKey',
      GIT_SSH_KEY_GITLAB: 'gitlabKey',
      GIT_SSH_KEY_CUSTOM_HOST: 'customKey',
    })
  ).toEqual([
    'GIT_SSH_KEY_GITHUB',
    'GIT_SSH_KEY_GITLAB',
    'GIT_SSH_KEY_CUSTOM_HOST',
  ])
})

test('getHosts', () => {
  expect(getHosts({ hello: 'world' })).toEqual({
    GIT_SSH_HOST_BITBUCKET: 'bitbucket.org',
    GIT_SSH_HOST_GITHUB: 'github.com',
    GIT_SSH_HOST_GITLAB: 'gitlab.com',
  })
  expect(
    getHosts({
      hello: 'world',
      GIT_SSH_HOST_GITLAB: 'gitlab.custom.com',
      GIT_SSH_HOST_YOYO: 'yoyo',
    })
  ).toEqual({
    GIT_SSH_HOST_BITBUCKET: 'bitbucket.org',
    GIT_SSH_HOST_GITHUB: 'github.com',
    GIT_SSH_HOST_GITLAB: 'gitlab.custom.com',
    GIT_SSH_HOST_YOYO: 'yoyo',
  })
})
