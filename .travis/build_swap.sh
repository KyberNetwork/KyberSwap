#!/bin/bash

set -euo pipefail

printf 'Building swap from commit %s' "$TRAVIS_COMMIT"
npm run build-all
