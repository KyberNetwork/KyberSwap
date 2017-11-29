import { REHYDRATE } from 'redux-persist/lib/constants'
import Rate from "../services/rate"
import BigNumber from "bignumber.js"
import  constants  from '../services/constants';

const initState = {
  termOfServiceAccepted: false,
  nodeName: "Infura Kovan",
  nodeURL: "https://kovan.infura.io/0BRKxQ0SFvAxGL72cbXi",
  history: constants.HISTORY_EXCHANGE
}

const global = (state = initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.key === "global") {
        if(action.payload && action.payload.history){
          var history = action.payload.history
          history.isFetching = false
          return Object.assign({}, state, { history: history })
        }
      }
      return state
    }
    case "GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED": {
      var history = {...state.history}
      history.currentBlock = action.payload 
      return Object.assign({}, state, { history: history })
    }
    case "GLOBAL.TERM_OF_SERVICE_ACCEPTED": {
      return { ...state, termOfServiceAccepted: true }
    }
    case "GLOBAL.IDLE_MODE": {
      return { ...state, idleMode: true }
    }
    case "GLOBAL.EXIT_IDLE_MODE": {
      return { ...state, idleMode: false }
    }
    case "GLOBAL.UPDATE_HISTORY_EXCHANGE":{
      var history = {...state.history}
      history.isFetching = true
      return Object.assign({}, state, { history: history })
      break
    }
    case "GLOBAL.UPDATE_HISTORY":{
      const {logs, latestBlock, page, eventsCount} = action.payload
      var history = {...state.history}
      history.logs = logs
      history.currentBlock = latestBlock
      history.page = page
      history.eventsCount = eventsCount
      history.isFetching = false
      return Object.assign({}, state, { history: history })
    }
  }
  return state
}

export default global
