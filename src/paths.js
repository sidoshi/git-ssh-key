import path from 'path'
import os from 'os'

const homedir = os.homedir()

export default {
  homedir,
  keysDir: path.resolve(homedir, '.ssh', 'git_ssh_keys'),
  configFile: path.resolve(homedir, '.ssh', 'config'),
}
