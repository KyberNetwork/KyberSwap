import Account from "../services/account"
import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'
import ACC_ACTION from "../constants/accActions"

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
        var newState = {...state, accounts: accounts, deleteAccount : action.payload.accounts?action.payload.accounts.deleteAccount:""}
        return newState
      }
      return state
    }
    case ACC_ACTION.JOINING_KYBER_WALLET: {
      var newAccounts = {...state.accounts}
      var newAcc = newAccounts[action.payload.account.address].shallowClone()
      newAcc.walletCreationTx = action.payload.hash
      newAccounts[newAcc.address] = newAcc
      return {...state, accounts: newAccounts}
    }
    case ACC_ACTION.JOINED_KYBER_WALLET: {
      var newAccounts = {...state.accounts}
      var newAcc = newAccounts[action.payload.address].shallowClone()
      newAcc.wallet = action.payload.contractAddress
      newAcc.joined = true
      newAccounts[newAcc.address] = newAcc
      return {...state, accounts: newAccounts}
    }
    case ACC_ACTION.LOAD_ACCOUNTS: {
      return {...state, accounts: action.payload}
    }
    case ACC_ACTION.UPDATE_ACCOUNT_FULFILLED: {
      var newAccounts = {...state.accounts}
      var newAcc = newAccounts[action.payload.address].shallowClone()
      newAcc.balance = action.payload.balance
      newAcc.nonce = action.payload.nonce
      newAcc.manualNonce = action.payload.manualNonce
      newAcc.tokens = action.payload.tokens
      newAccounts[newAcc.address] = newAcc
      return {...state, accounts: newAccounts}
    }
    case ACC_ACTION.INC_MANUAL_NONCE_ACCOUNT: {
      var newAccounts = {...state.accounts}
      var address = action.payload
      var account = newAccounts[address]
      account = account.incManualNonce()
      newAccounts[address] = account
      return {...state,
        accounts: newAccounts}
    }
    case ACC_ACTION.DELETE_ACCOUNT: {
      var newAccounts = {...state.accounts}
      var address = action.payload
      delete(newAccounts[address])
      return {...state, accounts: newAccounts}
    }
    case ACC_ACTION.ADD_DELETE_ACCOUNT: {      
      var address = action.payload      
      return {...state, deleteAccount: address}
    }
    case ACC_ACTION.NEW_ACCOUNT_CREATED_FULFILLED: {
      var newAccounts = {...state.accounts}
      var newAddedAcc = {}
      newAddedAcc[action.payload.address] = action.payload       
      Object.assign(newAddedAcc, newAccounts);      
      return {...state, newAccountCreating: false, accounts: newAddedAcc}
    }
    case ACC_ACTION.NEW_ACCOUNT_CREATED_PENDING: {
      return {...state, newAccountCreating: true}
    }
    case ACC_ACTION.NEW_ACCOUNT_ADDED_FULFILLED: {
      var newAccounts = {...state.accounts}
      if(newAccounts[action.payload.address]){
        newAccounts[action.payload.address] = action.payload  
        return {...state, newAccountAdding: false, accounts: newAccounts}
      }else{
        var newAddedAcc = {}
        newAddedAcc[action.payload.address] = action.payload       
        Object.assign(newAddedAcc, newAccounts);      
        return {...state, newAccountAdding: false, accounts: newAddedAcc}
      }            
    }
    case ACC_ACTION.NEW_ACCOUNT_ADDED_PENDING: {
      return {...state, newAccountAdding: true}
    }
    // case ACC_ACTION.CREATE_NEW_ACCOUNT_FULFILLED:{
    //   var newAccounts = {...state.accounts}
    //   newAccounts[action.payload.address] = action.payload
    //   return {...state, newAccountAdding: false, accounts: newAccounts}
    // }
    // case ACC_ACTION.CREATE_NEW_ACCOUNT_PENDING:{
    //   return {...state, newAccountAdding: true} 
    // }
    case ACC_ACTION.MODIFY_ACCOUNT:{
      var newAccounts = {...state.accounts}
      var address = action.payload.address
      newAccounts[address].name = action.payload.name
      return {...state, accounts: newAccounts}
    }
    case ACC_ACTION.SORT_ACCOUNT_BY_FIELD:{
      var oldAccounts = {...state.accounts}
      var order = action.payload.order
      var field = action.payload.field
      var accountArr = []
      Object.keys(oldAccounts).map(function(keyName, keyIndex) {
        accountArr.push(oldAccounts[keyName])
      })
      if (order === "ASC"){
        accountArr.sort(function(a,b) {return (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0);} );
      }else{
        accountArr.sort(function(a,b) {return (a[field] > b[field]) ? -1 : ((b[field] > a[field]) ? 1 : 0);} );
      }
      var newAccounts = {}
      for(var i = 0; i < accountArr.length; i++){
        newAccounts[accountArr[i].address] = accountArr[i]
      }
      return {...state, accounts: newAccounts}
    }
  }
  return state
}

export default accounts
