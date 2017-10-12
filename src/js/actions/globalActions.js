//import { fetchRate } from "../services/exchange"
import GLOBAL from "../constants/globalActions"

// export function updateBlock(ethereum, block) {
//   return {
//     type: "NEW_BLOCK_INCLUDED",
//     payload: new Promise((resolve, reject) => {
//       ethereum.getLatestBlock(resolve)
//     })
//   }
// }

export function updateBlock(ethereum, block) {
  return {
    type: GLOBAL.NEW_BLOCK_INCLUDED_PENDING,
    payload: ethereum
  }
}
export function updateBlockComplete(block) {
  return {
    type: GLOBAL.NEW_BLOCK_INCLUDED_FULFILLED,
    payload: block
  }
}

export function updateBlockFailed(error) {
  return {
    type: GLOBAL.GET_NEW_BLOCK_FAILED,
    payload: error
  }
}

// export function updateRate(ethereum, source, dest, reserve) {
//   return {
//     type: "RATE_UPDATED",
//     payload: new Promise((resolve, reject) => {
//       fetchRate(ethereum, source, dest, reserve, resolve)
//     })
//   }
// }

export function updateRate(ethereum, source, dest, reserve) {
  return {
    type: GLOBAL.RATE_UPDATED_PENDING,
    payload: {ethereum, source, dest, reserve}
  }
}

export function updateRateComplete(rate) {
  return {
    type: GLOBAL.RATE_UPDATED_FULFILLED,
    payload: rate
  }
}

export function acceptTermOfService() {
  return {
    type: GLOBAL.TERM_OF_SERVICE_ACCEPTED
  }
}
