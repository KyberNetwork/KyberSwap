import BLOCKCHAIN_INFO from "../../../env";
import { DEFAULT_BPS_FEE } from "./constants"

export async function fetchSwapHint(src, dst, amount = null) {
  try {
    const endpoint = `${BLOCKCHAIN_INFO.kyberswap_api}/swap_hint?src=${src}&dst=${dst}${amount ? `&amount=${amount}` : ''}`;
    const response = await fetch(endpoint);
    const result = await response.json();

    if (!result.success || !result.hint) {
      return '0x';
    }

    return result.hint;
  } catch (e) {
    return '0x';
  }
}

export async function fetchSupportedTokens() {
  try {
    const endpoint = process.env.integrate ? '/api/currencies' : `${BLOCKCHAIN_INFO.tracker}/internal/currencies`;
    const response = await fetch(endpoint);
    const result = await response.json();

    if (result.success) {
      return filterActiveTokens(result.data);
    }

    return BLOCKCHAIN_INFO.tokens;
  } catch (e) {
    return BLOCKCHAIN_INFO.tokens;
  }
}

function filterActiveTokens(tokens) {
  let newTokens = {};
  const now = Math.round(new Date().getTime() / 1000);

  tokens.map(val => {
    if (val.listing_time > now) return;
    if (val.delist_time && val.delist_time <= now) return;
    newTokens[val.symbol] = { ...val };
  });

  return newTokens
}

export async function fetchActiveCampaign() {
  try {
    const response = await fetch(`${BLOCKCHAIN_INFO.kyberswap_api}/campaigns/current_active`);
    const result = await response.json();
    const isValidResult = result && result.token_symbol && result.link;

    if (!isValidResult) return null;

    return {
      tokenSymbol: result.token_symbol,
      link: result.link
    }
  } catch(e) {
    return false;
  }
}

export async function fetchPlatformFee(srcAddress, destAddress) {
  try {
    const response = await fetch(`${BLOCKCHAIN_INFO.kyberswap_api}/swap_fee?src=${srcAddress}&dst=${destAddress}`);
    const result = await response.json();

    const isValidResult = result && result.success === true;
    let platformFee = DEFAULT_BPS_FEE;

    if (isValidResult) platformFee = result.fee;

    return platformFee;
  } catch(e) {
    return DEFAULT_BPS_FEE;
  }
}

export async function checkEligibleAddress(address) {
  try {
    const response = await fetch(`${BLOCKCHAIN_INFO.kyberswap_api}/wallet/screening?wallet=${address}`);
    const result = await response.json();

    const isValid = result && result.success === true;
    if (!isValid) return true;

    return result.eligible;
  } catch (e) {
    return true;
  }
}
