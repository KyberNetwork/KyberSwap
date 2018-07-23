import Account from "./account"

export function newAccountInstance(address, type, keystring, ethereum, walletType) {
  var account = new Account(address, type, keystring, walletType)
  return account.sync(ethereum, account)
}

export function loadAccounts(node) {
  var accounts = {};

  return accounts;
}