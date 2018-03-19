const p = require('private-package')

const value = p()
if (value !== 'This is private package 2This is a private package') {
  console.log(value)
  process.exit(1)
}

/* eslint import/no-unresolved: off */
