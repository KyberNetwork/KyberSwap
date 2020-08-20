import { TX_TYPES } from './constants';
import BLOCKCHAIN_INFO from "../../../env";
import { convertTimestampToTime, formatAddress, shortenBigNumber } from "../utils/converter";


export async function fetchAddressTxs(address, page, limit = 20) {
  const response = await fetch(`${BLOCKCHAIN_INFO.portfolio_api}/transactions?address=${address}&page=${page}&limit=${limit}`);
  const result = await response.json();
  const isValidResult = validateResultObject(result);
  
  if (!isValidResult) return returnResponseObject([], 0, false, true);
  
  const kyberContract = BLOCKCHAIN_INFO.network.toLowerCase();
  const bigAllowance = 1000000;
  let txs = [];
  
  for (let i = 0; i < result.data.length; i++) {
    const tx = result.data[i];
    let isValidTx = false;
    
    if (tx.type === TX_TYPES.send || tx.type === TX_TYPES.receive) {
      isValidTx = validateTransferTx(tx);
    } else if (tx.type === TX_TYPES.swap) {
      isValidTx = validateSwapTx(tx);
    } else if (tx.type === TX_TYPES.approve) {
      isValidTx = validateApproveTx(tx);
  
      if (isValidTx) {
        const allowance = tx.approve_allowance;
        const spender = tx.approve_spender.toLowerCase();
        const isKyberContract = spender === kyberContract;
        let formattedAllowance = allowance;
        
        if (allowance > bigAllowance) {
          formattedAllowance = isKyberContract ? '' : shortenBigNumber(allowance);
        }
        
        tx.formattedContract = isKyberContract ? 'Kyber Contract' : formatAddress(spender, 10);
        tx.formattedAllowance = formattedAllowance;
      }
    } else if (tx.type === TX_TYPES.undefined) {
      isValidTx = validateUndefinedTx(tx);
    }
  
    if (isValidTx) {
      tx.time = convertTimestampToTime(+tx.timeStamp);
      txs.push(tx);
    }
  }
  
  return returnResponseObject(txs, result.count, result.in_queue);
}

export function validateResultObject(result) {
  return result.data && Array.isArray(result.data) && result.count !== undefined && !isNaN(result.count) &&
    result.in_queue !== undefined && result.error === ""
}

export function validateTransferTx(tx) {
  return tx.transfer_token_address && tx.transfer_token_value && !isNaN(tx.transfer_token_value) &&
    tx.transfer_from && tx.transfer_to && tx.timeStamp && tx.hash;
}

export function validateSwapTx(tx) {
  return tx.swap_source_token && tx.swap_dest_token && tx.swap_source_amount && !isNaN(tx.swap_source_amount) &&
    tx.swap_dest_amount && !isNaN(tx.swap_dest_amount) && tx.timeStamp && tx.hash;
}

export function validateApproveTx(tx) {
  return tx.approve_token_address && tx.approve_spender && tx.approve_allowance && !isNaN(tx.approve_allowance) && tx.timeStamp && tx.hash;
}

export function validateUndefinedTx(tx) {
  return tx.to && tx.timeStamp && tx.hash;
}

export function returnResponseObject(txs, totalTxs, inQueue, isError = false) {
  return {
    data: txs,
    totalTxs,
    inQueue,
    isError
  };
}