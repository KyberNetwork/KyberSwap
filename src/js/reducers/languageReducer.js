import { REHYDRATE } from 'redux-persist/lib/constants'
import { localeReducer } from 'react-localize-redux';
import constants from '../services/constants';

const locale = (state, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (action.key === "locale") {
        var payload = action.payload

        var oldLang = payload && payload.languages ? payload.languages.map((x)=> { return x.code}) : ""
        var newLang = state.languages.map((x)=> { return x.code})

        if(!payload || oldLang.toString() !== newLang.toString() || !state.languages[1] || payload.languages[1]._v !== constants.STORAGE_KEY){
          state.languages[1]._v = constants.STORAGE_KEY
          action.payload = {...state}
        }
      }
      return localeReducer(state, action)
    }
    default: return localeReducer(state, action)
  }
}

export default locale
