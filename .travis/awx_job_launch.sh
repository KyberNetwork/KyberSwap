#!/bin/bash

set -euo pipefail

readonly awx_username=${AWX_USERNAME:-}
readonly awx_password=${AWX_PASSWORD:-}
readonly awx_develop_job_launch_uri=${AWX_DEVELOP_JOB_LAUNCH_URI:-}
readonly awx_staging_job_launch_uri=${AWX_STAGING_JOB_LAUNCH_URI:-}

if [[ "$TRAVIS_BRANCH" == "develop" ]]; then
    awx_job_launch_uri=$awx_develop_job_launch_uri
elif [[ "$TRAVIS_BRANCH" == "staging" ]]; then
    awx_job_launch_uri=$awx_staging_job_launch_uri
else
    echo "Branch is not set for autodeployment."
    exit 0
fi

curl -X POST $awx_job_launch_uri \
    --output /dev/null \
    --write-out "HTTP response code: %{http_code}\n" \
    --user "$awx_username:$awx_password" \
    --header "Content-Type: application/json" \
