# KyberNetwork inhouse web wallet
Kyber web wallet helps users to interact directly with KyberNetwork in order to exchange their ethers and tokens.
You can see a walkthrough on Youtube [here](https://www.youtube.com/watch?v=v2bdcChFEuQ).

## Official deployment
We deployed the MVP of the wallet at [https://testnet-wallet.kyber.network](https://testnet-wallet.kyber.network). Any other websites that claims to be Kyber Wallet is fake and might contain malicious script to scam or steal your assets.

## Install dependencies
The wallet is developed on `Nodejs`, we assume users have it installed in their environment. *We suggest to use Node v7.3.0*
```
npm install
```

## Run in development mode
```
npm run dev
```
Once it is running, user can access to the wallet by going to `http://localhost:3000`

## Build production app
```
npm run build
```

## Code structure
This wallet is using `Reactjs` and `Redux` and following their naming conventions. Source code of the wallet is in `src`. Most of the logic is in `src/js`.
