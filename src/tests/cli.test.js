import chalk from 'chalk'

import cli, { usage } from '../cli'
import packageJson from '../../package.json'
import * as setup from '../setup'
import * as teardown from '../teardown'

const _exit = process.exit
const _log = console.log
const _setup = setup.default
const _teardown = teardown.default

beforeEach(() => {
  process.exit = jest.fn()
  console.log = jest.fn()
  setup.default = jest.fn()
  teardown.default = jest.fn()
})

afterAll(() => {
  process.exit = _exit
  console.log = _log
  setup.default = _setup
  teardown.default = _teardown
})

test('Only allows 1 command', () => {
  cli(['node', 'file', 'setup', 'teardown'])
  expect(process.exit).toBeCalledWith(1)
  expect(console.log).toHaveBeenCalledWith(chalk.red(usage))
})

test('Restricts to allowed commands', () => {
  cli(['node', 'file', 'test'])
  expect(process.exit).toBeCalledWith(1)
  expect(console.log).toHaveBeenCalledWith(chalk.red(usage))
})

test('Shows usage if no command is given', () => {
  cli(['node', 'file'])
  expect(process.exit).toBeCalledWith(1)
  expect(console.log).toHaveBeenCalledWith(chalk.red(usage))
})

test('Provides Version', () => {
  cli(['node', 'file', '-v'])
  expect(console.log).toHaveBeenCalledWith(packageJson.version)
  console.log = jest.fn()
  cli(['node', 'file', '--version'])
  expect(console.log).toHaveBeenCalledWith(packageJson.version)
})

test('Calls setup properly', () => {
  cli(['node', 'file', 'setup'])
  expect(setup.default).toBeCalledWith(process.env)
  expect(teardown.default).not.toBeCalled()
})

test('Calls teardown properly', () => {
  cli(['node', 'file', 'teardown'])
  expect(setup.default).not.toBeCalled()
  expect(teardown.default).toBeCalledWith(process.env)
})
