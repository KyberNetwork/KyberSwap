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
   // return { status: "success", data: res }

    // console.log(res)
	// if (res.err) {
    //     return new Promise(resolve => {
    //         resolve ({
    //             status: "error",
    //             data: res.err
    //         })
    //     })
	// }
}



export function* getSourceAmount(sourceTokenSymbol, sourceAmount) {
    var state = store.getState()
    var tokens = state.tokens.tokens
  
    var sourceAmountHex = "0x0"
    if (tokens[sourceTokenSymbol]) {
      var decimals = tokens[sourceTokenSymbol].decimals
      var rateSell = tokens[sourceTokenSymbol].rate
      sourceAmountHex = converters.calculateMinSource(sourceTokenSymbol, sourceAmount, decimals, rateSell)
    } else {
      sourceAmountHex = converters.stringToHex(sourceAmount, 18)
    }
    return sourceAmountHex
  }
  
  export function getSourceAmountZero(sourceTokenSymbol) {
    var state = store.getState()
    var tokens = state.tokens.tokens
    var sourceAmountHex = "0x0"
    if (tokens[sourceTokenSymbol]) {
      var decimals = tokens[sourceTokenSymbol].decimals
      var rateSell = tokens[sourceTokenSymbol].rate
      sourceAmountHex = converters.toHex(converters.getSourceAmountZero(sourceTokenSymbol, decimals, rateSell))
    }
    return sourceAmountHex
  }

export function* checkTxMined(ethereum, txHash, lastestBlock, tradeTopic = constants.LIMIT_ORDER_TOPIC) {
  const receipt = yield call([ethereum, ethereum.call], 'txMined', txHash);
  const logs = receipt.logs;
  const blockNumber = receipt.blockNumber;
  let isTopicValid = false;

  if (!receipt) return false;

  if (blockNumber > lastestBlock) return false;

  if (!logs.length) return false;

  for (var i = 0; i < logs.length; ++i) {
    if (logs[i].topics[0].toLowerCase() === tradeTopic.toLowerCase()) {
      isTopicValid = true;
      break;
    }
  }

  return isTopicValid;
}
