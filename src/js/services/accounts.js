import Account from "./account"
import Wallet from "./wallet"
//import Token from "./token"
//import SupportedTokens from "./supported_tokens"
import store from "../store"

export function newWalletInstance(address, ownerAddress, name, desc, callback) {
  var wallet = new Wallet(address, ownerAddress, name, desc)  
  return wallet.sync(
    store.getState().connection.ethereum, callback)
}

export function newAccountInstance(address, keystring, name, desc) {
  var account = new Account(address, keystring, name, desc)  
  return account.sync(
    store.getState().connection.ethereum)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}
