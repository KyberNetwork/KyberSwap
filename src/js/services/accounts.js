import Account from "./account"
import Wallet from "./wallet"
import Token from "./token"
import SupportedTokens from "./supported_tokens"
import store from "../store"
import { addressFromKey } from "../utils/keys"

export function newWalletInstance(address, ownerAddress, name, desc, callback) {
  var wallet = new Wallet(address, ownerAddress, name, desc)
  for (var i = 0; i < SupportedTokens.length; i++ ) {
    var tok = SupportedTokens[i];
    wallet.addToken(
      new Token(tok.name, tok.icon, tok.symbol, tok.address, address)
    )
  }
  wallet.sync(
    store.getState().connection.ethereum, callback)
}

export function newAccountInstance(address, keystring, name, desc, callback) {
  var account = new Account(address, keystring, name, desc)
  for (var i = 0; i < SupportedTokens.length; i++ ) {
    var tok = SupportedTokens[i];
    account.addToken(
      new Token(tok.name, tok.icon, tok.symbol, tok.address, account.address)
    )
  }
  account.sync(
    store.getState().connection.ethereum, callback)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}


export function createKeyStore(passphrase, name, desc, ethereum, callback) {
    var promise
    promise = new Promise((resolve, reject) => {
      var keyString =JSON.stringify(ethereum.createNewAddress(passphrase))     
      resolve(keyString)
    })

    promise.then((keyString) => {
      console.log(keyString)
      var address = addressFromKey(keyString)    
      newAccountInstance(address, keyString, name, desc, callback)        

    })
  }
