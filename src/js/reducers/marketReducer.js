import { REHYDRATE } from 'redux-persist/lib/constants'
//import Rate from "../services/rate"
import * as BLOCKCHAIN_INFO from "../../../env"
import constants from "../services/constants"

const initState = function () {
    var tokens = {}
    Object.keys(BLOCKCHAIN_INFO.tokens).forEach((key) => {
        tokens[key] = {}
        tokens[key].info = BLOCKCHAIN_INFO.tokens[key]
        //tokens[key].sellPrice = 0
        //tokens[key].buyPrice = 0

        

       // tokens[key].lastPrice = 0
       // tokens[key].column = 0
       // tokens[key].marketcap = 0
        tokens[key].circulatingSupply = 0

        //tokens[key].balance = 0

        // tokens[key].sellPriceEth = 0
        // tokens[key].buyPriceEth = 0
        // tokens[key].minSellPrice = 0
        // tokens[key].minBuyPrice = 0

        // tokens[key].sellPriceUsd = 1
        // tokens[key].buyPriceUsd = 1

        tokens[key]["ETH"] = {
            sellPrice: 0,
            buyPrice: 0,
            lastPrice: 0,
            marketcap: 0,
            last_7d: 0,
            change: 0
        }

        tokens[key]["USD"] = {
            sellPrice: 1,
            buyPrice: 1,
            lastPrice: 1,
            marketcap: 1,
            last_7d: 1,
            change: 1
        }

    })
    return {
        tokens,
        configs: {
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
                        "last_7d": "Last 7D",
                        "change": "%Change",
                        "last_price": "Last Price",
                        "volumn": "Volume (24h)",
                    },
                    active: ["last_7d", "change"]
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

        // }
        case 'MARKET.CHANGE_SEARCH_WORD': {
            var searchWord = action.payload
            newState.configs.searchWord = searchWord
            return newState
        }
        case 'MARKET.CHANGE_CURRENCY': {
            var value = action.payload
            newState.configs.currency.focus = value
            return newState
        }
        case 'MARKET.CHANGE_SORT': {
            var value = action.payload
            newState.configs.sort.focus = value
            return newState
        }
        case 'MARKET.CHANGE_DISPLAY_COLUMN': {
            var value = action.payload
            newState.configs.column.display.active = value
            return newState
        }
        case 'MARKET.CHANGE_SHOW_COLUMN': {
            var { column, show } = action.payload
            var active = newState.configs.column.shows.active
            if (show) {
                active.push(column)
            } else {
                var index = active.indexOf(column)
                if (index !== -1) active.splice(index, 1)
            }
            var listItem = newState.configs.column.shows.listItem
            newState.configs.column.shows = { listItem, active }
            return newState
        }
        
        default: return state
    }
}

export default market
