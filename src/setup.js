import path from 'path'
import fs from 'fs-extra'
import chalk from 'chalk'

import { base64Decode, cleanup } from './utils'
import paths from './paths'

import type { PlatformKeys, KeysEnv } from './types'

const mapPlatformToUrl = {
  github: 'github.com',
  gitlab: 'gitlab.com',
  bitbucket: 'bitbucket.org',
}

export const delimeter = '### git-ssh-key-config ###'

export const filterKeys = (keys: PlatformKeys) =>
  Object.keys(keys).reduce((validKeys, platform) => {
    if (!keys[platform]) return validKeys

    validKeys[platform] = keys[platform]
    return validKeys
  }, {})

export const getKeyPath = (platform: string) =>
  path.resolve(paths.keysDir, `${platform}_key`)

export const buildConfig = (platform: string) =>
  `${delimeter}
Host ${mapPlatformToUrl[platform]}
  IdentitiesOnly yes
  UserKnownHostsFile=/dev/null
  StrictHostKeyChecking no
  IdentityFile ${getKeyPath(platform)}
${delimeter}
`

export const createKeyFile = (platform: string, key: string) => {
  fs.ensureDirSync(paths.keysDir)
  const keyPath = getKeyPath(platform)
  fs.writeFileSync(keyPath, key)
  fs.chmodSync(keyPath, '600')
}

export const appendConfigFile = (platform: string) =>
  fs.appendFileSync(paths.configFile, buildConfig(platform))

export const setupSshConfig = (keys: PlatformKeys) => {
  const validKeys = filterKeys(keys)

  Object.keys(validKeys).forEach(platform => {
    const key = validKeys[platform]
    createKeyFile(platform, key)
    appendConfigFile(platform)
  })
}

export default (env: KeysEnv) => {
  cleanup()

  const {
    GIT_SSH_KEY_GITHUB: githubKey,
    GIT_SSH_KEY_GITLAB: gitlabKey,
    GIT_SSH_KEY_BITBUCKET: bitbucketKey,
  } = env

  // If a private key of a specific platform is provided, setup env using
  // configs to allow all platforms.
  if (githubKey || gitlabKey || bitbucketKey) {
    const keys = {
      github: base64Decode(githubKey),
      gitlab: base64Decode(gitlabKey),
      bitbucket: base64Decode(bitbucketKey),
    }

    setupSshConfig(keys)
    return
  }

  console.log(
    chalk.red(`
You must set private keys in appropriate environment variables, either manually 
or in a '.env' file encoded using base64 algorithm.

git-ssh-key reads from the folowing environment variables :-

GIT_SSH_KEY_GITHUB
GIT_SSH_KEY_BITBUCKET
GIT_SSH_KEY_GITLAB
  `)
  )

  process.exit(1)
}

/* eslint no-param-reassign: off */
