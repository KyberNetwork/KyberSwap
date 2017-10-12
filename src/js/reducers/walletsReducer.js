import Wallet from "../services/wallet"
import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'
import WALLET_ACTION from "../constants/walletActions"

const initState = {
  wallets: {},
  newWalletAdding: false,
}

const wallets = (state=initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.payload.wallets) {
        var loadedWallets = action.payload.wallets.wallets
        var wallets = {}
        Object.keys(loadedWallets).forEach((address) => {
          var walletMap = loadedWallets[address]
          var wallet = new Wallet(
            walletMap.address,
            walletMap.ownerAddress,
            walletMap.name,
            walletMap.description,
            walletMap.balance,
            walletMap.tokens,
          )
          var newTokens = {}
          Object.keys(wallet.tokens).forEach((address) => {
            var token = wallet.tokens[address]
            newTokens[token.address] = new Token(
              token.name,
              token.icon,
              token.symbol,
              token.address,
              wallet.address,
              token.balance,
            )
          })
          wallet.tokens = newTokens
          wallets[address] = wallet
        })
        var newState = {...state, wallets: wallets, deleteWallet : action.payload.wallets?action.payload.wallets.deleteWallet:""}
        return newState
      }
      return state
    }
    case WALLET_ACTION.UPDATE_WALLET_FULFILLED: {
      var newWallets = {...state.wallets}
      var newWallet = newWallets[action.payload.address].shallowClone()
      newWallet.balance = action.payload.balance
      newWallet.tokens = action.payload.tokens
      newWallets[newWallet.address] = newWallet
      return {...state, wallets: newWallets}
    }
    case WALLET_ACTION.ADD_DELETE_WALLET: {      
      var address = action.payload      
      return {...state, deleteWallet: address}
    }
    case WALLET_ACTION.DELETE_WALLET: {
      var newWallets = {...state.wallets}
      var address = action.payload
      delete(newWallets[address])
      return {...state, wallets: newWallets}
    }
    case WALLET_ACTION.NEW_WALLET_ADDED_FULFILLED: {
      var newWallets = {...state.wallets}
      newWallets[action.payload.address] = action.payload
      return {...state, newWalletAdding: false, wallets: newWallets}
    }
    case WALLET_ACTION.NEW_WALLET_ADDED_PENDING: {
      return {...state, newWalletAdding: true}
    }
    case "JOIN_PAYMENT_FORM_TX_BROADCAST_PENDING": {
      return {...state, newWalletAdding: true}
    }
    case WALLET_ACTION.MODIFY_WALLET:{
      var newWallets = {...state.wallets}
      var address = action.payload.address
      newWallets[address].name = action.payload.name
      return {...state, wallets: newWallets}
    }
    case WALLET_ACTION.SORT_WALLET_BY_FIELD:{
      var oldWallets = {...state.wallets}
      var order = action.payload.order
      var field = action.payload.field
      var walletArr = []
      Object.keys(oldWallets).map(function(keyName, keyIndex) {
        walletArr.push(oldWallets[keyName])
      })
      if (order === "ASC"){
        walletArr.sort(function(a,b) {return (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0);} );
      }else{
        walletArr.sort(function(a,b) {return (a[field] > b[field]) ? -1 : ((b[field] > a[field]) ? 1 : 0);} );
      }
      var newWallets = {}
      for(var i = 0; i < walletArr.length; i++){
        newWallets[walletArr[i].address] = walletArr[i]
      }
      return {...state, wallets: newWallets}
    }
  }
  return state
}

export default wallets
