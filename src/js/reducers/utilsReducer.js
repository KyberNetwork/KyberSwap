
const initState = {
}

const utils = (state=initState, action) => {
  switch (action.type) {
    case "MODAL_OPEN": {
      var newState = {...state}
      newState[action.payload] = {modalIsOpen: true}
      return newState
    }
    case "MODAL_CLOSE": {
      var newState = {...state}
      newState[action.payload] = {modalIsOpen: false}
      return newState
    }
  }
  return state
}

export default utils
