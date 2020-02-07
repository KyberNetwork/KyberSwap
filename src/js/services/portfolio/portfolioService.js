import { PORTFOLIO_TX_LIMIT } from '../constants';
import BLOCKCHAIN_INFO from "../../../../env";

export async function fetchAddressTxs(address, page) {
  const response = await fetch(`${BLOCKCHAIN_INFO.portfolio_api}/transactions?address=${address}&page=${page}&limit=${PORTFOLIO_TX_LIMIT}`);
  return await response.json();
}