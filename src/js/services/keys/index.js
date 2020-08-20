export { default as KeyStore } from './keystore.js'
export { default as PrivateKey } from './privateKey.js'
export { default as Trezor } from './trezor.js'
export { default as Ledger } from './ledger.js'
export { default as WalletLinkKey } from './walletlink.js'
export { default as WalletConnectKey } from './walletconnect.js'
export { default as Metamask } from './metamask.js'
export { default as TorusWallet } from './TorusWallet.js'

import * as keys from "../keys"

export function getWallet(type) {
  let keyService;
  
  switch (type) {
    case "keystore":
      keyService = new keys.KeyStore();
      break;
    case "privateKey":
    case "promo":
      keyService = new keys.PrivateKey();
      break;
    case "trezor":
      keyService = new keys.Trezor();
      break;
    case "ledger":
      keyService = new keys.Ledger();
      break;
    case "metamask":
      keyService = new keys.Metamask();
      break;
    case "walletlink":
      keyService = new keys.WalletLinkKey();
      break;
    case "walletconnect":
      keyService = new keys.WalletConnectKey();
      break;
    case "torus":
      keyService = new keys.TorusWallet();
      break;
    default:
      keyService = new keys.KeyStore();
      break
  }
  
  return keyService
}
