import { REHYDRATE } from 'redux-persist/lib/constants'
import Rate from "../services/rate"
import BigNumber from "bignumber.js"
import  constants  from '../services/constants';

const initState = {
  currentBlock: 0,
  connected: true,
  termOfServiceAccepted: false,
  nodeName: "Infura Kovan",
  nodeURL: "https://kovan.infura.io/0BRKxQ0SFvAxGL72cbXi",
  history: constants.HISTORY_EXCHANGE
}

const global = (state = initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if(action.key === "global"){
        if(action.payload && action.payload.history){
          return action.payload
        }        
      }      
      return state
    }
    case "GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED": {
      var history = {...state}.history
      history.currentBlock = action.payload 
      return { ...state, history: history }
    }
    case "GLOBAL.GET_NEW_BLOCK_FAILED": {
      return { ...state, connected: false }
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
    case "GLOBAL.SET_SHOW_HISTORY":{
      const { fromBlock, toBlock, logs } = action.payload
      var history = {...state}.history
      history.showedLogs.fromBlock = fromBlock
      history.showedLogs.toBlock = toBlock
      history.showedLogs.logs = logs.reverse()
      return {...state, history: history}  
    }
    case "GLOBAL.UPDATE_HISTORY":{
      const {logs, toBlock, isFirstPage} = action.payload
      var history = {...state}.history
      history.toBlock = toBlock
      history.fromBlock = toBlock - history.range
      history.isFirstPage = isFirstPage

      var showedLogs = []
      for (var i = logs.length - 1; i >= 0; i--){
        showedLogs.push({
          actualDestAmount: logs[i].returnValues.actualDestAmount,
          actualSrcAmount: logs[i].returnValues.actualSrcAmount,
          dest: logs[i].returnValues.dest.toLowerCase(),
          source: logs[i].returnValues.source.toLowerCase(),
          sender: logs[i].returnValues.sender.toLowerCase(),
          blockNumber:logs[i].blockNumber,
          txHash: logs[i].transactionHash,
          status: logs[i].type
        })
      }
      history.logs = showedLogs
      return {...state, history: history}      
    }
  }
  return state
}

export default global
