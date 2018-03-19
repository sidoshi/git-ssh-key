export type KeysEnv = {
  GIT_SSH_KEY_GITHUB?: ?string,
  GIT_SSH_KEY_GITLAB?: ?string,
  GIT_SSH_KEY_BITBUCKET?: ?string,
  GIT_SSH_KEY?: ?string,
}

export type Key = string

export type PlatformKeys = {
  github: ?Key,
  gitlab: ?Key,
  bitbucket: ?Key,
}
