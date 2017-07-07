import * as service from "../services/accounts"
import * as ethUtil from "ethereumjs-util"

const initState = {
  accounts: {},
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const accounts = (state=initState, action) => {
  switch (action.type) {
    case "LOAD_ACCOUNTS": {
      return {...state, accounts: action.payload}
    }
    case "UPDATE_ACCOUNT_FULFILLED": {
      var newAccounts = {...state.accounts}
      newAccounts[action.payload.address] = action.payload
      return {...state, accounts: newAccounts}
    }
    case "INC_MANUAL_NONCE_ACCOUNT": {
      var newAccounts = {...state.accounts}
      var address = action.payload
      var account = newAccounts[address]
      account = account.incManualNonce()
      newAccounts[address] = account
      return {...state,
        accounts: newAccounts}
    }
    case "NEW_ACCOUNT_ADDED_FULFILLED": {
      var newAccounts = {...state.accounts}
      newAccounts[action.payload.address] = action.payload
      return {...state, accounts: newAccounts}
    }
  }
  return state;
}

export default accounts;
