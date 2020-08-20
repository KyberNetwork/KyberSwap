import BLOCKCHAIN_INFO from "../../../env"

const ERC20 = [{ "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "minter", "outputs": [{ "name": "", "type": "address" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_spender", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "approve", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "totalSupply", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createIlliquidToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_from", "type": "address" }, { "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transferFrom", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "endMintingTime", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_value", "type": "uint256" }], "name": "createToken", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "balance", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "", "type": "address" }], "name": "illiquidBalance", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [{ "name": "_recipient", "type": "address" }, { "name": "_amount", "type": "uint256" }], "name": "transfer", "outputs": [{ "name": "o_success", "type": "bool" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [], "name": "LOCKOUT_PERIOD", "outputs": [{ "name": "", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": true, "inputs": [{ "name": "_owner", "type": "address" }, { "name": "_spender", "type": "address" }], "name": "allowance", "outputs": [{ "name": "o_remaining", "type": "uint256" }], "payable": false, "type": "function" }, { "constant": false, "inputs": [], "name": "makeLiquid", "outputs": [], "payable": false, "type": "function" }, { "inputs": [{ "name": "_minter", "type": "address" }, { "name": "_endMintingTime", "type": "uint256" }], "payable": false, "type": "constructor" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_from", "type": "address" }, { "indexed": true, "name": "_recipient", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "name": "_owner", "type": "address" }, { "indexed": true, "name": "_spender", "type": "address" }, { "indexed": false, "name": "_value", "type": "uint256" }], "name": "Approval", "type": "event" }]
const KYBER_NETWORK = [{"inputs":[{"internalType":"address","name":"_admin","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newAdmin","type":"address"},{"indexed":false,"internalType":"address","name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newAlerter","type":"address"},{"indexed":false,"internalType":"bool","name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"trader","type":"address"},{"indexed":false,"internalType":"contract IERC20","name":"src","type":"address"},{"indexed":false,"internalType":"contract IERC20","name":"dest","type":"address"},{"indexed":false,"internalType":"address","name":"destAddress","type":"address"},{"indexed":false,"internalType":"uint256","name":"actualSrcAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"actualDestAmount","type":"uint256"},{"indexed":false,"internalType":"address","name":"platformWallet","type":"address"},{"indexed":false,"internalType":"uint256","name":"platformFeeBps","type":"uint256"}],"name":"ExecuteTrade","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IKyberHint","name":"kyberHintHandler","type":"address"}],"name":"KyberHintHandlerSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IKyberNetwork","name":"newKyberNetwork","type":"address"},{"indexed":false,"internalType":"contract IKyberNetwork","name":"previousKyberNetwork","type":"address"}],"name":"KyberNetworkSet","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"newOperator","type":"address"},{"indexed":false,"internalType":"bool","name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"contract IERC20","name":"token","type":"address"},{"indexed":false,"internalType":"uint256","name":"amount","type":"uint256"},{"indexed":false,"internalType":"address","name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"internalType":"address","name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"inputs":[{"internalType":"address","name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"admin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"claimAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"enabled","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getAlerters","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract ERC20","name":"src","type":"address"},{"internalType":"contract ERC20","name":"dest","type":"address"},{"internalType":"uint256","name":"srcQty","type":"uint256"}],"name":"getExpectedRate","outputs":[{"internalType":"uint256","name":"expectedRate","type":"uint256"},{"internalType":"uint256","name":"worstRate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"src","type":"address"},{"internalType":"contract IERC20","name":"dest","type":"address"},{"internalType":"uint256","name":"srcQty","type":"uint256"},{"internalType":"uint256","name":"platformFeeBps","type":"uint256"},{"internalType":"bytes","name":"hint","type":"bytes"}],"name":"getExpectedRateAfterFee","outputs":[{"internalType":"uint256","name":"expectedRate","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getOperators","outputs":[{"internalType":"address[]","name":"","type":"address[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kyberHintHandler","outputs":[{"internalType":"contract IKyberHint","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"kyberNetwork","outputs":[{"internalType":"contract IKyberNetwork","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxGasPrice","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"pendingAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IKyberHint","name":"_kyberHintHandler","type":"address"}],"name":"setHintHandler","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IKyberNetwork","name":"_kyberNetwork","type":"address"}],"name":"setKyberNetwork","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"minConversionRate","type":"uint256"}],"name":"swapEtherToToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"srcAmount","type":"uint256"},{"internalType":"uint256","name":"minConversionRate","type":"uint256"}],"name":"swapTokenToEther","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"src","type":"address"},{"internalType":"uint256","name":"srcAmount","type":"uint256"},{"internalType":"contract IERC20","name":"dest","type":"address"},{"internalType":"uint256","name":"minConversionRate","type":"uint256"}],"name":"swapTokenToToken","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"src","type":"address"},{"internalType":"uint256","name":"srcAmount","type":"uint256"},{"internalType":"contract IERC20","name":"dest","type":"address"},{"internalType":"address payable","name":"destAddress","type":"address"},{"internalType":"uint256","name":"maxDestAmount","type":"uint256"},{"internalType":"uint256","name":"minConversionRate","type":"uint256"},{"internalType":"address payable","name":"platformWallet","type":"address"}],"name":"trade","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract ERC20","name":"src","type":"address"},{"internalType":"uint256","name":"srcAmount","type":"uint256"},{"internalType":"contract ERC20","name":"dest","type":"address"},{"internalType":"address payable","name":"destAddress","type":"address"},{"internalType":"uint256","name":"maxDestAmount","type":"uint256"},{"internalType":"uint256","name":"minConversionRate","type":"uint256"},{"internalType":"address payable","name":"walletId","type":"address"},{"internalType":"bytes","name":"hint","type":"bytes"}],"name":"tradeWithHint","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"src","type":"address"},{"internalType":"uint256","name":"srcAmount","type":"uint256"},{"internalType":"contract IERC20","name":"dest","type":"address"},{"internalType":"address payable","name":"destAddress","type":"address"},{"internalType":"uint256","name":"maxDestAmount","type":"uint256"},{"internalType":"uint256","name":"minConversionRate","type":"uint256"},{"internalType":"address payable","name":"platformWallet","type":"address"},{"internalType":"uint256","name":"platformFeeBps","type":"uint256"},{"internalType":"bytes","name":"hint","type":"bytes"}],"name":"tradeWithHintAndFee","outputs":[{"internalType":"uint256","name":"destAmount","type":"uint256"}],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address payable","name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"contract IERC20","name":"token","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"},{"internalType":"address","name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"stateMutability":"nonpayable","type":"function"}]
const KYBER_WRAPPER = [{ "constant": true, "inputs": [{ "name": "x", "type": "bytes14" }, { "name": "byteInd", "type": "uint256" }], "name": "getInt8FromByte", "outputs": [{ "name": "", "type": "int8" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [{ "name": "reserve", "type": "address" }, { "name": "tokens", "type": "address[]" }], "name": "getBalances", "outputs": [{ "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "pricingContract", "type": "address" }, { "name": "tokenList", "type": "address[]" }], "name": "getTokenIndicies", "outputs": [{ "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "x", "type": "bytes14" }, { "name": "byteInd", "type": "uint256" }], "name": "getByteFromBytes14", "outputs": [{ "name": "", "type": "bytes1" }], "payable": false, "stateMutability": "pure", "type": "function" }, { "constant": true, "inputs": [{ "name": "network", "type": "address" }, { "name": "sources", "type": "address[]" }, { "name": "dests", "type": "address[]" }, { "name": "qty", "type": "uint256[]" }], "name": "getExpectedRates", "outputs": [{ "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [{ "name": "pricingContract", "type": "address" }, { "name": "tokenList", "type": "address[]" }], "name": "getTokenRates", "outputs": [{ "name": "", "type": "uint256[]" }, { "name": "", "type": "uint256[]" }, { "name": "", "type": "int8[]" }, { "name": "", "type": "int8[]" }, { "name": "", "type": "uint256[]" }], "payable": false, "stateMutability": "view", "type": "function" }]
const KYBER_SWAP_ABI = [{"constant":false,"inputs":[],"name":"enableTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"alerter","type":"address"}],"name":"removeAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"}],"name":"listToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"pendingAdmin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"getOperators","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"user","type":"address"},{"name":"concatenatedTokenAddresses","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"isValidNonce","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"srcToken","type":"address"},{"name":"destToken","type":"address"}],"name":"concatTokenAddresses","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":true,"inputs":[{"name":"nonce","type":"uint256"}],"name":"validAddressInNonce","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"token","type":"address"},{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawToken","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAlerter","type":"address"}],"name":"addAlerter","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"","type":"address"},{"name":"","type":"uint256"}],"name":"nonces","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[],"name":"disableTrade","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[],"name":"claimAdmin","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"newAdmin","type":"address"}],"name":"transferAdminQuickly","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"getAlerters","outputs":[{"name":"","type":"address[]"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[{"name":"srcQty","type":"uint256"},{"name":"feeInPrecision","type":"uint256"}],"name":"deductFee","outputs":[{"name":"actualSrcQty","type":"uint256"},{"name":"feeInSrcTokenWei","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"newOperator","type":"address"}],"name":"addOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[{"name":"hash","type":"bytes32"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"},{"name":"user","type":"address"}],"name":"verifySignature","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"pure","type":"function"},{"constant":false,"inputs":[{"name":"user","type":"address"},{"name":"nonce","type":"uint256"},{"name":"srcToken","type":"address"},{"name":"srcQty","type":"uint256"},{"name":"destToken","type":"address"},{"name":"destAddress","type":"address"},{"name":"minConversionRate","type":"uint256"},{"name":"feeInPrecision","type":"uint256"},{"name":"v","type":"uint8"},{"name":"r","type":"bytes32"},{"name":"s","type":"bytes32"}],"name":"executeLimitOrder","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":false,"inputs":[{"name":"operator","type":"address"}],"name":"removeOperator","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"MAX_DEST_AMOUNT","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"amount","type":"uint256"},{"name":"sendTo","type":"address"}],"name":"withdrawEther","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"tradeEnabled","outputs":[{"name":"","type":"bool"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"kyberNetworkProxy","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":true,"inputs":[],"name":"FEE_PRECISION","outputs":[{"name":"","type":"uint256"}],"payable":false,"stateMutability":"view","type":"function"},{"constant":false,"inputs":[{"name":"concatenatedTokenAddresses","type":"uint256"},{"name":"nonce","type":"uint256"}],"name":"invalidateOldOrders","outputs":[],"payable":false,"stateMutability":"nonpayable","type":"function"},{"constant":true,"inputs":[],"name":"admin","outputs":[{"name":"","type":"address"}],"payable":false,"stateMutability":"view","type":"function"},{"inputs":[{"name":"_admin","type":"address"},{"name":"_kyberNetworkProxy","type":"address"}],"payable":false,"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"user","type":"address"},{"indexed":false,"name":"nonce","type":"uint256"},{"indexed":false,"name":"srcToken","type":"address"},{"indexed":false,"name":"actualSrcQty","type":"uint256"},{"indexed":false,"name":"destToken","type":"address"},{"indexed":false,"name":"destAddress","type":"address"},{"indexed":false,"name":"feeInSrcTokenWei","type":"uint256"}],"name":"LimitOrderExecute","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"concatenatedTokenAddresses","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"}],"name":"NonceUpdated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"user","type":"address"},{"indexed":false,"name":"concatenatedTokenAddresses","type":"uint256"},{"indexed":false,"name":"nonce","type":"uint256"}],"name":"OldOrdersInvalidated","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"token","type":"address"},{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"TokenWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"amount","type":"uint256"},{"indexed":false,"name":"sendTo","type":"address"}],"name":"EtherWithdraw","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"pendingAdmin","type":"address"}],"name":"TransferAdminPending","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAdmin","type":"address"},{"indexed":false,"name":"previousAdmin","type":"address"}],"name":"AdminClaimed","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newAlerter","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"AlerterAdded","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"newOperator","type":"address"},{"indexed":false,"name":"isAdd","type":"bool"}],"name":"OperatorAdded","type":"event"}]
const TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
const ETHER_ADDRESS = "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee"

