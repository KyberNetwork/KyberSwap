#!/bin/bash

branch=$1
build_env=$2
domain_name=$3
secret_token=$4 


body=$(cat << EOF
{
	"request": {
		"branch": "$branch",
		"config": {
			"sudo": "required",
			"language": "node_js",
			"cache": {
				"directories": [
					"node_modules"
				]
			},
			"node_js": [
				"8"
			],
			"script": [
				"echo \"npm test temporarily disabled\""
			],
			"install": [
				"npm install",
				"npm run build-$build_env",
				"mkdir upload",
				"mv dist/$build_env/index.html upload",
				"mv dist/$build_env/*.css upload",
				"mv dist/$build_env/*.js upload"
			],
			"deploy": [
				{
					"provider": "s3",
					"access_key_id": "\$AWS_ACCESS_KEY_ID",
					"secret_access_key": "\$AWS_SECRET_ACCESS_KEY",
					"bucket": "$domain_name",
					"region": "ap-southeast-1",
					"acl": "public_read",
					"local_dir": "upload",
					"skip_cleanup": true,
					"on": {
						"branch": "$branch"
					}
				},
				{
					"provider": "s3",
					"access_key_id": "\$AWS_ACCESS_KEY_ID",
					"secret_access_key": "\$AWS_SECRET_ACCESS_KEY",
					"bucket": "$domain_name",
					"region": "ap-southeast-1",
					"acl": "public_read",
					"local_dir": "upload",
					"upload-dir": "swap",
					"skip_cleanup": true,
					"on": {
						"branch": "$branch"
					}
				},
				{
					"provider": "s3",
					"access_key_id": "\$AWS_ACCESS_KEY_ID",
					"secret_access_key": "\$AWS_SECRET_ACCESS_KEY",
					"bucket": "$domain_name",
					"region": "ap-southeast-1",
					"acl": "public_read",
					"local_dir": "upload",
					"upload-dir": "transfer",
					"skip_cleanup": true,
					"on": {
						"branch": "$branch"
					}
				}
			]
		}
	}
}
EOF
)

curl -X POST \
    -H "Content-Type: application/json" \
    -H "Accept: application/json" \
    -H "Travis-API-Version: 3" \
    -H "Authorization: token $4" \
    -d "$body" \
    https://api.travis-ci.com/repo/KyberNetwork%2FKyberSwap/requests
