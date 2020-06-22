import BLOCKCHAIN_INFO from "../../../env";

export async function fetchActiveCampaign() {
  const response = await fetch(`${BLOCKCHAIN_INFO.kyberswap_api}/campaigns/current_active`);
  const result = await response.json();
  const isValidResult = result && result.token_symbol && result.link;

  if (!isValidResult) return null;

  return {
    tokenSymbol: result.token_symbol,
    link: result.link
  }
}