const DEFAULT_BPS_FEE = 8;
var secondKey = "KNC"

const EXCHANGE_CONFIG = {
  path: "swap",
  MIN_ACCEPT_DELTA: 0.0001,
  EPSILON: 1000000000000000,
  MAX_CAP_PERCENT: 0.95,    
  COMMISSION_ADDR: "0x440bBd6a888a36DE6e2F6A25f65bc4e16874faa9",
  updateRateType : {
    selectToken: "select_token",
    changeAmount: "changeAmount",
    interval: "interval"
  },
  exchangePath: {
    approveZero: 1,
    approveMax: 2,    
    confirm: 3,    
    broadcast: 4
  },
  sourceErrors: {
    balance: "balance",
    input: "input",
    rate: "rate",
    sameToken: "sameToken",
    zeroCap: "zeroCap",
    richGuy: "richGuy",
    kyberEnable: "kyberEnable"
  },
  slippageRateErrors: {
    input: "input"
  }
}

const INIT_EXCHANGE_FORM_STATE = {
  isOpenImportAcount: false,
  advanced: false,
  termAgree: true,
  selected: false,
  isSelectToken: true,
  sourceToken: ETHER_ADDRESS,
  sourceTokenSymbol: "ETH",
  sourceAmount: "",
  destAmount: "",
  destToken: BLOCKCHAIN_INFO.tokens[secondKey].address,
  destTokenSymbol: secondKey,
  destAddress: "",
  inputFocus: "source",
  maxCap: "infinity",
  minConversionRate: 0,
  minDestAmount: 0,
  maxDestAmount: 0,
  expectedRate: 0,
  isEditRate: false,
  slippageRate: 0,
  blockNo: 0,
  percentChange: 0,
  throwOnFailure: "0x0000000000000000000000000000000000000000",
  gas: 850000,
  max_gas: 850000,
  gas_approve: 0,
  max_gas_approve: 160000,
  isFetchingGas: false,
  gasPrice: 20,
  selectedGas: 'f',
  gasPriceSuggest: {
    superFastGas: 40,
    fastGas: 20,
    standardGas: 20,
    safeLowGas: 20,
    fastTime: 2, //minutes
    standardTime: 5,
    lowTime: 30
  },
  maxGasPrice: 50,
  isEditGasPrice: false,
  broadcasting: true,
  currentPathIndex : -1,
  exchangePath: [],    
  balanceData: {
    sourceName: "Ether",
    sourceSymbol: "ETH",
    sourceDecimal: 18,
    destName: "Kyber",
    destSymbol: "KNC",
    destDecimal: 18,
    sourceAmount: 0,
    destAmount: 0
  },
  errors: {
    sourceAmount: {},
    slippageRate: {},
  },
  customRateInput: {
    isError: false,
    isDirty: false,
    value: "",
    isSelected: false
  },
  snapshot: {},
  isBalanceActive: false,
  isAdvanceActive: false,
  isOpenAdvance: false,
  isSelectTokenBalance: false,
  isRefPriceFromChainLink: false,
  platformFee: DEFAULT_BPS_FEE
}

