import Account from "./account"

export function newAccountInstance(address, type, keystring, ethereum) {
  var account = new Account(address, type, keystring)
  return account.sync(ethereum, account)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}