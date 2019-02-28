#!/bin/bash

set -euo pipefail

readonly awx_username=${AWX_USERNAME:-}
readonly awx_password=${AWX_PASSWORD:-}
readonly awx_develop_job_launch_uri=${AWX_DEVELOP_JOB_LAUNCH_URI:-}
readonly awx_staging_job_launch_uri=${AWX_STAGING_JOB_LAUNCH_URI:-}

if [[ "$SWAP_SERVER" == "develop" ]]; then
    awx_job_launch_uri=$awx_develop_job_launch_uri
elif [[ "$SWAP_SERVER" == "staging" ]]; then
    awx_job_launch_uri=$awx_staging_job_launch_uri
else
    echo "swap server is not set to call awx deploy"
    exit 0
fi

# VERY IMPORTANT: "prompt on launch" need to be set in the job template config in order for this API call to work.
curl -X POST $awx_job_launch_uri \
    --output /dev/null \
    --write-out "HTTP response code: %{http_code}\n" \
    --user "$awx_username:$awx_password" \
    --header "Content-Type: application/json" \
    --data '{ "extra_vars": {"kyber_swap_revision": "'$TRAVIS_COMMIT'", "kyber_swap_env": "'$SWAP_ENV'"}}'
