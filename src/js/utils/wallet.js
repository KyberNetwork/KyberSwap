

import * as converters from "./converter"

export function getWalletId(walletType, blockNo){
    switch(walletType){
        case "cipher":
          return converters.numberToHexAddress(blockNo)
          break
        case "trust":
          return "0xf1aa99c69715f423086008eb9d06dc1e35cc504d"
          break
        case "kyber":
          return converters.numberToHexAddress(blockNo)
          break
        default:
          return converters.numberToHexAddress(blockNo)
          break
      }
}