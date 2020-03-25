import { TX_TYPES } from "../constants";
import { sumOfTwoNumber, subOfTwoNumber, multiplyOfTwoNumber, toT, compareTwoNumber, roundingNumber, stringToNumber } from "../../utils/converter";

export const TIME_EPSILON = 180
const NUMBER_POINT_NOT_ZERO = 5

export const CHART_RANGE_TYPE = {
    ONE_DAY: "ONE_DAY",
    SEVEN_DAYS: "SEVEN_DAYS",
    ONE_MONTH: "ONE_MONTH",
    THREE_MONTHS: "THREE_MONTHS",
    // ONE_YEAR: "ONE_YEAR"
}

export const TIME_RESOLUTION = {
    FIFTEEN_MINUS: "15",
    HALF_HOUR: "30",
    HOUR: "60",
    TWO_HOUR: "120",
    FOUR_HOUR: "240",
    HALF_DAY: "720",
    DAY: "D",
}


export const CHART_RESOLUTION = {
    HOUR: "H",
    DAY: "D",
}

export const TIME_IN_SECOND = {
    FIFTEEN_MINUS: 15 * 60,
    HALF_HOUR: 30 * 60,
    ONE_HOUR: 60 * 60,
    TWO_HOUR: 120 * 60,
    FOUR_HOUR: 240 * 60,
    HALF_DAY: 720 * 60,
    ONE_DAY: 60 * 60 * 24,
    SEVEN_DAYS: 60 * 60 * 24 * 7,
    ONE_MONTH: 60 * 60 * 24 * 30,
    THREE_MONTHS: 60 * 60 * 24 * 90,
    ONE_YEAR: 60 * 60 * 24 * 360
}

export const CHART_RANGE_IN_SECOND = {
    ONE_DAY: TIME_IN_SECOND.ONE_DAY,
    SEVEN_DAYS: TIME_IN_SECOND.SEVEN_DAYS,
    ONE_MONTH: TIME_IN_SECOND.ONE_MONTH,
    THREE_MONTHS: TIME_IN_SECOND.THREE_MONTHS
}

function groupHour(array, fromTime, toTime) {
    const startHour = Math.floor(+fromTime / (TIME_IN_SECOND.ONE_HOUR));
    const endHour = Math.floor(+toTime / (TIME_IN_SECOND.ONE_HOUR));
    const txHour = {}
    const byHour = {}
    array.map(item => {
        if (+item['timeStamp'] >= fromTime) {
            const d = Math.floor(+item['timeStamp'] / (TIME_IN_SECOND.ONE_HOUR));
            txHour[d] = txHour[d] || [];
            txHour[d].push(item);
        }
    })

    for (let i = startHour + 1; i <= endHour; i++) {
        if (txHour[i]) byHour[i] = txHour[i]
        else byHour[i] = []
    }

    return byHour
}
function groupByTime(array, fromTime, toTime, res) {
    const startDay = Math.floor(+fromTime / (res));
    const endDay = Math.floor(+toTime / (res));
    const txTime = {}
    const byTime = {}

    array.map(item => {
        if (+item['timeStamp'] >= fromTime) {
            const d = Math.floor(+item['timeStamp'] / (res));
            txTime[d] = txTime[d] || [];
            txTime[d].push(item);
        }

    })

    for (let i = startDay + 1; i <= endDay; i++) {
        if (txTime[i]) byTime[i] = txTime[i]
        else byTime[i] = []
    }

    return byTime
}
function groupWeek(array, fromTime, toTime) {
    const startWeek = Math.floor(+fromTime / (TIME_IN_SECOND.SEVEN_DAYS));
    const endWeek = Math.floor(+toTime / (TIME_IN_SECOND.SEVEN_DAYS));
    const txWeek = {}
    const byWeek = {}

    array.map(item => {
        if (+item['timeStamp'] >= fromTime) {
            const d = Math.floor(+item['timeStamp'] / (TIME_IN_SECOND.SEVEN_DAYS));
            txWeek[d] = txWeek[d] || [];
            txWeek[d].push(item);
        }

    })

    for (let i = startWeek + 1; i <= endWeek; i++) {
        if (txDay[i]) byWeek[i] = txDay[i]
        else byWeek[i] = []
    }

    return byWeek
}

