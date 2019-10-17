import { fork, call, put, join, race, cancel } from 'redux-saga/effects'
import { delay } from 'redux-saga'
import * as constants from "../services/constants"

import * as converters from "../utils/converter"
import { store } from '../store'

export function* handleRequest(sendRequest, ...args) {

    //check how much connection
    var state = store.getState()
    var ethereum = state.connection.ethereum
    var numProvider = ethereum.getNumProvider()    

	const task = yield fork(sendRequest, ...args)

	const { res, timeout } = yield race({
		res: join(task),
		timeout: call(delay, numProvider * constants.CONNECTION_TIMEOUT)
    })
        
	if (timeout) {     
        //console.log("timeout")
        yield cancel(task)
        return {status: "timeout"}   
    }

    if (res.status === "success"){
        return { status: "success", data: res.res }    
    }else{
        return { status: "fail", data: res.err }    
    }
}



export function* getSourceAmount(sourceTokenSymbol, sourceAmount, destTokenSymbol = null) {
    var state = store.getState()
    var tokens = state.tokens.tokens
  
    var sourceAmountHex = "0x0"
    if (tokens[sourceTokenSymbol]) {
      var decimals = tokens[sourceTokenSymbol].decimals
      var rateSell = tokens[sourceTokenSymbol].rate
      sourceAmountHex = converters.calculateMinSource(sourceTokenSymbol, sourceAmount, decimals, rateSell, destTokenSymbol)
    } else {
      sourceAmountHex = converters.stringToHex(sourceAmount, 18)
    }
    return sourceAmountHex
  }
  
  export function getSourceAmountZero(sourceTokenSymbol, destTokenSymbol) {
    var state = store.getState()
    var tokens = state.tokens.tokens
    var sourceAmountHex = "0x0"
    if (tokens[sourceTokenSymbol]) {
      var decimals = tokens[sourceTokenSymbol].decimals
      var rateSell = tokens[sourceTokenSymbol].rate
      sourceAmountHex = converters.toHex(converters.getSourceAmountZero(sourceTokenSymbol, decimals, rateSell, destTokenSymbol))
    }
    return sourceAmountHex
  }

export function* checkTxMined(ethereum, txHash, latestBlock, tradeTopic) {
  try {
    const receipt = yield call([ethereum, ethereum.call], 'txMined', txHash);
    if (!receipt) return false;

    const logs = receipt.logs;
    const blockNumber = receipt.blockNumber;
    let isTopicValid = false;

    if (!blockNumber || blockNumber > latestBlock) return false;

    if (!logs.length) return false;

    for (var i = 0; i < logs.length; ++i) {
      if (logs[i].topics[0].toLowerCase() === tradeTopic.toLowerCase()) {
        isTopicValid = true;
        break;
      }
    }
    console.log(receipt)
    console.log(isTopicValid)
    return isTopicValid;
  } catch (e) {
    console.log(e);
    return false;
  }
}
