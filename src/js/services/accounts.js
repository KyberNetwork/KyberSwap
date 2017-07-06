import Account from "./account"
import Token from "./token"
import SupportedTokens from "./supported_tokens"
import store from "../store"

const defaultAccount = "0x001aDBc838eDe392B5B054A47f8B8c28f2fA9F3F";
const defaultName = "test account";
const defaultDesc = "test account description for kyber";

export function updateAccounts(accounts) {
  var newAccounts = {};
  Object.keys(accounts).forEach((key) => {
    newAccounts[key] = accounts[key].sync(store.getState().global.ethereum)
  })
  return newAccounts;
}

export function newAccountInstance(address, keystring, name, desc) {
  var account = new Account(address, keystring, name, desc)
  for (var i = 0; i < SupportedTokens.length; i++ ) {
    var tok = SupportedTokens[i];
    account.addToken(
      new Token(tok.name, tok.icon, tok.address, account)
    )
  }
  return account.sync(store.getState().global.ethereum)
}

export function loadAccounts(node) {
  var accounts = {};
  // var account = new Account(
  //   node, defaultAccount, defaultName, defaultDesc);

  return accounts;
}
