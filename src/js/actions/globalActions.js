export function updateBlock(block) {
  return {
    type: "NEW_BLOCK_INCLUDED",
    payload: block
  }
}

export function updateBlockFailed(error) {
  return {
    type: "GET_NEW_BLOCK_FAILED",
    payload: error
  }
}

export function updateRates(newRates) {
  return {
    type: "RATES_UPDATED",
    payload: newRates
  }
}
