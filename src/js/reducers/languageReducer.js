import { REHYDRATE } from 'redux-persist/lib/constants'
import { localeReducer } from 'react-localize-redux';

const initState = {
}

const locale = (...args) => {
  var state = {...args}[0]
  var action = {...args}[1]

  switch (action.type) {
    case REHYDRATE: {
      if (action.key === "locale") {
      }
      return localeReducer(...[state, action])
    }
    default: return localeReducer(...[state, action])
  }
}

export default locale
