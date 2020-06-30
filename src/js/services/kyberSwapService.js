import BLOCKCHAIN_INFO from "../../../env";
import { DEFAULT_BPS_FEE } from "./constants"

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

export async function fetchPlatformFee() {
  try {
    const response = await fetch(`${BLOCKCHAIN_INFO.kyberswap_api}/swap_fee`);
    const result = await response.json();
    const isValidResult = result && result.success === true && result.fee;

    if (!isValidResult) return DEFAULT_BPS_FEE;

    return result.fee;
  } catch(e) {
    return DEFAULT_BPS_FEE;
  }
}
