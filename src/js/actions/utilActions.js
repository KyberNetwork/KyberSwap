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
