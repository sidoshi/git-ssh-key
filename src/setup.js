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

export const filterKeys = (keys: PlatformKeys) =>
  Object.keys(keys).reduce((validKeys, platform) => {
    if (!keys[platform]) return validKeys

    validKeys[platform] = keys[platform]
    return validKeys
  }, {})

export const buildConfig = (platform: string) =>
  `Host ${mapPlatformToUrl[platform]}
  IdentitiesOnly yes
  UserKnownHostsFile=/dev/null
  StrictHostKeyChecking no
  IdentityFile ${path.resolve(paths.keysDir, `${platform}_key`)}
`

export const createKeyFile = (platform: string, key: string) => {
  fs.ensureDirSync(paths.keysDir)
  const keyPath = path.resolve(paths.keysDir, `${platform}_key`)
  fs.writeFileSync(keyPath, key)
}

export const appendConfigFile = (platform: string) => {
  fs.ensureDirSync(paths.configDir)
  fs.appendFileSync(
    path.resolve(paths.configDir, 'config'),
    buildConfig(platform)
  )
}

export const setupSshConfig = (keys: PlatformKeys, env: Object) => {
  const validKeys = filterKeys(keys)

  Object.keys(validKeys).forEach(platform => {
    const key = validKeys[platform]
    createKeyFile(platform, key)
    appendConfigFile(platform)
  })

  env.GIT_SSH_COMMAND = `ssh -F ${path.resolve(paths.configDir, 'config')} $*`
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

    setupSshConfig(keys, env)
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