export function getResolutionForTimeRange(rangeType) {
    switch (rangeType) {
        case CHART_RANGE_TYPE.ONE_DAY:
            return TIME_RESOLUTION.FIFTEEN_MINUS;

        case CHART_RANGE_TYPE.SEVEN_DAYS:
            return TIME_RESOLUTION.HOUR;

        case CHART_RANGE_TYPE.ONE_MONTH:
            return TIME_RESOLUTION.FOUR_HOUR;

        case CHART_RANGE_TYPE.THREE_MONTHS:
            return TIME_RESOLUTION.HALF_DAY;

        default:
            return TIME_RESOLUTION.DAY;
    }
}

export function getTimeUnitWithTimeRange(rangeType){
    switch (rangeType) {
        case CHART_RANGE_TYPE.ONE_DAY:
            return "minute";

        case CHART_RANGE_TYPE.SEVEN_DAYS:
            return "day";

        case CHART_RANGE_TYPE.ONE_MONTH:
            return "day";

        case CHART_RANGE_TYPE.THREE_MONTHS:
            return "day";

        default:
            return "day";
    }
}

export function getFromTimeForTimeRange(rangeType, now) {
    switch (rangeType) {
        case CHART_RANGE_TYPE.ONE_DAY:
            return now - CHART_RANGE_IN_SECOND.ONE_DAY

        case CHART_RANGE_TYPE.SEVEN_DAYS:
            return now - CHART_RANGE_IN_SECOND.SEVEN_DAYS

        case CHART_RANGE_TYPE.ONE_MONTH:
            return now - CHART_RANGE_IN_SECOND.ONE_MONTH

        case CHART_RANGE_TYPE.THREE_MONTHS:
            return now - CHART_RANGE_IN_SECOND.THREE_MONTHS

        default:
            return now - CHART_RANGE_IN_SECOND.SEVEN_DAYS
    }
}

export function isEmptyWallet(txs){
    if(txs.inQueue) return false
    if(!txs || txs.totalTxs == 0) return true
    return false
}

export function parseTxsToTimeFrame(txs, timeResolution, fromTime, toTime) {
    switch (timeResolution) {
        case TIME_RESOLUTION.FIFTEEN_MINUS:
            return groupByTime(txs, fromTime, toTime, TIME_IN_SECOND.FIFTEEN_MINUS);
        case TIME_RESOLUTION.HALF_HOUR:
            return groupByTime(txs, fromTime, toTime, TIME_IN_SECOND.HALF_HOUR);
        case TIME_RESOLUTION.HOUR:
            return groupByTime(txs, fromTime, toTime, TIME_IN_SECOND.ONE_HOUR);
        case TIME_RESOLUTION.TWO_HOUR:
            return groupByTime(txs, fromTime, toTime, TIME_IN_SECOND.TWO_HOUR);
        case TIME_RESOLUTION.FOUR_HOUR:
            return groupByTime(txs, fromTime, toTime, TIME_IN_SECOND.FOUR_HOUR);
        case TIME_RESOLUTION.HALF_DAY:
            return groupByTime(txs, fromTime, toTime, TIME_IN_SECOND.HALF_DAY);
        case TIME_RESOLUTION.DAY:
            return groupByTime(txs, fromTime, toTime, TIME_IN_SECOND.DAY)
    }
}

function notExistInArray(array, item) {
    return array.indexOf(item) < 0 ? true : false
}

