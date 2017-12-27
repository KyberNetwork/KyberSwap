import { REHYDRATE } from 'redux-persist/lib/constants'
import Rate from "../services/rate"
import BigNumber from "bignumber.js"
import constants from '../services/constants';

const initState = {
  termOfServiceAccepted: false,
  nodeName: "Infura Kovan",
  nodeURL: "https://kovan.infura.io/0BRKxQ0SFvAxGL72cbXi",
  history: constants.HISTORY_EXCHANGE,
  count: {storageKey: constants.STORAGE_KEY},
  conn_checker: constants.CONNECTION_CHECKER
}

const global = (state = initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.key === "global") {
        if (action.payload && action.payload.history) {
          var history = action.payload.history
          
          // check load from loaclforage or initstate
          if(action.payload.count && action.payload.count.storageKey !== constants.STORAGE_KEY){
            history = constants.HISTORY_EXCHANGE
          } 
          return {...state,
            history: {...history},
            count: {storageKey: constants.STORAGE_KEY}
           }
        }
      }
      return state
    }
    case "GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED": {
      var history = { ...state.history }
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
    case "GLOBAL.UPDATE_HISTORY_EXCHANGE": {
      var history = { ...state.history }
      const { ethereum, page, itemPerPage, isAutoFetch } = action.payload
      if (!isAutoFetch) {
        history.isFetching = true
      }
      return Object.assign({}, state, { history: history })
      break
    }
    case "GLOBAL.UPDATE_HISTORY": {
      const { logs, latestBlock, page, isAutoFetch } = action.payload
      var history = { ...state.history }
      if(logs){        
        if(logs.events) history.logs = logs.events
        //if(logs.eth) history.logsEth = logs.eth
        //if(logs.token) history.logsToken = logs.token
      }
      history.currentBlock = latestBlock
      history.page = page
      // history.eventsCount = eventsCount
      history.isFetching = false
      return { ...state,  history: {...history} }
    }
    case "GLOBAL.CONNECTION_UPDATE_IS_CHECK":{
      var conn_checker = { ...state.conn_checker }
      conn_checker.isCheck = action.payload
      return Object.assign({}, state, { conn_checker: conn_checker })
    }
    case "GLOBAL.CONNECTION_UPDATE_COUNT":{
      var conn_checker = { ...state.conn_checker }
      conn_checker.count = action.payload
      return Object.assign({}, state, { conn_checker: conn_checker })
    }
  }
  return state
}

export default global
