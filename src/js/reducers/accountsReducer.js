import * as service from "../services/accounts"
import * as ethUtil from "ethereumjs-util"
import Account from "../services/account"
import Token from "../services/token"
import BigNumber from "bignumber.js"
import {REHYDRATE} from 'redux-persist/constants'


const initState = {
  accounts: {},
}

const accounts = (state=initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      var loadedAccounts = action.payload.accounts.accounts
      var accounts = {}
      Object.keys(loadedAccounts).forEach((address) => {
        var accMap = loadedAccounts[address]
        console.log(accMap)
        var acc = new Account(
          accMap.address,
          accMap.key,
          accMap.name,
          accMap.description,
          accMap.balance,
          accMap.nonce,
          accMap.tokens,
          accMap.manualNonce
        )
        var newTokens = {}
        Object.keys(acc.tokens).forEach((address) => {
          var token = acc.tokens[address]
          newTokens[token.address] = new Token(
            token.name,
            token.icon,
            token.address,
            acc,
            token.balance,
          )
        })
        acc.tokens = newTokens
        accounts[address] = acc
      })
      var newState = {...state, accounts: accounts}
      return newState
    }
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
