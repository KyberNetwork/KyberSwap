import Wallet from "../services/wallet"
import Token from "../services/token"
import {REHYDRATE} from 'redux-persist/constants'


const initState = {
  wallets: {},
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
        var newState = {...state, wallets: wallets}
        return newState
      }
      return state
    }
    case "UPDATE_WALLET_FULFILLED": {
      var newWallets = {...state.wallets}
      var newWallet = newWallets[action.payload.address].shallowClone()
      newWallet.balance = action.payload.balance
      newWallet.tokens = action.payload.tokens
      newWallets[newWallet.address] = newWallet
      return {...state, wallets: newWallets}
    }
    case "DELETE_WALLET": {    
      var newWallets = {...state.wallets}
      var address = action.payload          
      delete(newWallets[address])      
      return {...state, wallets: newWallets}
    }
    case "NEW_WALLET_ADDED_FULFILLED": {
      var newWallets = {...state.wallets}
      newWallets[action.payload.address] = action.payload
      return {...state, newWalletAdding: false, wallets: newWallets}
    }
    case "NEW_WALLET_ADDED_PENDING": {
      return {...state, newWalletAdding: true}
    }
  }
  return state
}

export default wallets
