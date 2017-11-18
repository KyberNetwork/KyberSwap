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
  history:{
    startBlock: 0,
    endBlock: 0,
    logs: []
  }
}

const global = (state = initState, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if(action.type === "global"){
        var payload = action.payload
        return payload
      }      
      return state
    }
    case "GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED": {
      return { ...state, currentBlock: action.payload }
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
    case "GLOBAL.UPDATE_HISTORY":{
      const {logs, latestBlock} = action.payload
      var history = {...state}.history
      //pop
      history.endBlock = latestBlock
      history.startBlock = latestBlock - constants.HISTORY_BLOCK_RANGE
      for(var  i = 0; i < (history.logs.length); i++){
        if(history.logs[i].blockNumber > history.startBlock){
          break
        }
      }
      history.logs.slice(i)
      //append
      for (let value of logs) {
        history.logs.push({
          actualDestAmount: value.returnValues.actualDestAmount,
          actualSrcAmount: value.returnValues.actualSrcAmount,
          dest: value.returnValues.dest.toLowerCase(),
          source: value.returnValues.source.toLowerCase(),
          sender: value.returnValues.sender.toLowerCase(),
          blockNumber:value.blockNumber,
          txHash: value.transactionHash,
          status: value.type
        })
      }
      return {...state, history: history}      
    }
  }
  return state
}

export default global
