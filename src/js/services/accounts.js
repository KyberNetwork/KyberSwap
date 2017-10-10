import Account from "./account"
import Wallet from "./wallet"
import Token from "./token"
import SupportedTokens from "./supported_tokens"
import store from "../store"

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

// export function newAccountInstance(address, keystring, name, desc, callback) {
//   var account = new Account(address, keystring, name, desc)
//   for (var i = 0; i < SupportedTokens.length; i++ ) {
//     var tok = SupportedTokens[i];
//     account.addToken(
//       new Token(tok.name, tok.icon, tok.symbol, tok.address, account.address)
//     )
//   }
//   account.sync(
//     store.getState().connection.ethereum, callback)
// }
export function newAccountInstance(address, keystring, name, desc) {
  var account = new Account(address, keystring, name, desc)
  for (var i = 0; i < SupportedTokens.length; i++ ) {
    var tok = SupportedTokens[i];
    account.addToken(
      new Token(tok.name, tok.icon, tok.symbol, tok.address, account.address)
    )
  }
  return account.syncAccount(
    store.getState().connection.ethereum)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}
