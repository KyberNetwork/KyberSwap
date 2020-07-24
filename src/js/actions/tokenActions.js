export function initTokens(tokens) {
  return {
    type: "TOKEN.INIT_TOKEN",
    payload: { tokens }
  }
}