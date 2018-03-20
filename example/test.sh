#!/usr/bin/env bash

cd example
echo "Testing npm"
npm i
node index.js || exit 1

rm -rf node_modules
rm -rf package-lock.json
yarn cache clean

echo "Testing yarn"
yarn
node index.js || exit 1
cd ..