import BLOCKCHAIN_INFO from "../../../../env"

const API_KEY = '4D5BJIK2Q2222M9R53NZMNRGKXREYVIB8K';
const START_AND_END_BLOCK = 'startblock=0&endblock=9999999999';
const RECORD_LIMIT = '2';

export async function fetchNormalTransactions(address) {
  return await fetchTransactions(address, 'txlist');
}

export async function fetchInternalTransactions(address) {
  return await fetchTransactions(address, 'txlistinternal');
}

export async function fetchERC20Transactions(address) {
  return await fetchTransactions(address, 'tokentx');
}

async function fetchTransactions(address, action) {
  const response = await fetch(`${BLOCKCHAIN_INFO.etherscan}?module=account&action=${action}&address=${address}&${START_AND_END_BLOCK}&page=1&offset=${RECORD_LIMIT}&sort=desc&apikey=${API_KEY}`);
  const data = await response.json();
  
  if (data.status === "1") {
    return data.result;
  }
  
  return [];
}