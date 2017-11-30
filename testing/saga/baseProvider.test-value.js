const exchangeRate = [
  {
    balance: "1019309686304031924662",
    dest: "ETH",
    expBlock: "0",
    id: 1,
    rate: "0",
    source: "ETH"
  },
  {
    balance: "56407663000000000810810519",
    dest: "OMG",
    expBlock: "20000000000000000000",
    id: 2,
    rate: "48039187065156927488",
    source: "ETH"
  },
  {
    balance: "1019309686304031924662",
    dest: "ETH",
    expBlock: "20000000000000000000",
    id: 3,
    rate: "216269288029775648",
    source: "DGD"
  }
]

const exchangeLogs = [
  { address: '0x2b7f9AE5a29Ff7c387c8b794Ed1F3CC45BbC57D0',
  blockHash: '0x7269d256ef1e27e81f04a5cfcf5654833e6d50096a13aec4a951cdc9f923fdb8',
  blockNumber: 4921694,
  logIndex: 5,
  transactionHash: '0xc90fa95bd9b6caa7d31e3031b982cebfdd888cbb56e277e75823c6905240dae1',
  transactionIndex: 0,
  transactionLogIndex: '0x5',
  type: 'mined',
  id: 'log_f57197e3',
  returnValues: 
    {
     '0': '0x52249ee04A2860c42704c0bbC74bd82cb9b56e98',
     '1': '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
     '2': '0x8ac48aA26a7E25bE12A9ddC83F6BbDe1594414bB',
     '3': '9999999999999999',
     '4': '4017876736149680947',
     sender: '0x52249ee04A2860c42704c0bbC74bd82cb9b56e98',
     source: '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE',
     dest: '0x8ac48aA26a7E25bE12A9ddC83F6BbDe1594414bB',
     actualSrcAmount: '9999999999999999',
     actualDestAmount: '4017876736149680947' },
  event: 'Trade',
  signature: '0xec0d3e799aa270a144d7e3be084ccfc657450e33ecea1b1a4154c95cedaae5c3',
  raw: 
   { data: '0x000000000000000000000000eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee0000000000000000000000008ac48aa26a7e25be12a9ddc83f6bbde1594414bb000000000000000000000000000000000000000000000000002386f26fc0ffff00000000000000000000000000000000000000000000000037c25d9a9981f333',
     topics: [] } } 
]

export default {
  exchangeRate, exchangeLogs
}