const TRANSFER_CONFIG = {
  path: "transfer",
  transferPath: {    
    confirm: 3,    
    broadcast: 4
  },
  sourceErrors: {
    balance: "balance",
    input: "input"
  },
  addressErrors: {
    input: "input"
  }
}

const INIT_TRANSFER_FORM_STATE = {
  isOpenImportAcount: false,
  advanced: false,
  termAgree: true,
  passphrase: false,
  selected: false,
  token: ETHER_ADDRESS,
  tokenSymbol: "ETH",
  amount: "",
  destAddress: "",
  destEthName: "",
  throwOnFailure: "0x0000000000000000000000000000000000000000",
  gas: 21000,
  gas_limit: 200000,
  isFetchingGas: false,
  gasPrice: 20,
  selectedGas: 'f',
  gasPriceSuggest: {
    superFastGas: 40,
    fastGas: 20,
    standardGas: 20,
    safeLowGas: 20,
    fastTime: 2, //minutes
    standardTime: 5,
    lowTime: 30
  },
  maxGasPrice: 50,
  isEditGasPrice: false,
  broadcasting: true,
  balanceData: {
    tokenName: "Ether",
    tokenSymbol: "ETH",
    tokenDecimal: 18,
    prev: 0,
    next: 0
  },

  currentPathIndex : -1,
  transferPath: [],    

  errors: {
    sourceAmount: {},
    destAddress: {},
  },
  snapshot: {},
  isBalanceActive: false,
  isAdvanceActive: false,
  isOpenAdvance: false,
  isSelectTokenBalance: false
}

