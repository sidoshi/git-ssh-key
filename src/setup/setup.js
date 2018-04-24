import path from 'path'
import fs from 'fs-extra'

import { delimeter } from '../utils'
import paths from '../paths'

type PrivateKey = string
type Host = string

export const buildConfig = (host: Host, identityFile: string) => `
${delimeter}
Host ${host}
  IdentitiesOnly yes
  UserKnownHostsFile=/dev/null
  StrictHostKeyChecking no
  IdentityFile ${identityFile}
${delimeter}
`

export const getPrivateKeyFilePath = (host: Host) =>
  path.resolve(paths.keysDir, `${host.replace(/\./g, '_')}_key`)

export const appendConfigFile = (host: Host) =>
  fs.appendFileSync(
    paths.configFile,
    buildConfig(host, getPrivateKeyFilePath(host))
  )

export const createKeyFile = (host: string, key: string) => {
  fs.ensureDirSync(paths.keysDir)
  const privateKeyFilePath = getPrivateKeyFilePath(host)

  fs.writeFileSync(privateKeyFilePath, key)
  fs.chmodSync(privateKeyFilePath, '600')
}

export default (pairs: [Host, PrivateKey][]) =>
  pairs.forEach(([host, key]) => {
    createKeyFile(host, key)
    appendConfigFile(host)
  })