export function mappingBalanceChange(txsByRes, tokensBalance, tokenByAddress, supportToken, senderAddress) {
    const lastestBalance = {}
    tokensBalance.map(t => {
        if(supportToken[t.symbol]){
            lastestBalance[t.symbol] = toT(t.balance, supportToken[t.symbol].decimals)
        }
    })
    const feeWithHashAndFrom = {}
    const arrayBalance = [lastestBalance]
    let tmpBalance
    const arrayTxsByRes = Object.values(txsByRes)
    for (let i = arrayTxsByRes.length - 1; i > 0; i--) {
        tmpBalance = {...arrayBalance[0]}

        const txs = arrayTxsByRes[i]
        const balanceChange = {}
        for (let j = 0; j < txs.length; j++) {
            const tx = txs[j]
            
            if(tx.isError) continue

            switch (tx.type) {
                case TX_TYPES.send:
                case TX_TYPES.receive:
                    const transferTokenSymbol = tokenByAddress[tx.transfer_token_address.toLowerCase()]
                    if (!transferTokenSymbol || !supportToken[transferTokenSymbol]) {
                        break
                    };

                    const tokenData = supportToken[transferTokenSymbol]
                    const bigTokenAmount = toT(tx.transfer_token_value, tokenData.decimals)
                    
                    if (!balanceChange[transferTokenSymbol]) balanceChange[transferTokenSymbol] = 0

                    if (tx.type == TX_TYPES.send) balanceChange[transferTokenSymbol] =  sumOfTwoNumber(balanceChange[transferTokenSymbol], bigTokenAmount)
                    if (tx.type == TX_TYPES.receive) balanceChange[transferTokenSymbol] = subOfTwoNumber(balanceChange[transferTokenSymbol], bigTokenAmount)
                    break;
                case TX_TYPES.swap:

                    const sourceTokenSymbol = tokenByAddress[tx.swap_source_token.toLowerCase()]
                    const destTokenSymbol = tokenByAddress[tx.swap_dest_token.toLowerCase()]

                    if (!sourceTokenSymbol || !supportToken[sourceTokenSymbol] || !destTokenSymbol || !supportToken[destTokenSymbol]) {
                        break
                    };

                    const sourceData = supportToken[sourceTokenSymbol]
                    const destData = supportToken[destTokenSymbol]
                    if (!balanceChange[sourceTokenSymbol]) balanceChange[sourceTokenSymbol] = 0
                    if (!balanceChange[destTokenSymbol]) balanceChange[destTokenSymbol] = 0

                    
                    const bigSourceAmount = toT(tx.swap_source_amount, sourceData.decimals)
                    const bigDestAmount = toT(tx.swap_dest_amount, destData.decimals)
                    balanceChange[sourceTokenSymbol] = sumOfTwoNumber(balanceChange[sourceTokenSymbol], bigSourceAmount)
                    balanceChange[destTokenSymbol] = subOfTwoNumber(balanceChange[destTokenSymbol], bigDestAmount)
                    break;
            }
            if(!tx.isError && tx.fee && senderAddress.toLowerCase() == tx.from.toLowerCase()){
                const feeKey = tx.hash.toLowerCase() + "_" + tx.from.toLowerCase()
                if(!feeWithHashAndFrom[feeKey]){
                    const ethFee = toT(tx.fee, 18)
                    feeWithHashAndFrom[feeKey] = ethFee
                    if (!balanceChange["ETH"]) {
                        balanceChange["ETH"] = ethFee
                    } else {
                        balanceChange["ETH"] = sumOfTwoNumber(balanceChange["ETH"], ethFee)
                    }
                } else {
                    console.log(" dupliate ", feeKey)
                }
            }
        }

        Object.keys(balanceChange).map(key => {
            if (!tmpBalance[key]) tmpBalance[key] = 0
            tmpBalance[key] = sumOfTwoNumber(tmpBalance[key], balanceChange[key])
        })
        arrayBalance.unshift({...tmpBalance})
    }
    return arrayBalance
}