const LIMIT_ORDER_CONFIG = {
  path: "limit_order",
  maxFee: 0.005,
  updateRateType : {
    selectToken: "select_token"
  },
  pageSize: BLOCKCHAIN_INFO.limitOrder.page_size,
  orderPath: {
    approveZero: 1,
    approveMax: 2,
    wrapETH: 3,
    confirmSubmitOrder: 4
  },
  status: {
    OPEN: "open",
    IN_PROGRESS: "in_progress",
    FILLED: "filled",
    CANCELLED: "cancelled",
    INVALIDATED: "invalidated"
  }
}

const SIGN_OFF_WALLETS = ["private_key", "promo", "keystore"]

const INIT_LIMIT_ORDER_STATE = {
  isOpenImportAcount: false,
  kyber_enabled: false,
  advanced: false,
  termAgree: true,
  passphrase: false,
  selected: false,
  isSelectToken: true,
  sourceToken: BLOCKCHAIN_INFO.tokens["KNC"].address,
  sourceTokenSymbol: "KNC",
  destToken: BLOCKCHAIN_INFO.tokens[BLOCKCHAIN_INFO.wrapETHToken].address,
  destTokenSymbol: BLOCKCHAIN_INFO.wrapETHToken,
  sourceAmount: "",
  destAmount: "",
  destAddress: "",
  inputFocus: "source",
  maxCap: "infinity",
  minConversionRate: 0,
  buyRate: 0,
  sellRate: 0,
  triggerRate: 0,
  triggerSellRate: 0,
  triggerBuyRate: 0,
  minDestAmount: 0,
  maxDestAmount: 0,
  prevAmount: 0,
  offeredRate: 0,
  slippageRate: 0,
  blockNo: 0,
  orderFee: LIMIT_ORDER_CONFIG.maxFee,
  orderFeeAfterDiscount: LIMIT_ORDER_CONFIG.maxFee,
  orderFeeDiscountPercentage: 0,
  isFetchingFee: false,
  isFetchingRate: false,
  orderFeeErr: "",
  currentPathIndex : -1,
  listOrder: [],
  listFavoritePairs: [],
  addressFilter: [],
  pairFilter: [],
  statusFilter: [],
  typeFilter: [],
  timeFilter: {
    interval: 1,
    unit: "month"
  },
  pageIndex: 1,
  filterMode: "client",
  orderPairs: [],
  orderAddresses: [],
  dateSort: "desc",
  ordersCount: 0,
  pendingBalances: {},
  pendingTxs: [],
  activeOrderTab: "open",
  relatedOrders: [],
  throwOnFailure: "0x0000000000000000000000000000000000000000",
  gas: 500000,
  max_gas: 500000,
  gas_approve: 0,
  max_gas_approve: 160000,
  isFetchingGas: false,
  gasPrice: 20,
  selectedGas: 'f',
  gasPriceSuggest: {
    fastGas: 20,
    standardGas: 20,
    safeLowGas: 20,
    fastTime: 2, //minutes
    standardTime: 5,
    lowTime: 30
  },
  maxGasPrice: 50,
  isEditGasPrice: false,
  step: 2,
  broadcasting: true,
  bcError: "",
  txHash: "",
  tempTx: {},
  txApprove: false,
  confirmApprove: false,
  confirmApproveZero: false,
  isConfirming: false,
  isApproving: false,
  isApprovingZero: false,
  confirmColdWallet: false,
  signError: "",
  broadcastError: "",
  balanceData: {
    sourceName: "Ether",
    sourceSymbol: "ETH",
    sourceDecimal: 18,
    destName: "Kyber",
    destSymbol: "KNC",
    destDecimal: 18,
    sourceAmount: 0,
    destAmount: 0
  },
  errors: {
    sourceAmount: [],
    triggerRate: [],
    rateWarning: '',
    rateError: '',
    rateAmount: '',
    rateSystem: ''
  },
  errorNotPossessKgt: '',
  customRateInput: {
    isError: false,
    isDirty: false,
    value: ""
  },
  isAnalize: false,
  isAnalizeComplete: false,
  analizeError: {},
  snapshot: {},
  isBalanceActive: false,
  isAdvanceActive: false,
  isOpenAdvance: false,
  isSelectTokenBalance: false,
  swappingTime: 0,
  isAgreeForceSubmit: false,
  forceSubmitRate: 0,
  favorite_pairs_anonymous: [],
  currentQuote: "WETH",
  mobileState: {
    showQuoteMarket: false
  }
}

