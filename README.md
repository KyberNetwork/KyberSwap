# KyberNetwork inhouse web wallet
Kyber web wallet helps users to interact directly with KyberNetwork in order to exchange their ethers and tokens.
You can see a walkthrough on Youtube [here](https://www.youtube.com/watch?v=v2bdcChFEuQ).

## Live deployment
We deployed the [MVP](https://github.com/KyberNetwork/KyberWallet/releases/tag/MVP) of the wallet at [https://testnet-wallet.kyber.network](https://testnet-wallet.kyber.network). Any other websites that claims to be Kyber Wallet is fake and might contain malicious scripts to scam or steal your assets.

## Install dependencies
The wallet is developed on `Nodejs`, we assume users have it installed in their environment. *We suggest to use Node v7.3.0*
```
npm install
```

## Run in development mode (kovan chain)
```
npm run dev
```
Or
```
npm run kovan
```
Once it is running, user can access to the wallet by going to `http://localhost:3000`

## For server side to cach rate and history of exchange
 ```
npm run server --chain=[option_chain] --port=[option_port] 
```

Option_chain default is kovan, option_port default is 3001. 
After running server, please edit history_enpoint in /env/config-env/kovan.json. For example: `http:localhost:3001`
## Build production app
```
npm run build
```

## Code structure
This wallet is using `Reactjs` and `Redux` and following their naming conventions. Source code of the wallet is in `src`. Most of the logic is in `src/js`.


