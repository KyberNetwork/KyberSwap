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
    payload: {address, keystring, name, desc}
  }
}

export function updateAccounts() {
  return {
    type: "UPDATE_ACCOUNTS"
  }
}

export function updateAccount(address, leastNonce) {
  var state = store.getState()
  var account = state.accounts.accounts[address]
  account = account.sync(state.global.ethereum)
  return {
    type: "UPDATE_ACCOUNT",
    payload: account
  }
}

export function incManualNonceAccount(address) {
  return {
    type: "INC_MANUAL_NONCE_ACCOUNT",
    payload: address
  }
}
