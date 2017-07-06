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
    case "UPDATE_ACCOUNTS": {
      var newAccounts = service.updateAccounts(state.accounts);
      return {...state,
        accounts: newAccounts}
    }
    case "UPDATE_ACCOUNT": {
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
    case "NEW_ACCOUNT_ADDED": {
      var newAccount = service.newAccountInstance(
        action.payload.address, action.payload.keystring,
        action.payload.name, action.payload.desc
      )
      var newAccounts = {...state.accounts}
      newAccounts[action.payload.address] = newAccount
      return {...state, accounts: newAccounts}
    }
  }
  return state;
}

export default accounts;