export function mappingTotalBalance(balanceChange, priceInResolution) {
    const returnData = []
    let minETH = null
    let maxETH = 0
    let minUSD = null
    let maxUSD = 0
    for (let i = 1; i <= balanceChange.length; i++) {
        const epocBalanceObj = balanceChange[balanceChange.length - i]
        if (!epocBalanceObj) continue
        let totalEpocETHPBalance = 0
        let totalEpocUSDBalance = 0
        
        Object.keys(epocBalanceObj).map(tokenSymbol => {
            const tokenPrice = priceInResolution[tokenSymbol]
            if (!tokenPrice) return
            const tokenETHPrice = tokenPrice[0]
            const tokenUSDPrice = tokenPrice[1]
            if (!tokenETHPrice || !tokenUSDPrice || !tokenETHPrice.length || !tokenUSDPrice.length || tokenETHPrice.length < i || tokenUSDPrice.length < i) return

            let tokenPriceEth = tokenETHPrice[tokenETHPrice.length - i].toString()
            let tokenPriceUsd = tokenUSDPrice[tokenUSDPrice.length - i].toString()

            let tokenPriceETHNotZeroNum  = 0
            let tokenPriceUSDNotZeroNum  = 0
        
            while(tokenPriceEth == "0" && tokenPriceETHNotZeroNum < NUMBER_POINT_NOT_ZERO && i + tokenPriceETHNotZeroNum < tokenETHPrice.length){
                tokenPriceETHNotZeroNum++;

                if(tokenETHPrice[tokenETHPrice.length - i - tokenPriceETHNotZeroNum] !== undefined
                && tokenETHPrice[tokenETHPrice.length - i - tokenPriceETHNotZeroNum] !== 0){

                    tokenPriceEth = tokenETHPrice[tokenETHPrice.length - i - tokenPriceETHNotZeroNum].toString()

                } else if (tokenETHPrice[tokenETHPrice.length - i + tokenPriceETHNotZeroNum] !== undefined
                        && tokenETHPrice[tokenETHPrice.length - i + tokenPriceETHNotZeroNum] !== 0){
                    tokenPriceEth = tokenETHPrice[tokenETHPrice.length - i + tokenPriceETHNotZeroNum].toString()
                }
                
            }
            while(tokenPriceUsd == "0" && tokenPriceUSDNotZeroNum < NUMBER_POINT_NOT_ZERO && i + tokenPriceUSDNotZeroNum < tokenUSDPrice.length){
                tokenPriceUSDNotZeroNum++;
                if(tokenUSDPrice[tokenUSDPrice.length - i - tokenPriceUSDNotZeroNum] !== undefined
                && tokenUSDPrice[tokenUSDPrice.length - i - tokenPriceUSDNotZeroNum] !== 0){

                    tokenPriceUsd = tokenUSDPrice[tokenUSDPrice.length - i - tokenPriceUSDNotZeroNum].toString()

                } else if (tokenUSDPrice[tokenUSDPrice.length - i + tokenPriceUSDNotZeroNum] !== undefined
                     && tokenUSDPrice[tokenUSDPrice.length - i + tokenPriceUSDNotZeroNum] !== 0){

                    tokenPriceUsd = tokenUSDPrice[tokenUSDPrice.length - i + tokenPriceUSDNotZeroNum].toString()
                }
                
            }

            totalEpocETHPBalance = sumOfTwoNumber(totalEpocETHPBalance, multiplyOfTwoNumber(tokenPriceEth, epocBalanceObj[tokenSymbol]))
            totalEpocUSDBalance = sumOfTwoNumber(totalEpocUSDBalance, multiplyOfTwoNumber(tokenPriceUsd, epocBalanceObj[tokenSymbol]))
        })

        returnData.unshift({
            eth: roundingNumber(totalEpocETHPBalance),
            usd: roundingNumber(totalEpocUSDBalance),
        })
        if(compareTwoNumber(totalEpocETHPBalance, maxETH) == 1){
            maxETH = roundingNumber(totalEpocETHPBalance)
        }
        if(compareTwoNumber(totalEpocUSDBalance, maxUSD) == 1){
            maxUSD = roundingNumber(totalEpocUSDBalance)
        }
        if(minETH == null || compareTwoNumber(totalEpocETHPBalance, minETH) == -1 ){
            minETH = roundingNumber(totalEpocETHPBalance)
        }
        if(minUSD == null || compareTwoNumber(totalEpocUSDBalance, minUSD) == -1 ){
            minUSD = roundingNumber(totalEpocUSDBalance)
        }
    }


    return {
        data: returnData,
        maxETH: stringToNumber(maxETH),
        minETH: stringToNumber(minETH),
        maxUSD: stringToNumber(maxUSD),
        minUSD: stringToNumber(minUSD),
        trendETH: compareTwoNumber(returnData[0].eth, returnData[returnData.length -1 ].eth) == 1 ? "down" : "up",
        trendUSD: compareTwoNumber(returnData[0].usd, returnData[returnData.length -1 ].usd) == 1 ? "down" : "up"
    }
}

export function getArrayTradedTokenSymbols(txs, tokenByAddress, balanceTokens){
    const arrayTradedTokenSymbols = []
    txs.map(tx => {
        switch (tx.type) {
            case TX_TYPES.send:
            case TX_TYPES.receive:
                const tokenSymbol = tokenByAddress[tx.transfer_token_address.toLowerCase()]
                if (tokenSymbol && notExistInArray(arrayTradedTokenSymbols, tokenSymbol)) arrayTradedTokenSymbols.push(tokenSymbol)
                break;
            case TX_TYPES.swap:
                const sourceTokenSymbol = tokenByAddress[tx.swap_source_token.toLowerCase()]
                const destTokenSymbol = tokenByAddress[tx.swap_dest_token.toLowerCase()]
                if (!sourceTokenSymbol || !destTokenSymbol) break
                if (notExistInArray(arrayTradedTokenSymbols, sourceTokenSymbol)) arrayTradedTokenSymbols.push(sourceTokenSymbol)
                if (notExistInArray(arrayTradedTokenSymbols, destTokenSymbol)) arrayTradedTokenSymbols.push(destTokenSymbol)
                break;
        }
    })

    if (notExistInArray(arrayTradedTokenSymbols, "ETH")) arrayTradedTokenSymbols.push("ETH")

    balanceTokens.map(token => {
        if(notExistInArray(arrayTradedTokenSymbols, token.symbol) && +token.balance > 0){
            arrayTradedTokenSymbols.push(token.symbol)
        }
    })
    return arrayTradedTokenSymbols
}

