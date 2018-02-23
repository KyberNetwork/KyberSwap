# 0.4.2 (2018-02-23)
## Features:
- Add block in trade transaction

## Bugfixes:
- Add timeout in fetching rate and gas
- Remove confirm message in private key
- Allow user import private key with 0x prefix
- Fix display recent trades when cannot get rateUSD

## Improvements:
- Show multi errors when user input source amount
- Improve display errors in metamask

# 0.4.1 (2018-02-19)
## Features:
- List more 4 tokens (eng, salt, appc, rdn)

## Compatability:
- This version works with KyberNetwork smart contracts version 0.4.0 (Kovan and Mainnet)

# 0.4.0 (2018-02-07)

## Features: 
- Integrate with new APIs from new cache server 
- Add fetching multi nodes, fall back to backup node when a node is unavailable
- Broadcast transaction to multi node

## Bugfixes:
- Prevent approve twice when user first exchange from token to eth
- Fix handle input errors in exchange screen
- Prevent user exchange when rate is set 0
- Prevent browser save private key, password

## Improvements:
- Allow user re-check reason a transaction failed in notification
- Improve tooltips, languages
- Optimize build, remove console.log, comment.

## Compatability:
- This version works with KyberNetwork smart contracts version 0.4.0 (Kovan and Mainnet)

