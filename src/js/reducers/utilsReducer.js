
const initState = {
}

const utils = (state=initState, action) => {
  switch (action.type) {
    case "MODAL_OPEN": {
      var newState = {...state}
      if(!newState[action.payload]){
        newState[action.payload] = {}
      }
      newState[action.payload].modalIsOpen = true
      return newState
    }
    case "MODAL_CLOSE": {
      var newState = {...state}
      if(!newState[action.payload]){
        newState[action.payload] = {}
      }
      newState[action.payload].modalIsOpen = false
      return newState
    }
    case "SET_DATA_MODAL":{
      var newState = {...state}
      if(!newState[action.payload]){
        newState[action.payload.modalID] = {}
      }
      newState[action.payload.modalID].data = action.payload.data
      return newState 
    }
    case "SHOW_RATE":{
      var newState = {...state}      
      newState.rate = true
      return newState 
    }
    case "HIDE_RATE":{
      var newState = {...state}
      newState.rate = false
      return newState 
    }
    case "SHOW_CONTROL":{
      var newState = {...state}
      newState.showControl = true
      return newState 
    }
    case "HIDE_CONTROL":{
      var newState = {...state}
      newState.showControl = false
      return newState 
    }
  }
  return state
}

export default utils
