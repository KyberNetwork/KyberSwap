#!/bin/bash

print_usage() {
    cat <<EOF
Usage: You need to include all 4 argument -b, -e, -d, -s
    -h, --help: print this message
    -b, --branch: deployment branch
    -e, --env: deployment environment
    -d, --domain: domain name and AWS S3 bucket name
    -s, --secret: secret travis-ci api token
EOF
}

if (( $# != 8 )) && (( $# != 1 )) ; then
    echo "The number of flags must be exactly 4 including: -b, -e, -d, -s"
    print_usage
    exit 1
fi

while [[ $# -gt 0 ]]
do
key="$1"

case $key in
    -h|--help)
    print_usage
    exit 0
    ;;
    -b|--branch)
    branch="$2"
    shift # past argument
    shift # past value
    ;;
    -e|--env)
    build_env="$2"
    shift # past argument
    shift # past value
    ;;
    -d|--domain)
    domain_name="$2"
    shift # past argument
    shift # past value
    ;;
    -s|--secret)
    secret_token="$2"
    shift # past argument
    shift # past value
    ;;
    *)    # unknown option
    echo "Invalid option: $1 $2"
    print_usage
    exit 1
    ;;
esac
done

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
    -H "Authorization: token $secret_token" \
    -d "$body" \
    https://api.travis-ci.com/repo/KyberNetwork%2FKyberSwap/requests
