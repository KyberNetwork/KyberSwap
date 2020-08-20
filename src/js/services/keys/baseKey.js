import { biggestNumber } from "../../utils/converter"
import BLOCKCHAIN_INFO from "../../../../env"

export const sendEtherFromAccount = (
  id, ethereum, account, sourceToken, sourceAmount,
  destAddress, nonce, gas, gasPrice, keystring, accountType,
  password) => {

  const txParams = {
    from: account,
    nonce: nonce,
    gasPrice: gasPrice,
    gasLimit: gas,
    to: destAddress,
    value: sourceAmount,
    chainId: BLOCKCHAIN_INFO.networkId
  }
  return new Promise((resolve, reject) => {
    resolve({ txParams, keystring, password })
  })
}

export const sendTokenFromAccount = (
  id, ethereum, account, sourceToken, sourceAmount,
  destAddress, nonce, gas, gasPrice, keystring, accountType,
  password) => {

  return new Promise((resolve, reject) => {
    ethereum.call("sendTokenData", sourceToken, sourceAmount, destAddress).then(result => {
      const txParams = {
        from: account,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: sourceToken,
        value: '0x0',
        data: result,
        chainId: BLOCKCHAIN_INFO.networkId
      }
      resolve({ txParams, keystring, password })
    })
  })
}

export const etherToOthersFromAccount = (
  id, ethereum, account, sourceToken, sourceAmount, destToken, destAddress, maxDestAmount,
  minConversionRate, walletId, nonce, gas, gasPrice, keystring, accountType, password, platformFee
) => {
  return new Promise((resolve) => {
    ethereum.call("exchangeData",
      sourceToken, sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate, walletId, platformFee
    ).then(result => {
        const txParams = {
          from: account,
          nonce: nonce,
          gasPrice: gasPrice,
          gasLimit: gas,
          to: BLOCKCHAIN_INFO.network,
          value: sourceAmount,
          data: result,
          chainId: BLOCKCHAIN_INFO.networkId
        }
        resolve({ txParams, keystring, password })
      })
  })
}

export const getAppoveToken = (ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
  keystring, password, accountType, account, delegator) => {
  //const approvalData = ethereum.approveTokenData(sourceToken, sourceAmount)  
  return new Promise((resolve, reject) => {
    ethereum.call("approveTokenData", sourceToken, biggestNumber(), delegator).then(result => {
      const txParams = {
        from: account,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: sourceToken,
        value: '0x0',
        data: result,
        chainId: BLOCKCHAIN_INFO.networkId
      }
      resolve({ txParams, keystring, password })
    })
  })
}

export const getAppoveTokenZero = (ethereum, sourceToken, sourceAmount, nonce, gas, gasPrice,
  keystring, password, accountType, account, delegator) => {
  return new Promise((resolve) => {
    ethereum.call("approveTokenData", sourceToken, 0, delegator).then(result => {
      const txParams = {
        from: account,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: sourceToken,
        value: '0x0',
        data: result,
        chainId: BLOCKCHAIN_INFO.networkId
      }
      resolve({ txParams, keystring, password })
    })
  })
}

export const tokenToOthersFromAccount = (
  id, ethereum, account, sourceToken, sourceAmount, destToken, destAddress, maxDestAmount,
  minConversionRate, walletId, nonce, gas, gasPrice, keystring, accountType, password, platformFee
) => {
  return new Promise((resolve) => {
    ethereum.call("exchangeData",
      sourceToken, sourceAmount, destToken, destAddress,
      maxDestAmount, minConversionRate, walletId, platformFee
    ).then(result => {
      const txParams = {
        from: account,
        nonce: nonce,
        gasPrice: gasPrice,
        gasLimit: gas,
        to: BLOCKCHAIN_INFO.network,
        value: '0x0',
        data: result,
        chainId: BLOCKCHAIN_INFO.networkId
      };

      resolve({ txParams, keystring, password });
    })
  })
}

