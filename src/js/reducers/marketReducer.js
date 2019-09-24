import constants from "../services/constants"

const initMarket = {
  configs: {
    sortKey: "",
    sortType: {},
    isLoading: false,
    selectedSymbol: "KNC",
    searchWord: "",
    currency: {},
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
        },
        active: ["change", "volume"]
      }
    }
  },
  count: { storageKey: constants.STORAGE_KEY },
  sortedTokens: [],
  tokens: []
}

const market = (state = initMarket, action) => {
  var newState = { ...state }
  switch (action.type) {
    case 'MARKET.CHANGE_SEARCH_WORD': {
      var searchWord = action.payload
      var configs = newState.configs
      configs.searchWord = searchWord
      return {...newState, configs: {...configs}, sortedTokens: []}
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

    case 'MARKET.RESET_LIST_TOKEN': {
      var configs = newState.configs
      configs.isLoading = false
      configs.page = 1
      return {...newState, configs: {...configs}}
    }

    case 'MARKET.UPDATE_SORT_STATE': {
      var {sortKey, sortType} = action.payload
      var newSortType = {}
      newSortType[sortKey] = sortType
      var configs = newState.configs
      configs.sortKey = sortKey
      configs.sortType = newSortType
      return {...newState, configs: {...configs}}
    }

    case 'MARKET.GET_MARKET_INFO_SUCCESS': {
      const { marketData, marketQuotes } = action.payload;

      return  {
        ...newState,
        tokens: marketData,
        configs: {
          ...newState.configs,
          currency: {
            listItem: marketQuotes,
            focus: marketQuotes[0]
          }
        }
      };
    }

    case "MARKET.UPDATE_SHOW_SEARCH_INPUT": {
      newState.configs.showSearchInput = action.payload
      return newState
    }

    case "MARKET.CHANGE_SYMBOL": {
      newState.configs.selectedSymbol = action.payload
    }

    default: return state
  }
}

export default market
