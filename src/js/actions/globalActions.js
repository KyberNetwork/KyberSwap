import { fetchRate } from "../services/exchange"

export function updateBlock(ethereum, block) {
  return {
    type: "NEW_BLOCK_INCLUDED",
    payload: new Promise((resolve, reject) => {
      ethereum.getLatestBlock(resolve)
    })
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

export function acceptTermOfService() {
  return {
    type: "TERM_OF_SERVICE_ACCEPTED"
  }
}
