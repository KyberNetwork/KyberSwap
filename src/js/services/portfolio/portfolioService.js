import { PORTFOLIO_TX_LIMIT } from '../constants';

export async function fetchAddressTxs(address, page) {
  const response = await fetch(`https://dev-portfolio.knstats.com/transactions?address=${address}&page=${page}&limit=${PORTFOLIO_TX_LIMIT}`);
  return await response.json();
}