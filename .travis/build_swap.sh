#!/bin/bash

set -euo pipefail

TRAVIS_TAG=${TRAVIS_TAG:-}

if [[ -z "$TRAVIS_TAG" ]]; then
    echo 'TRAVIS_TAG is not set.'
    exit 0
else
    echo "Building swap from commit $TRAVIS_COMMIT with env $SWAP_ENV"
    npm run build-$SWAP_ENV
fi
