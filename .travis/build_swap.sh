#!/bin/bash

set -euo pipefail

echo "Building swap from commit $TRAVIS_COMMIT with env $SWAP_ENV"
npm run build-all