const RESERVES = [{ index: 0, name: "Kyber official reserve" }]

const ETH = {
  name: "Ether",
  symbol: "ETH",
  icon: "/img/ether.png",
  address: ETHER_ADDRESS,
  MAX_AMOUNT: 1000
};

const WETH_SUBSTITUTE_NAME = 'ETH*';

const IDLE_TIME_OUT = 600

const HISTORY_EXCHANGE = {
  page: 0,
  itemPerPage: 5,
  currentBlock: 0,
  eventsCount: 0,
  isFetching: false,
  logsEth: [],
  logsToken: [],
  logs: []
}

const CONNECTION_CHECKER = {
  count: 0,
  maxCount: 2,
  isCheck: true
}

const PORTFOLIO_TAB = {
  overview: 1,
  balance: 2,
  history: 3,
};
const TX_TYPES = {
  send: 'send_token',
  receive: 'receive_token',
  approve: 'approve_token',
  swap: 'swap_token',
  undefined: 'undefined',
};
const MINIMUM_DISPLAY_BALANCE = 0.000001;
const LIST_PARAMS_SUPPORTED = [{ key: 'lang', default: 'en' }, { key: 'ref' }]
const CONFIG_ENV_LEDGER_LINK = "https://support.ledgerwallet.com/hc/en-us/articles/115005165269-What-if-Ledger-Wallet-is-not-recognized-on-Linux-"
const LEDGER_SUPPORT_LINK = "https://support.ledgerwallet.com/hc/en-us"
const BASE_HOST = ""
const ASSET_URL = 'https://files.kyberswap.com/DesignAssets/';
const STORAGE_KEY = "130"
const TRADE_TOPIC = "0xf724b4df6617473612b53d7f88ecc6ea983074b30960a049fcd0657ffe808083"
const LIMIT_ORDER_TOPIC = "0x9d01abd327f261fd9b19b1199ecb4da0499da48fcb528e2868ac72f06235245c"
const CONNECTION_TIMEOUT = 6000
const TX_CONFIRMING_TIMEOUT = 20000;
const GENESIS_ADDRESS = '0x0000000000000000000000000000000000000000';
const SPECIAL_TRANSFER_GAS_LIMIT = {
  'DGX': 330000
};

