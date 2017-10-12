import {REHYDRATE} from 'redux-persist/constants'
import Tx from "../services/tx"
import TX from "../constants/txActions"

const initState = {
}

const txs = (state=initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      var loadedTxs = action.payload.txs
      if (loadedTxs) {
        var txs = {}
        Object.keys(loadedTxs).forEach((hash) => {
          var tx = loadedTxs[hash]
          txs[hash] = new Tx(
            tx.hash,
            tx.from,
            tx.gas,
            tx.gasPrice,
            tx.nonce,
            tx.status,
            tx.type,
            tx.data,
            tx.address,
            tx.threw,
            tx.error,
            tx.errorInfo,
          )
        })
        return txs
      }
      return state
    }
    case TX.TX_ADDED: {
      var newState = {...state}
      newState[action.payload.hash] = action.payload
      return newState
    }
    case TX.UPDATE_TX_FULFILLED: {
      var newState = {...state}
      newState[action.payload.hash] = action.payload
      return newState
    }
  }
  return state
}

export default txs
