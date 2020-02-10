import { PORTFOLIO_TX_LIMIT, TX_TYPES } from '../constants';
import BLOCKCHAIN_INFO from "../../../../env";

export async function fetchAddressTxs(address, page) {
  const response = await fetch(`${BLOCKCHAIN_INFO.portfolio_api}/transactions?address=${address}&page=${page}&limit=${PORTFOLIO_TX_LIMIT}`);
  const result = await response.json();
  const isValidResult = validateResultObject(result);
  
  if (!isValidResult) return returnResponseObject([], 0, false, true);
  
  let txs = [];
  for (let i = 0; i < result.data.length; i++) {
    const tx = result.data[i];
    let isValidTx = false;
    
    if (tx.type === TX_TYPES.transfer) {
      isValidTx = validateTransferTx(tx);
    } else if (tx.type === TX_TYPES.swap) {
      isValidTx = validateSwapTx(tx);
    } else if (tx.type === TX_TYPES.approve) {
      isValidTx = validateApproveTx(tx);
    } else if (tx.type === TX_TYPES.undefined) {
      isValidTx = validateUndefinedTx(tx);
    }
  
    if (isValidTx) txs.push(tx);
  }
  
  return returnResponseObject(txs, result.count, result.in_queue);
}

function validateResultObject(result) {
  return result.data && Array.isArray(result.data) && result.count && !isNaN(result.count) &&
    result.in_queue !== undefined && result.error === null
}

function validateTransferTx(tx) {
  return tx.transfer_token_symbol && tx.transfer_token_value && !isNaN(tx.transfer_token_value) &&
    tx.transfer_from && tx.transfer_to && tx.hash;
}

function validateSwapTx(tx) {
  return tx.swap_source_token && tx.swap_dest_token && tx.swap_source_amount && !isNaN(tx.swap_source_amount) &&
    tx.swap_dest_amount && !isNaN(tx.swap_dest_amount) && tx.hash;
}

function validateApproveTx(tx) {
  return tx.approve_token_symbol && tx.hash;
}

function validateUndefinedTx(tx) {
  return tx.from && tx.to && tx.hash;
}

function returnResponseObject(txs, totalTxs, inQueue, isError = false) {
  return {
    data: txs,
    totalTxs,
    inQueue,
    isError
  };
}