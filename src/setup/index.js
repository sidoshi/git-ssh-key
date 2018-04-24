import setup from './setup'
import { cleanup, base64Decode } from '../utils'

const keyNotFoundMessage = () =>
  `
Private keys not found.

You must set private keys in appropriate environment variables, either manually
or in a '.env' file, encoded using base64 algorithm.

git-ssh-key reads private keys from environment variables matching pattern:

GIT_SSH_KEY_XXXX

For eg:-

GIT_SSH_KEY_GITHUB
GIT_SSH_KEY_BITBUCKET
GIT_SSH_KEY_GITLAB
 `

const hostNotFoundMessage = (keyName, hostName) => `
Host url not found for corresponding private key: ${keyName}
Missing environment variable: ${hostName}
      
You must set host urls in appropriate environment variables, either manually
or in a '.env' file.

git-ssh-key reads host urls from environment variables matching pattern:

GIT_SSH_HOST_XXXX

You dont need to provide host urls for a few popular git services like:
Github, Gitlab and Bitbucket. Though If you do provide host urls for those 
services, it will override the default values.

For eg:-

GIT_SSH_HOST_COMPANY_GITLAB
GIT_SSH_HOST_GITHUB
GIT_SSH_HOST_BITBUCKET
`

export const getKeyNames = (envs: Object) =>
  Object.keys(envs).filter(key => key.match(/GIT_SSH_KEY_.+/))

export const getHosts = (envs: Object) => ({
  GIT_SSH_HOST_GITHUB: 'github.com',
  GIT_SSH_HOST_BITBUCKET: 'bitbucket.org',
  GIT_SSH_HOST_GITLAB: 'gitlab.com',
  ...Object.keys(envs).reduce(
    (acc, curr) =>
      curr.match(/GIT_SSH_HOST_.+/) ? { ...acc, [curr]: envs[curr] } : acc,
    {}
  ),
})

export default (envs: Object) => {
  cleanup()

  const keyNames = getKeyNames(envs)
  if (keyNames.length === 0) {
    console.log(keyNotFoundMessage())
    process.exit()
  }

  const hosts = getHosts(envs)

  const pairs = keyNames.map(keyName => {
    const privateKey = base64Decode(envs[keyName])

    const hostName = keyName.replace('GIT_SSH_KEY', 'GIT_SSH_HOST')
    const host = hosts[hostName]
    if (!host) {
      console.log(hostNotFoundMessage(keyName, hostName))
      process.exit(1)
    }

    return [host, privateKey]
  })

  setup(pairs)
}
