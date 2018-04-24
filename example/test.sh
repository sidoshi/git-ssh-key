#!/usr/bin/env bash

yarn build
npm pack
mv git-ssh-key*.tgz example/git-ssh-key.tgz

cd example
rm -rf node_modules
echo "Testing npm"
npm i
node index.js || exit 1
echo "npm test passed sucessfully"

rm -rf node_modules
rm -rf package-lock.json
yarn cache clean

echo "Testing yarn"
yarn -v
yarn
node index.js || exit 1
echo "yarn test passed sucessfully"

rm -rf node_modules
rm -rf package-lock.json
rm -rf yarn.lock
rm -rf git-ssh-key.tgz

cd ..