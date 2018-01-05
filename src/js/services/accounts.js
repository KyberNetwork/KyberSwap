import Account from "./account"

export function newAccountInstance(address, type, keystring, avatar, ethereum) {
  var account = new Account(address, type, keystring,0 ,0 ,0, avatar)
  return account.sync(ethereum, account)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}