const LEDGER_DERIVATION_PATHS = [
  { value: "m/44'/60'", desc: 'Ledger Live', bip44: true },
  { value: "m/44'/60'/0'", desc: 'Ledger Legacy' },
  { defaultValue: "m/44'/60'/1'/0", desc: "Your Custom Path", custom: true }
];

const TREZOR_DERIVATION_PATHS = [
  { value: "m/44'/60'/0'/0", desc: 'Trezor (ETH)' },
  { value: "m/44'/61'/0'/0", desc: 'Trezor (ETC)' },
  { defaultValue: "m/44'/60'/1'/0", desc: "Your Custom Path", custom: true }
];

const PAGING = {
  ADDRESS: 5
}

module.exports = {
  ERC20, KYBER_NETWORK, KYBER_WRAPPER, ETHER_ADDRESS, ETH, RESERVES, WETH_SUBSTITUTE_NAME,
  INIT_EXCHANGE_FORM_STATE, INIT_TRANSFER_FORM_STATE, ASSET_URL, IDLE_TIME_OUT, HISTORY_EXCHANGE, STORAGE_KEY,
  CONNECTION_CHECKER,CONFIG_ENV_LEDGER_LINK, LEDGER_SUPPORT_LINK, TRANSFER_TOPIC, BASE_HOST, LIST_PARAMS_SUPPORTED,
  TRADE_TOPIC, CONNECTION_TIMEOUT, INIT_LIMIT_ORDER_STATE, LIMIT_ORDER_CONFIG, SIGN_OFF_WALLETS, KYBER_SWAP_ABI,
  EXCHANGE_CONFIG, TRANSFER_CONFIG, LIMIT_ORDER_TOPIC, TX_CONFIRMING_TIMEOUT, GENESIS_ADDRESS, SPECIAL_TRANSFER_GAS_LIMIT,
  PORTFOLIO_TAB, TX_TYPES, MINIMUM_DISPLAY_BALANCE, DEFAULT_BPS_FEE, LEDGER_DERIVATION_PATHS, TREZOR_DERIVATION_PATHS,
  PAGING
};
