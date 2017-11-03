import Account from "./account"
import store from "../store"

export function newAccountInstance(address, type, keystring, avatar) {
  var account = new Account(address, type, keystring,0 ,0 ,0, avatar)  
  return account.sync(
    store.getState().connection.ethereum)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}
