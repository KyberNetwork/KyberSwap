import * as service from "../services/accounts"
import store from "../store"

export function loadAccounts(node) {
  return {
    type: "LOAD_ACCOUNTS",
    payload: service.loadAccounts(node)
  }
}

export function addAccount(address, keystring, name, desc) {
  return {
    type: "NEW_ACCOUNT_ADDED",
    payload: new Promise((resolve, reject) => {
      service.newAccountInstance(
        address, keystring, name, desc, resolve)
    })
  }
}

export function updateAccount(ethereum, account) {
  return {
    type: "UPDATE_ACCOUNT",
    payload: new Promise((resolve, reject) => {
      service.fetchAccount(ethereum, account, resolve)
    })
  }
}

export function incManualNonceAccount(address) {
  return {
    type: "INC_MANUAL_NONCE_ACCOUNT",
    payload: address
  }
}
