import EthereumService from "../instance/ethereum/ethereum.fake"
let ethereum = new EthereumService({ default: 'http' })
import Account from "../../src/js/services/account"
import { KeyStore, Trezor, Ledger } from "../../src/js/services/keys"


const account = new Account(
  "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98", 
  "keystore",
  '"{"version":3,"id":"34ae5306-f3bf-42d3-bb0e-ce2e0fe1821b","address":"52249ee04a2860c42704c0bbc74bd82cb9b56e98","crypto":{"ciphertext":"aa638616d99f6f7a11ba205cd8b6dc09f064511d92361736718ba86c61b50c9d","cipherparams":{"iv":"d6fc865281ac8ed91af38cf933e8b916"},"cipher":"aes-128-ctr","kdf":"pbkdf2","kdfparams":{"dklen":32,"salt":"d5358f4e1403c7c47f86b48f134b9e0fce57b3dd6eac726f0eed9e54d12735fe","c":10240,"prf":"hmac-sha256"},"mac":"086cab9258c953081d0d6f3ed077beca7ae6342229526a3fc8e3614d91e71636"}}"'
  );

const keystoreService = new KeyStore()


const keystoreWrongPassphrase = {
  formId: "transfer", 
  ethereum: ethereum, 
  address: "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98",
  token: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", 
  amount: "0x16345785d8a0000",
  destAddress: "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98", 
  nonce: 157, 
  gas: "0xf4240",
  gasPrice: "0x4a817c800", 
  keystring: "{\"version\":3,\"id\":\"34ae5306-f3bf-42d3-bb0e-ce2e0fe1821b\",\"address\":\"52249ee04a2860c42704c0bbc74bd82cb9b56e98\",\"crypto\":{\"ciphertext\":\"aa638616d99f6f7a11ba205cd8b6dc09f064511d92361736718ba86c61b50c9d\",\"cipherparams\":{\"iv\":\"d6fc865281ac8ed91af38cf933e8b916\"},\"cipher\":\"aes-128-ctr\",\"kdf\":\"pbkdf2\",\"kdfparams\":{\"dklen\":32,\"salt\":\"d5358f4e1403c7c47f86b48f134b9e0fce57b3dd6eac726f0eed9e54d12735fe\",\"c\":10240,\"prf\":\"hmac-sha256\"},\"mac\":\"086cab9258c953081d0d6f3ed077beca7ae6342229526a3fc8e3614d91e71636\"}}", 
  type: "keystore", 
  password: "123", 
  account: account, 
  data: {
    amount: "0.1",
    destAddress: "0x52249ee04a2860c42704c0bbc74bd82cb9b56e98",
    tokenSymbol: "ETH"
  }, 
  keyService: keystoreService
}

const coldWalletSignError = {

}

const truePassphraseOrColdWalletSignSuccess = {

}


export default {
  keystoreWrongPassphrase, coldWalletSignError, truePassphraseOrColdWalletSignSuccess
}