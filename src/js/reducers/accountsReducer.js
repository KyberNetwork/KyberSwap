import Account from "../services/account"
import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'


const initState = {
  accounts: {},
  newAccountAdding: false,
}

const accounts = (state=initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.payload.accounts) {
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
            accMap.manualNonce,
            accMap.joined,
            accMap.wallet,
            accMap.walletCreationTx,
          )
          var newTokens = {}
          Object.keys(acc.tokens).forEach((address) => {
            var token = acc.tokens[address]
            newTokens[token.address] = new Token(
              token.name,
              token.icon,
              token.symbol,
              token.address,
              acc.address,
              token.balance,
            )
          })
          acc.tokens = newTokens
          accounts[address] = acc
        })
        var newState = {...state, accounts: accounts}
        return newState
      }
      return state
    }
    case "JOINING_KYBER_WALLET": {
      var newAccounts = {...state.accounts}
      var newAcc = newAccounts[action.payload.account.address].shallowClone()
      newAcc.walletCreationTx = action.payload.hash
      newAccounts[newAcc.address] = newAcc
      return {...state, accounts: newAccounts}
    }
    case "JOINED_KYBER_WALLET": {
      var newAccounts = {...state.accounts}
      var newAcc = newAccounts[action.payload.address].shallowClone()
      newAcc.wallet = action.payload.contractAddress
      newAcc.joined = true
      newAccounts[newAcc.address] = newAcc
      return {...state, accounts: newAccounts}
    }
    case "LOAD_ACCOUNTS": {
      return {...state, accounts: action.payload}
    }
    case "UPDATE_ACCOUNT_FULFILLED": {
      var newAccounts = {...state.accounts}
      var newAcc = newAccounts[action.payload.address].shallowClone()
      newAcc.balance = action.payload.balance
      newAcc.nonce = action.payload.nonce
      newAcc.manualNonce = action.payload.manualNonce
      newAcc.tokens = action.payload.tokens
      newAccounts[newAcc.address] = newAcc
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
    case "DELETE_ACCOUNT": {
      var newAccounts = {...state.accounts}
      var address = action.payload
      delete(newAccounts[address])
      return {...state, accounts: newAccounts}
    }
    case "NEW_ACCOUNT_ADDED_FULFILLED": {
      var newAccounts = {...state.accounts}
      newAccounts[action.payload.address] = action.payload
      return {...state, newAccountAdding: false, accounts: newAccounts}
    }
    case "NEW_ACCOUNT_ADDED_PENDING": {
      return {...state, newAccountAdding: true}
    }
  }
  return state
}

export default accounts
