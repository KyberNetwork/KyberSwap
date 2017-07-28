
export function setDataModal(modalID, data) {
  return {
    type: "SET_DATA_MODAL",
    payload: {modalID, data}
  }
}

export function openModal(modalID) {
  return {
    type: "MODAL_OPEN",
    payload: modalID
  }
}

export function closeModal(modalID) {
  return {
    type: "MODAL_CLOSE",
    payload: modalID
  }
}

export function showRate() {
  return {
    type: "SHOW_RATE",    
  }
}
export function hideRate() {
  return {
    type: "HIDE_RATE",   
  }
}


export function showControl() {
  return {
    type: "SHOW_CONTROL",   
  }
}


export function hideControl() {
  return {
    type: "HIDE_CONTROL",   
  }
}



