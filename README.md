# KyberSwap: Instantly Convert Your Tokens

KyberSwap allows users to directly interact with Kyber's decentralized liquidity network and instantly swap/ trade their tokens. Check our website at https://kyberswap.com

## Install dependencies

The wallet is developed on `Nodejs`, we assume users have it installed in their environment. _We suggest to use Node v7.3.0_

```
npm install
```

## Run in development mode (ropsten network)

```
npm run ropsten
```

Once it is running, user can access to the wallet by going to `http://localhost:3002`

## Build production app

```
npm run build-production
```

## Code structure

This repository is using `Reactjs` and `Redux` and following their naming conventions. Source code of the wallet is in `src`. Most of the logic is in `src/js`.

## Migrate media data
```
bundle exec rake master_data:media_post
```

## Deploy staging:
```
git tag -f deploy_staging
git push -f <origin/upstream> deploy_staging
```
