import {REHYDRATE} from 'redux-persist/lib/constants'
import Tx from "../services/tx"

const initState = {
}

const txs = (state=initState, action) => {
  switch (action.type) {
    // case REHYDRATE: {
    //   var loadedTxs = {...state.txs}
    //   if (loadedTxs) {
    //     var txs = {}
    //     Object.keys(loadedTxs).forEach((hash) => {
    //       var tx = loadedTxs[hash]
    //       txs[hash] = new Tx(
    //         tx.hash,
    //         tx.from,
    //         tx.gas,
    //         tx.gasPrice,
    //         tx.nonce,
    //         tx.status,
    //         tx.type,
    //         tx.data,
    //         tx.address,
    //         tx.threw,
    //         tx.error,
    //         tx.errorInfo,
    //         tx.recap
    //       )
    //     })
    //     return txs
    //   } else {
    //     return state
    //   }
    // }
    case "TX.TX_ADDED": {
      var newState = {...state}
      newState[action.payload.hash] = action.payload
      return newState
    }
    case "TX.UPDATE_TX_FULFILLED": {
      var newState = {...state}
      if (newState[action.payload.hash]){
        newState[action.payload.hash] = action.payload
      }      
      return newState
    }
    case "TX.CLEAR": {
      var loadedTxs = {...state}
      if (loadedTxs) {
        var txs = {}
        Object.keys(loadedTxs).forEach((hash) => {
          var tx = loadedTxs[hash]
          if(tx.status == "pending"){
            txs[hash] = loadedTxs[hash]
          }
        })
        return txs
      } else {
        return state
      }
    }
  }
  return state
}

export default txs
