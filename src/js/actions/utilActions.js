import UTIL from "../constants/utilActions"

export function setDataModal(modalID, data) {
  return {
    type: UTIL.SET_DATA_MODAL,
    payload: {modalID, data}
  }
}

export function openModal(modalID) {
  return {
    type: UTIL.MODAL_OPEN,
    payload: modalID
  }
}

export function closeModal(modalID) {
  return {
    type: UTIL.MODAL_CLOSE,
    payload: modalID
  }
}

export function showRate() {
  return {
    type: UTIL.SHOW_RATE,    
  }
}
export function hideRate() {
  return {
    type: UTIL.HIDE_RATE,   
  }
}


export function showControl() {
  return {
    type: UTIL.SHOW_CONTROL,   
  }
}


export function hideControl() {
  return {
    type: UTIL.HIDE_CONTROL,   
  }
}