export function timelineLabels(start, now, res) {
    const timeLabels = [];
    let labelFormat = "hh:mm"
    let period = TIME_IN_SECOND.ONE_DAY * 1000
    let getCall = "getHours"
    let setCall = "setHours"
    let step = 1
    switch (res) {
        case TIME_RESOLUTION.FIFTEEN_MINUS:
            labelFormat = "hh:mm"
            period = TIME_IN_SECOND.FIFTEEN_MINUS * 1000
            getCall = "getMinutes"
            setCall = "setMinutes"
            step = 15
            break;
        case TIME_RESOLUTION.HALF_HOUR:
            labelFormat = "hh:mm"
            period = TIME_IN_SECOND.HALF_HOUR * 1000
            getCall = "getMinutes"
            setCall = "setMinutes"
            step = 30
            break;
        case TIME_RESOLUTION.HOUR:
            labelFormat = "dd HH"
            period = TIME_IN_SECOND.ONE_HOUR * 1000
            getCall = "getHours"
            setCall = "setHours"
            break;
        case TIME_RESOLUTION.TWO_HOUR:
            labelFormat = "dd HH"
            period = TIME_IN_SECOND.TWO_HOUR * 1000
            getCall = "getHours"
            setCall = "setHours"
            step = 2
            break;
        case TIME_RESOLUTION.FOUR_HOUR:
            labelFormat = "dd HH"
            period = TIME_IN_SECOND.FOUR_HOUR * 1000
            getCall = "getHours"
            setCall = "setHours"
            step = 4
            break;
        case TIME_RESOLUTION.HALF_DAY:
            labelFormat = "dd HH"
            period = TIME_IN_SECOND.HALF_DAY * 1000
            getCall = "getHours"
            setCall = "setHours"
            step = 12
            break;
        case TIME_RESOLUTION.DAY:
            labelFormat = "dd/MM "
            period = TIME_IN_SECOND.ONE_DAY * 1000
            getCall = "getDate"
            setCall = "setDate"
            break;
        case TIME_RESOLUTION.WEEK:
            labelFormat = "dd/MM"
            period = TIME_IN_SECOND.SEVEN_DAYS * 1000
            getCall = "getDate"
            setCall = "setDate"
            step = 7
            break;
    }

    const startTime = new Date(start * 1000)
    const nowTime = new Date(now * 1000)
    const numPeriod = Math.round(Math.abs((nowTime - startTime) / period))
    for (let i = 0; i <= numPeriod; i += 1) {
        startTime[setCall](startTime[getCall]() + step)
        timeLabels.push(new Date(startTime));
    }
    return timeLabels;
};


export function formatDate(date, format) {
    if (!format) format="MM/dd/yyyy";               

        var month = date.getMonth() + 1;
    var year = date.getFullYear();

    format = format.replace("MM", month.toString().padStart(2, "0"));

    if (format.indexOf("yyyy") > -1)
        format = format.replace("yyyy", year.toString());
    else if (format.indexOf("yy") > -1)
        format = format.replace("yy", year.toString().substr(2, 2));

    format = format.replace("dd", date.getDate().toString().padStart(2, "0"));

    var hours = date.getHours();
    if (format.indexOf("t") > -1) {
        if (hours > 11)
            format = format.replace("t", "pm")
        else
            format = format.replace("t", "am")
    }
    if (format.indexOf("HH") > -1)
        format = format.replace("HH", hours.toString().padStart(2, "0"));
    if (format.indexOf("hh") > -1) {
        if (hours > 12) hours - 12;
        if (hours == 0) hours = 12;
        format = format.replace("hh", hours.toString().padStart(2, "0"));
    }
    if (format.indexOf("mm") > -1)
        format = format.replace("mm", date.getMinutes().toString().padStart(2, "0"));
    if (format.indexOf("ss") > -1)
        format = format.replace("ss", date.getSeconds().toString().padStart(2, "0"));
    return format;
}