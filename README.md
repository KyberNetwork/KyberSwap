# KyberSwap: Instantly Convert Your Tokens
KyberSwap allows users to directly interact with Kyber's decentralized liquidity network and instantly swap/ trade their tokens.
You can see a walkthrough on Youtube [here](https://www.youtube.com/watch?v=v2bdcChFEuQ).

## Live deployment
We deployed the [Testnet version](https://github.com/KyberNetwork/KyberWallet/releases/tag/v0.1.0) of the wallet at [https://ropsten.kyber.network/](https://ropsten.kyber.network/). Any other websites that claims to be Kyber Swap is fake and might contain malicious scripts to scam or steal your assets.

## Install dependencies
The wallet is developed on `Nodejs`, we assume users have it installed in their environment. *We suggest to use Node v7.3.0*
```
npm install
npm install web3@1.0.0-beta.18 
```
We have the second install command due to web3 is unstable now

## Run in development mode (kovan chain)
```
npm run dev
```
Or
```
npm run kovan
```
Once it is running, user can access to the wallet by going to `http://localhost:3000`

## For server side to cache rate and history of KyberSwap
 ```
npm run server --chain=[option_chain] --port=[option_port]  --init=[option_delete_db]
```

Option_chain default is kovan, option_port default is 3001, option_delete_db default is false .

After running server, please edit history_enpoint in /env/config-env/kovan.json. For example: `http:localhost:3001`

You can also run cached server with docker
```
docker build . -t kyber/server
docker run -p 3001:3001 kyber/server
```


## Build production app
```
npm run build-mainnet
```

## Code structure
This repository is using `Reactjs` and `Redux` and following their naming conventions. Source code of the wallet is in `src`. Most of the logic is in `src/js`.

## Migrate media data
```
bundle exec rake master_data:media_post
```