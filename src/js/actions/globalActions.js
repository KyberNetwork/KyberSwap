import { fetchRate } from "../services/exchange"

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

export function updateRate(ethereum, source, dest, reserve) {
  return {
    type: "RATE_UPDATED",
    payload: new Promise((resolve, reject) => {
      fetchRate(ethereum, source, dest, reserve, resolve)
    })
  }
}
