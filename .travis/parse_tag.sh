#!/bin/bash

set -euo pipefail

readonly TRAVIS_TAG=${TRAVIS_TAG:-}

if [[ -z "$TRAVIS_TAG" ]]; then
    echo "TRAVIS_TAG is not defined, abort."
else
    regex="^deploy_server_(.*)_env_(.*)$"
    
    if [[ $TRAVIS_TAG =~ $regex ]]; then
        export SWAP_SERVER="${BASH_REMATCH[1]}"
        export SWAP_ENV="${BASH_REMATCH[2]}"
        echo server: $SWAP_SERVER env: $SWAP_ENV
    fi
fi

# This is a workaround for https://github.com/travis-ci/travis-ci/issues/5434
set +u
