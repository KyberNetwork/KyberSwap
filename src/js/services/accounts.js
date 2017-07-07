import Account from "./account"
import Token from "./token"
import SupportedTokens from "./supported_tokens"
import store from "../store"


export function newAccountInstance(address, keystring, name, desc, callback) {
  var account = new Account(address, keystring, name, desc)
  for (var i = 0; i < SupportedTokens.length; i++ ) {
    var tok = SupportedTokens[i];
    account.addToken(
      new Token(tok.name, tok.icon, tok.address, account)
    )
  }
  account.sync(
    store.getState().global.ethereum, callback)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}

export function fetchAccount(ethereum, account, callback) {
  console.log("account: ", account)
  account.sync(ethereum, callback)
}
