
import { TX_TYPES } from "../constants";
import BLOCKCHAIN_INFO from "../../../../env";
import { convertTimestampToTime, shortenBigNumber, formatAddress, splitArrayToChunks } from "../../utils/converter";
import { validateResultObject, returnResponseObject, validateTransferTx, validateSwapTx, validateApproveTx, validateUndefinedTx } from "../portfolioService"

import {getResolutionForTimeRange, getFromTimeForTimeRange, parseTxsToTimeFrame, isEmptyWallet,
     mappingBalanceChange, mappingTotalBalance, getArrayTradedTokenSymbols, timelineLabels,
     CHART_RANGE_IN_SECOND, TIME_EPSILON} from "./portfolioChartUtils"



export async function getLastestBalance(ethereum, userAddr, supportTokens) {
  try {
    const lastestBlock = await ethereum.call("getLatestBlock", userAddr, supportTokens)
    const balances = await ethereum.call("getAllBalancesTokenAtSpecificBlock", userAddr, supportTokens, lastestBlock)
    return balances
  } catch (error) {
    return {inQueue: true}
  }
   

    
}

function getTokenByAddress(tokens){
    return Object.values(tokens).reduce((result, token) => {
        Object.assign(result, {[token.address]: token.symbol});
        return result
      }, {});
}


export async function render(ethereum, address, tokens, rangeType) {
    const now = Math.floor(new Date().getTime() / 1000) - TIME_EPSILON
    const innitTime = now - CHART_RANGE_IN_SECOND[rangeType]

    const addrTxs = await getBalanceTransactionHistoryByTime(address, innitTime, now)
    const isEmpty = isEmptyWallet(addrTxs)

    if (addrTxs.isError || addrTxs.inQueue) {
        // todo handle history no txs
        return { isError: addrTxs.isError, inQueue: addrTxs.inQueue}
    }

    const txs = addrTxs.data
    if (!txs) return {isError: true}

    const balanceTokens = await getLastestBalance(ethereum, address, tokens)
    if(balanceTokens.inQueue){
      return { inQueue: balanceTokens.inQueue}
    }

    const tokenByAddress = getTokenByAddress(tokens)
  

    const chartResolution = getResolutionForTimeRange(rangeType)
    const chartFromTime = getFromTimeForTimeRange(rangeType, now)

    const txByResolution = parseTxsToTimeFrame(txs, chartResolution, chartFromTime, now)
    console.log("******txByResolution*****", txByResolution)
    const arrayTradedTokenSymbols = getArrayTradedTokenSymbols(txs, tokenByAddress, balanceTokens)
    const balanceChange = mappingBalanceChange(txByResolution, balanceTokens, tokenByAddress, tokens, address)
    console.log("+++++++++++balanceChange +++++++++", balanceChange)
    const priceInResolution = await fetchTradedTokenPrice(chartFromTime, now, chartResolution, arrayTradedTokenSymbols)
    const totalBalance = mappingTotalBalance(balanceChange, priceInResolution)

    const labelSeries = timelineLabels(chartFromTime, now, chartResolution)
    return {
        ...totalBalance,
        label: labelSeries,
        isEmpty: isEmpty
    }
}


export async function getBalanceTransactionHistoryByTime(address, from, to) {
    const response = await fetch(`${BLOCKCHAIN_INFO.portfolio_api}/transactions?address=${address}&startTime=${from}&endTime=${to}`);
    const result = await response.json();
    
    const isValidResult = validateResultObject(result);
    
    if (!isValidResult) return returnResponseObject([], 0, false, true);
    const kyberContract = BLOCKCHAIN_INFO.network.toLowerCase();
    const bigAllowance = 1000000;
    let txs = [];
    
    for (let i = 0; i < result.data.length; i++) {
      const tx = result.data[i];
      let isValidTx = false;
      
      if (tx.type === TX_TYPES.send || tx.type === TX_TYPES.receive) {
        isValidTx = validateTransferTx(tx);
      } else if (tx.type === TX_TYPES.swap) {
        isValidTx = validateSwapTx(tx);
      } else if (tx.type === TX_TYPES.approve) {
        isValidTx = validateApproveTx(tx);
    
        if (isValidTx) {
          const allowance = tx.approve_allowance;
          const spender = tx.approve_spender.toLowerCase();
          const isKyberContract = spender === kyberContract;
          let formattedAllowance = allowance;
          
          if (allowance > bigAllowance) {
            formattedAllowance = isKyberContract ? '' : shortenBigNumber(allowance);
          }
          
          tx.formattedContract = isKyberContract ? 'Kyber Contract' : formatAddress(spender, 10);
          tx.formattedAllowance = formattedAllowance;
        }
      } else if (tx.type === TX_TYPES.undefined) {
        isValidTx = validateUndefinedTx(tx);
      }

      if(+tx.timeStamp < from || +tx.timeStamp > to){
        isValidTx = false
      }

      if (isValidTx) {
        tx.time = convertTimestampToTime(+tx.timeStamp);
        txs.push(tx);
      }
    }
    
    return returnResponseObject(txs, result.count, result.in_queue);
  }

  export async function fetchTradedTokenPrice(fromTime, toTime, resolution, arrayTradedTokensSymbol){  
    const arrayTokensSplited = splitArrayToChunks(arrayTradedTokensSymbol)
    let summaryData = {}

    const arrayFunc = arrayTokensSplited.map(async arr => {
      const arraySymbolParams = arr.map(symbol => "&symbol=" + symbol).join("")
      const response = await fetch(`${BLOCKCHAIN_INFO.tracker}/internal/history_prices?from=${fromTime}&to=${toTime}&resolution=${resolution}&` + arraySymbolParams);
      return await response.json();
    })

    const arrayData = await Promise.all(arrayFunc)
    for(let i=0; i < arrayData.length; i++){
      if(arrayData[i].error){
        return {inQueue: true}
      }
      summaryData = {...summaryData, ...arrayData[i].data}
    }
  
    return summaryData
  
  } 