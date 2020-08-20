const initState = {
  langModal: false
}

const utils = (state = initState, action) => {
  switch (action.type) {
    case "UTIL.MODAL_OPEN": {
      var newState = { ...state }
      if (!newState[action.payload]) {
        newState[action.payload] = {}
      }
      newState[action.payload].modalIsOpen = true
      return newState
    }
    case "UTIL.MODAL_CLOSE": {
      var newState = { ...state }
      if (!newState[action.payload]) {
        newState[action.payload] = {}
      }
      newState[action.payload].modalIsOpen = false
      return newState
    }
    case "UTIL.SET_DATA_MODAL": {
      var newState = { ...state }
      if (!newState[action.payload]) {
        newState[action.payload.modalID] = {}
      }
      newState[action.payload.modalID].data = action.payload.data
      return newState
    }
    case "UTIL.SHOW_RATE": {
      var newState = { ...state }
      newState.rate = true
      return newState
    }
    case "UTIL.HIDE_RATE": {
      var newState = { ...state }
      newState.rate = false
      return newState
    }
    case "UTIL.SHOW_CONTROL": {
      var newState = { ...state }
      newState.showControl = true
      return newState
    }
    case "UTIL.HIDE_CONTROL": {
      var newState = { ...state }
      newState.showControl = false
      return newState
    }
    case "UTIL.OPEN_TOKEN_MODAL": {
      var newState = { ...state }
      newState.tokenModal = {
        open: true,
        type: action.payload.type,
        selected: action.payload.selected
      }
      return newState
    }
    case "UTIL.HIDE_TOKEN_MODAL": {
      var newState = { ...state }
      newState.tokenModal = {
        open: false
      }
      return newState
    }
    case "UTIL.TOGGLE_NOTIFY": {
      var newState = { ...state }
      newState.showNotify = !newState.showNotify
      return newState
    }
    case "UTIL.OPEN_INFO_MODAL": {
      var newState = { ...state }
      var { title, content } = action.payload;
      newState.infoModal = {
        open: true,
        title: title,
        content: content,
      }
      return newState
    }
    case "UTIL.EXIT_INFO_MODAL": {
      var newState = { ...state }
      newState.infoModal = {
        open: false
      }
      return newState
    }
    case "UTIL.HIDE_LANGUAGE_MODAL":{
      var newState = { ...state }
      newState.langModal = false
      return newState
    }
    case "UTIL.SHOW_LANGUAGE_MODAL":{
      var newState = { ...state }
      newState.langModal = true
      return newState
    }
  }
  return state
}

export default utils
