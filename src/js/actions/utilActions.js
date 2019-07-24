



export function openTokenModal(type, selected) {
  return {
    type: "UTIL.OPEN_TOKEN_MODAL",
    payload: {type: type, selected: selected},
  }
}

export function hideSelectToken(){
 return {
    type: "UTIL.HIDE_TOKEN_MODAL",
  } 
}

export function toggleNotify(){
  return {
    type: 'UTIL.TOGGLE_NOTIFY'
  }
}

export function openInfoModal(title, content) {
  return {
    type: "UTIL.OPEN_INFO_MODAL",
    payload: { title: title, content: content }
  }
}

export function closeInfoModal(){
  return {
    type: "UTIL.EXIT_INFO_MODAL"
  }
}


export function hideLangugaModal(){
  return {
    type: "UTIL.HIDE_LANGUAGE_MODAL"
  }
}

export function showLangugaModal(){
  return {
    type: "UTIL.SHOW_LANGUAGE_MODAL"
  }
}
