import { REHYDRATE } from 'redux-persist/lib/constants'
//import Rate from "../services/rate"
import * as BLOCKCHAIN_INFO from "../../../env"
import constants from "../services/constants"
import * as converters from "../utils/converter"




const initState = function () {
    var tokens = {}
    Object.keys(BLOCKCHAIN_INFO.tokens).forEach((key) => {
        tokens[key] = {}
        tokens[key].info = BLOCKCHAIN_INFO.tokens[key]

        tokens[key].circulatingSupply = 0

        tokens[key]["ETH"] = {
            sellPrice: 0,
            buyPrice: 0,
            market_cap: 0,
            circulating_supply: 0,
            total_supply: 0,
            last_7d: 0,
            change: 0,
            volume: 0
        }

        tokens[key]["USD"] = {
            sellPrice: 0,
            buyPrice: 0,
            market_cap: 0,
            circulating_supply: 0,
            total_supply: 0,
            last_7d: 0,
            change: 0,
            volume: 0
        }

    })
    return {
        tokens,
        configs: {
            isShowTradingChart: false,
            selectedSymbol: "KNC",
            searchWord: "",
            currency: {
                listItem: {
                    "ETH": "ETH",
                    "USD": "USD"
                },
                focus: "ETH"
            },
            sort: {
                listItem: {
                    "highest_price": "Highest price",
                    "lowest_price": "Lowest price"
                },
                focus: "highest_price"
            },
            column: {
                display: {
                    listItem: {
                        "B": "Bold Columns",
                        "S": "Standard Columns",
                        "T": "Tine Columns",
                    },
                    active: "B"
                },
                shows: {
                    listItem: {                        
                        "change": {title: "24HR Change"},
                        "volume": {title: "Volume (24h)"},
                        "market_cap": {title: "Market cap" },                        
                        "last_7d": {title: "Last 7d", type: "chart"}
                    },
                    active: ["change", "last_7d"]
                }
            }
        },
        count: { storageKey: constants.STORAGE_KEY }
    }
}()

const market = (state = initState, action) => {
    var newState = { ...state }
    switch (action.type) {
        // case REHYDRATE: {
        //     if (action.key === "market") {
        //         if (action.payload) {
        //             var {tokens, count, configs} = action.payload

        //             if (action.payload.count && action.payload.count.storageKey === constants.STORAGE_KEY) {
        //                 return {...state, tokens:{...tokens},  count: { storageKey: constants.STORAGE_KEY }, configs: {...configs}}                        
        //             }else{
        //                 return initState
        //             }

                    
        //         } else {
        //             return initState
        //         }
        //     }
        //     return initState
        // }
        case 'MARKET.CHANGE_SEARCH_WORD': {
            var searchWord = action.payload
            var configs = newState.configs
            configs.searchWord = searchWord
            return {...newState, configs: {...configs}}
        }
        case 'MARKET.CHANGE_CURRENCY': {
            var value = action.payload
            var configs = newState.configs
            configs.currency.focus = value
            return {...newState, configs: {...configs}}
        }
        case 'MARKET.CHANGE_SORT': {
            var value = action.payload
            var configs = newState.configs
            configs.sort.focus = value        
            return {...newState, configs: {...configs}}
        }
        case 'MARKET.CHANGE_DISPLAY_COLUMN': {
            var value = action.payload
            var configs = newState.configs
            configs.column.display.active = value
            return {...newState, configs: {...configs}}
        }
        case 'MARKET.CHANGE_SHOW_COLUMN': {
            var { column, show } = action.payload
            var configs = newState.configs
            var active = configs.column.shows.active
            if (show) {
                active.push(column)
            } else {
                var index = active.indexOf(column)
                if (index !== -1) active.splice(index, 1)
            }
            var listItem = configs.column.shows.listItem
            configs.column.shows = { listItem, active }
            return {...newState, configs: {...configs}}
        }

        case 'MARKET.SHOW_TRADINGVIEW_CHART': {
            var { symbol } = action.payload
            newState.configs.isShowTradingChart = true
            newState.configs.selectedSymbol = symbol
            return newState
        }
        case 'MARKET.HIDE_TRADINGVIEW_CHART': {
            newState.configs.isShowTradingChart = false
            return newState
        }

        case 'MARKET.GET_GENERAL_INFO_TOKENS_COMPLETE': {
            const { tokens, rateUSD } = action.payload
            var newTokens = newState.tokens
            Object.keys(tokens).map(key => {
                var token = tokens[key]
                if (newTokens[key]) {
                    newTokens[key].ETH.market_cap = token.market_cap
                    newTokens[key].ETH.circulating_supply = token.circulating_supply
                    newTokens[key].ETH.total_supply = token.total_supply
                    newTokens[key].ETH.volume = token.Quotes.ETH.volume_24h ? Math.round(token.Quotes.ETH.volume_24h): 0

                    newTokens[key].USD.market_cap = Math.round(token.market_cap * rateUSD)
                    newTokens[key].USD.circulating_supply = token.circulating_supply
                    newTokens[key].USD.total_supply = token.total_supply
                    newTokens[key].USD.volume = token.Quotes.USD.volume_24h ? Math.round(token.Quotes.USD.volume_24h): 0
                }
            })

            return  {...newState, tokens: {...newTokens}}
        }

        case 'MARKET.GET_VOLUMN_SUCCESS':{
            const {data} = action.payload
            var tokens = {...newState.tokens}
            Object.keys(data).map(key=>{
                if (!tokens[key]) return
                
                var token = data[key]

                //tokens[key].ETH.volume = Math.round(token.e)
                tokens[key].ETH.last_7d =  token.p
                //tokens[key].USD.volume = Math.round(token.u)
                tokens[key].USD.last_7d =  token.p

                //calculate % change                
                //get buy price
                

                var buyPrice = parseFloat(tokens[key].ETH.buyPrice)
                var sellPrice = parseFloat(tokens[key].ETH.sellPrice)
                var change = 0

                if ((sellPrice <= 0) || (buyPrice <=0)){
                    change = "---"
                }else{
                    var midlePrice = (buyPrice + sellPrice) / 2
                    var price24h = token.r
                    if (midlePrice > price24h){
                        change = converters.calculatePercent(midlePrice, price24h)
                    }else{
                        change = converters.calculatePercent(price24h, midlePrice) * -1
                    }
                }
                
                tokens[key].USD.change = tokens[key].ETH.change = change
            })
            return  {...newState, tokens: {...tokens}}
        }

        case 'GLOBAL.ALL_RATE_UPDATED_FULFILLED': {
            const { rates, rateUSD } = action.payload
            if (!rates) {
                return {...state}
            }
            var tokens = newState.tokens
            rates.map(rate => {
                if (rate.source !== "ETH") {
                    if (tokens[rate.source]) {
                        var sellPriceETH = converters.convertSellRate(rate.rate)
                        tokens[rate.source].ETH.sellPrice = parseFloat(converters.roundingNumber(sellPriceETH))
                        tokens[rate.source].USD.sellPrice = parseFloat(converters.roundingNumber(sellPriceETH * rateUSD))
                    } else {
                        return
                    }
                } else {
                    if (tokens[rate.dest]) {
                        var buyPriceETH = converters.convertBuyRate(rate.rate)
                        tokens[rate.dest].ETH.buyPrice = parseFloat(converters.roundingNumber(buyPriceETH))
                        tokens[rate.dest].USD.buyPrice = parseFloat(converters.roundingNumber(buyPriceETH * rateUSD))
                    } else {
                        return
                    }
                }
            })
            return  {...newState, tokens: {...tokens}}
        }
        

        default: return state
    }
}

export default market
