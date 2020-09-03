#!/bin/bash

set -euo pipefail

printf 'Building swap from commit %s\n' "$TRAVIS_COMMIT"
if [[ "$TRAVIS_BRANCH" == "develop" ]]; then
  echo "Start running build_auto_dev"
  npm run build_auto_dev
  echo "Finished running build_auto_dev"

  echo "Start running build_auto_ropsten"
  npm run build_auto_ropsten &> /dev/null
  echo "Finished running build_auto_ropsten"
elif [[ "$TRAVIS_BRANCH" == "staging" ]]; then
  echo "Start running build_auto_staging_limit_order"
  npm run build_auto_staging_limit_order
  echo "Finished running build_auto_staging_limit_order"
elif [[ "$TRAVIS_BRANCH" == "master" ]]; then
  echo "Start running build_auto_production"
  npm run build_auto_production
  echo "Finished running build_auto_production"

  echo "Start running build_auto_ropsten"
  npm run build_auto_ropsten &> /dev/null
  echo "Finished running build_auto_ropsten"

  echo "Start running build-ropsten"
  npm run build-ropsten &> /dev/null
  echo "Finished running build-ropsten"

  echo "Start running build-staging"
  npm run build-staging &> /dev/null
  echo "Finished running build-staging"
else
    echo "Branch is not set for auto-build."
    exit 0
fi
