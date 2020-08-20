
import { TX_TYPES } from "../constants";
import BLOCKCHAIN_INFO from "../../../../env";
import { sumOfTwoNumber, subOfTwoNumber, multiplyOfTwoNumber, toT, convertTimestampToTime } from "../../utils/converter";
import { validateResultObject, returnResponseObject, validateTransferTx, validateSwapTx} from "../portfolioService"
import {BALANCE_TX_HISTORY, PRICE_HISTORY, LASTEST_TOKEN_BALANCE, TOKEN_BY_ADDRESS, NOW} from "./mock"

import {getResolutionForTimeRange, getFromTimeForTimeRange, parseTxsToTimeFrame,
    mappingBalanceChange, mappingTotalBalance, getArrayTradedTokenSymbols, timelineLabels,
    CHART_RANGE_IN_SECOND} from "./portfolioChartUtils"


export async function getLastestBalance(ethereum, userAddr, supportTokens) {
    return LASTEST_TOKEN_BALANCE
}

/// caculate the init block time from chart resolution
export function getInitBlockTime(rangeType) {
    return Math.round(new Date().getTime() / 1000) - CHART_RANGE_IN_SECOND[rangeType]
}


function getTokenByAddress(tokens){
    return TOKEN_BY_ADDRESS
}
export async function render(ethereum, address, tokens, rangeType) {
    const now = NOW
    const innitTime = Math.round(new Date().getTime() / 1000) - CHART_RANGE_IN_SECOND[rangeType]

    const addrTxs = await getBalanceTransactionHistoryByTime(address, innitTime)
    const balanceTokens = await getLastestBalance(ethereum, address, tokens)
    const tokenByAddress = getTokenByAddress(tokens)
    const arrayTxs = addrTxs.data
    if (!arrayTxs || !arrayTxs.length) return

    if (addrTxs.isError) {
        // todo handle history no txs
        return
    }
    const txs = addrTxs.data

    const chartResolution = getResolutionForTimeRange(rangeType)
    const chartFromTime = getFromTimeForTimeRange(rangeType, now)

    const txByResolution = parseTxsToTimeFrame(txs, chartResolution, chartFromTime, now)
    const arrayTradedTokenSymbols = getArrayTradedTokenSymbols(txs, tokenByAddress)
    const balanceChange = mappingBalanceChange(txByResolution, balanceTokens, tokenByAddress)

    const priceInResolution = await fetchTradedTokenPrice(chartFromTime, chartResolution, arrayTradedTokenSymbols)
    const totalBalance = mappingTotalBalance(balanceChange, priceInResolution)

    const labelSeries = timelineLabels(chartFromTime, now, chartResolution)
    return {
        data: totalBalance,
        label: labelSeries
    }
}


export async function getBalanceTransactionHistoryByTime(address, from) {

    const result = BALANCE_TX_HISTORY

    
    const isValidResult = validateResultObject(result);
    
    if (!isValidResult) return returnResponseObject([], 0, false, true);
    let txs = [];
    
    for (let i = 0; i < result.data.length; i++) {
      const tx = result.data[i];
      let isValidTx = false;
      
      if (tx.type === TX_TYPES.send || tx.type === TX_TYPES.receive) {
        isValidTx = validateTransferTx(tx);
      } else if (tx.type === TX_TYPES.swap) {
        isValidTx = validateSwapTx(tx);
      }
      if (isValidTx) {
        tx.time = convertTimestampToTime(+tx.timeStamp);
        txs.push(tx);
      }
    }
    
    return returnResponseObject(txs, result.count, result.in_queue);
  }
  

  export async function fetchTradedTokenPrice(fromTime, resolution, arrayTradedTokensSymbol){  
    return PRICE_HISTORY.data
  } 