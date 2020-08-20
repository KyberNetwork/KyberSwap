import BLOCKCHAIN_INFO from "../../../env";

export async function fetchGasLimit(srcToken, destToken, maxGasLimit, srcAmount = 1) {
  if (!srcAmount) srcAmount = 0;

  const srcTokenAddress = srcToken.address;
  const destTokenAddress = destToken.address;
  const srcGasLimit = srcToken.gasLimit ? +srcToken.gasLimit : maxGasLimit;
  const destGasLimit = destToken.gasLimit ? +destToken.gasLimit : maxGasLimit;

  try {
    const response = await fetch(`${BLOCKCHAIN_INFO.tracker}/gas_limit?source=${srcTokenAddress}&dest=${destTokenAddress}&amount=${srcAmount}`);
    const result = await response.json();

    if (result.error) {
      return srcGasLimit + destGasLimit
    }

    return result.data;
  } catch (e) {
    return srcGasLimit + destGasLimit;
  }
}
