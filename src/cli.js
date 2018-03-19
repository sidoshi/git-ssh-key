import chalk from 'chalk'

import packageJson from '../package.json'
import setup from './setup'
import teardown from './teardown'

const allowedCommands = ['setup', 'teardown']

// CLI usage
export const usage = `
usage: git-ssh-key [${allowedCommands.join('|')}]
`

// Show usage on error and exit the process
const showUsageAndExit = () => {
  console.log(chalk.red(usage))
  process.exit(1)
}

export default (argv: string[]) => {
  const args = argv.slice(2)
  // Check that only one command is provided at a time
  if (args.length !== 1) showUsageAndExit()

  const [command] = args

  switch (command) {
    case '-v':
    case '--version':
      console.log(packageJson.version)
      break
    case 'setup':
      setup(process.env)
      break
    case 'teardown':
      teardown(process.env)
      break
    default:
      showUsageAndExit()
  }
}
